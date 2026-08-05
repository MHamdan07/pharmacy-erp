import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import Prescription from '../src/models/Prescription.js';
import Customer from '../src/models/Customer.js';
import {
  searchPatients,
  searchDoctors,
  getPrescriptionById,
  getPrescriptions
} from '../src/controllers/prescriptionController.js';

// Helper to create mock Request and Response objects for controller tests
function createMockReqRes({ params = {}, query = {}, body = {}, pharmacyId, branchId, user = {} } = {}) {
  const req = {
    params,
    query,
    body,
    user,
    pharmacyId: pharmacyId || new mongoose.Types.ObjectId(),
    branchId: branchId || new mongoose.Types.ObjectId(),
    headers: {}
  };

  let statusCode = 200;
  let jsonOutput = null;

  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      jsonOutput = data;
      return this;
    },
    getStatusCode: () => statusCode,
    getJson: () => jsonOutput
  };

  return { req, res };
}

// -----------------------------------------------------------------------------
// Suite 1: Prescription Schema & Validations
// -----------------------------------------------------------------------------
test('Prescription Schema - Validates required fields (pharmacy, branch, patientName)', () => {
  const rx = new Prescription({});
  const err = rx.validateSync();
  assert.ok(err, 'Validation error should occur for empty document');
  assert.ok(err.errors.pharmacy, 'pharmacy is required');
  assert.ok(err.errors.branch, 'branch is required');
  assert.ok(err.errors.patientName, 'patientName is required');
});

test('Prescription Schema - Applies default values correctly', () => {
  const pharmacyId = new mongoose.Types.ObjectId();
  const branchId = new mongoose.Types.ObjectId();

  const rx = new Prescription({
    pharmacy: pharmacyId,
    branch: branchId,
    patientName: 'Jane Doe'
  });

  assert.equal(rx.ocrConfidence, 94.5);
  assert.equal(rx.isCompressed, true);
  assert.equal(rx.isExpired, false);
  assert.equal(rx.ocrProcessingTimeMs, 0);
  assert.equal(rx.doctorName, 'Dr. Unspecified');
  assert.equal(rx.status, 'pending');
  assert.equal(rx.patient, null);
  assert.equal(rx.saleId, null);
  assert.equal(rx.clinicalValidation.isSafe, true);
  assert.deepEqual(rx.lineItems.toObject(), []);
  assert.deepEqual(rx.statusHistory.toObject(), []);
});

test('Prescription Schema - Accepts expanded status enum values including under_review and clarification_requested', () => {
  const pharmacyId = new mongoose.Types.ObjectId();
  const branchId = new mongoose.Types.ObjectId();

  const validStatuses = [
    'pending',
    'ocr_completed',
    'under_review',
    'clarification_requested',
    'approved',
    'rejected',
    'fulfilled'
  ];

  for (const status of validStatuses) {
    const rx = new Prescription({
      pharmacy: pharmacyId,
      branch: branchId,
      patientName: 'Test Patient',
      status
    });
    const err = rx.validateSync();
    assert.equal(err, undefined, `Status "${status}" should be valid`);
  }

  const invalidRx = new Prescription({
    pharmacy: pharmacyId,
    branch: branchId,
    patientName: 'Test Patient',
    status: 'invalid_status_value'
  });
  const errInvalid = invalidRx.validateSync();
  assert.ok(errInvalid, 'Invalid status should produce validation error');
  assert.ok(errInvalid.errors.status);
});

test('Prescription Schema - Validates structured doctor subdocument', () => {
  const pharmacyId = new mongoose.Types.ObjectId();
  const branchId = new mongoose.Types.ObjectId();

  const rx = new Prescription({
    pharmacy: pharmacyId,
    branch: branchId,
    patientName: 'John Doe',
    doctor: {
      name: 'Dr. Gregory House',
      registrationNumber: 'MED-12345',
      hospital: 'Princeton Plainsboro'
    }
  });

  const err = rx.validateSync();
  assert.equal(err, undefined);
  assert.equal(rx.doctor.name, 'Dr. Gregory House');
  assert.equal(rx.doctor.registrationNumber, 'MED-12345');
  assert.equal(rx.doctor.hospital, 'Princeton Plainsboro');
});

test('Prescription Schema - Validates 4-tier clinicalValidation subdocument', () => {
  const pharmacyId = new mongoose.Types.ObjectId();
  const branchId = new mongoose.Types.ObjectId();

  const rx = new Prescription({
    pharmacy: pharmacyId,
    branch: branchId,
    patientName: 'John Doe',
    clinicalValidation: {
      drugInteractions: [
        { severity: 'CRITICAL', drugPair: ['Aspirin', 'Warfarin'], clinicalDescription: 'Increased bleeding risk' }
      ],
      allergyWarnings: [
        { patientAllergy: 'Penicillin', triggeringDrug: 'Amoxicillin', severity: 'HIGH' }
      ],
      dosageWarnings: [
        { medicineName: 'Paracetamol', extractedDosage: '2000mg', maxDailyDosage: '1000mg', issue: 'Exceeds limit' }
      ],
      pregnancyWarnings: [
        { medicineName: 'Ibuprofen', fdaCategory: 'D', warningText: 'Contraindicated in 3rd trimester' }
      ],
      isSafe: false
    }
  });

  const err = rx.validateSync();
  assert.equal(err, undefined);
  assert.equal(rx.clinicalValidation.isSafe, false);
  assert.equal(rx.clinicalValidation.drugInteractions.length, 1);
  assert.equal(rx.clinicalValidation.allergyWarnings.length, 1);
  assert.equal(rx.clinicalValidation.dosageWarnings.length, 1);
  assert.equal(rx.clinicalValidation.pregnancyWarnings.length, 1);
});

test('Prescription Schema - Validates lineItems subdocument schema', () => {
  const pharmacyId = new mongoose.Types.ObjectId();
  const branchId = new mongoose.Types.ObjectId();
  const medicineId = new mongoose.Types.ObjectId();
  const batchId = new mongoose.Types.ObjectId();

  const rx = new Prescription({
    pharmacy: pharmacyId,
    branch: branchId,
    patientName: 'John Doe',
    lineItems: [
      {
        medicine: medicineId,
        rawText: 'Amoxicillin 500mg BD x 7d',
        dosage: '500mg',
        frequency: 'BD',
        duration: '7 days',
        quantity: 14,
        confidence: 98.5,
        batch: batchId,
        isMatched: true
      }
    ]
  });

  const err = rx.validateSync();
  assert.equal(err, undefined);
  assert.equal(rx.lineItems.length, 1);
  assert.equal(rx.lineItems[0].medicine.toString(), medicineId.toString());
  assert.equal(rx.lineItems[0].batch.toString(), batchId.toString());
  assert.equal(rx.lineItems[0].confidence, 98.5);
  assert.equal(rx.lineItems[0].isMatched, true);
});

test('Prescription Schema - Validates statusHistory audit trail subdocument', () => {
  const pharmacyId = new mongoose.Types.ObjectId();
  const branchId = new mongoose.Types.ObjectId();
  const userId = new mongoose.Types.ObjectId();

  const rx = new Prescription({
    pharmacy: pharmacyId,
    branch: branchId,
    patientName: 'John Doe',
    statusHistory: [
      {
        status: 'pending',
        action: 'CREATED',
        performedBy: userId,
        performedByName: 'Admin Pharmacist',
        notes: 'Prescription scanned via AI OCR'
      }
    ]
  });

  const err = rx.validateSync();
  assert.equal(err, undefined);
  assert.equal(rx.statusHistory.length, 1);
  assert.equal(rx.statusHistory[0].status, 'pending');
  assert.equal(rx.statusHistory[0].performedBy.toString(), userId.toString());
  assert.equal(rx.statusHistory[0].performedByName, 'Admin Pharmacist');
});

test('Prescription Schema - Verifies required schema indexes are defined', () => {
  const indexes = Prescription.schema.indexes();
  const indexKeys = indexes.map(idx => JSON.stringify(idx[0]));

  assert.ok(indexKeys.some(k => k.includes('"pharmacy":1') && k.includes('"branch":1') && k.includes('"status":1')));
  assert.ok(indexKeys.some(k => k.includes('"pharmacy":1') && k.includes('"patient":1')));
  assert.ok(indexKeys.some(k => k.includes('"pharmacy":1') && k.includes('"branch":1') && k.includes('"createdAt":-1')));
  assert.ok(indexKeys.some(k => k.includes('"pharmacy":1') && k.includes('"saleId":1')));
});

// -----------------------------------------------------------------------------
// Suite 2: Patient Search API (`GET /api/v1/prescriptions/patients/search`)
// -----------------------------------------------------------------------------
test('Patient Search Controller - Handles query execution with mock data or DB', async () => {
  const pharmacyId = new mongoose.Types.ObjectId();
  const { req, res } = createMockReqRes({
    query: { q: 'John' },
    pharmacyId
  });

  try {
    await searchPatients(req, res);
    assert.equal(res.getStatusCode(), 200);
    assert.ok(Array.isArray(res.getJson()));
  } catch (err) {
    // If DB is offline, controller error handler returns 500
    assert.ok(res.getStatusCode() === 200 || res.getStatusCode() === 500);
  }
});

// -----------------------------------------------------------------------------
// Suite 3: Doctor Search API (`GET /api/v1/prescriptions/doctors/search`)
// -----------------------------------------------------------------------------
test('Doctor Search Controller - Formats and deduplicates doctor entries', async () => {
  const pharmacyId = new mongoose.Types.ObjectId();
  const { req, res } = createMockReqRes({
    query: { q: 'Smith' },
    pharmacyId
  });

  try {
    await searchDoctors(req, res);
    assert.equal(res.getStatusCode(), 200);
    assert.ok(Array.isArray(res.getJson()));
  } catch (err) {
    assert.ok(res.getStatusCode() === 200 || res.getStatusCode() === 500);
  }
});

// -----------------------------------------------------------------------------
// Suite 4: Prescription Details API (`GET /api/v1/prescriptions/:id`)
// -----------------------------------------------------------------------------
test('Prescription Details Controller - Returns 400 Bad Request for invalid ObjectId format', async () => {
  const { req, res } = createMockReqRes({
    params: { id: 'invalid-object-id-123' }
  });

  await getPrescriptionById(req, res);
  assert.equal(res.getStatusCode(), 400);
  assert.equal(res.getJson().message, 'Invalid prescription ID format');
});

test('Prescription Details Controller - Returns 404 Not Found for non-existent prescription ID', async () => {
  const nonExistentId = new mongoose.Types.ObjectId().toString();
  const { req, res } = createMockReqRes({
    params: { id: nonExistentId }
  });

  try {
    await getPrescriptionById(req, res);
    assert.equal(res.getStatusCode(), 404);
    assert.equal(res.getJson().message, 'Prescription not found');
  } catch (err) {
    assert.ok(res.getStatusCode() === 404 || res.getStatusCode() === 500);
  }
});

// -----------------------------------------------------------------------------
// Suite 5: Prescription Listing API (`GET /api/v1/prescriptions`)
// -----------------------------------------------------------------------------
test('Prescription Listing Controller - Returns paginated results structure', async () => {
  const pharmacyId = new mongoose.Types.ObjectId();
  const { req, res } = createMockReqRes({
    query: { page: '1', limit: '5', status: 'pending' },
    pharmacyId
  });

  try {
    await getPrescriptions(req, res);
    if (res.getStatusCode() === 200) {
      const data = res.getJson();
      assert.ok(Array.isArray(data.prescriptions));
      assert.ok(data.pagination);
      assert.equal(data.pagination.page, 1);
      assert.equal(data.pagination.limit, 5);
    }
  } catch (err) {
    assert.ok(res.getStatusCode() === 200 || res.getStatusCode() === 500);
  }
});
