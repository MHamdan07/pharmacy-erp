import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Prisma Postgres database seeding...');

  // 1. Clean existing records in reverse dependency order
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.backup.deleteMany();
  await prisma.transferItem.deleteMany();
  await prisma.stockTransfer.deleteMany();
  await prisma.saleItem.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.batch.deleteMany();
  await prisma.medicine.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.category.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.user.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.pharmacy.deleteMany();

  console.log('🧹 Cleaned existing tables successfully.');

  const hashedPassword = await bcrypt.hash('Pharmacy123!', 10);
  const superAdminPassword = await bcrypt.hash('SuperAdmin123!', 10);

  // 2. Create Global SuperAdmin
  const superAdmin = await prisma.user.create({
    data: {
      name: 'System SuperAdmin',
      email: 'superadmin@pharmacyerp.com',
      password: superAdminPassword,
      role: 'SuperAdmin',
    },
  });
  console.log(`👤 Created SuperAdmin: ${superAdmin.email}`);

  // 3. Create Tenant 1: HealthCare Pharmacy
  const healthcare = await prisma.pharmacy.create({
    data: {
      name: 'HealthCare Pharmacy',
      slug: 'healthcare-pharmacy',
      email: 'contact@healthcare.com',
      phone: '+1-555-0199',
      address: '100 Medical Center Drive, Suite 10, Healthcare City',
      status: 'active',
    },
  });

  // Create Subscription for Tenant 1
  const subHealthcare = await prisma.subscription.create({
    data: {
      pharmacyId: healthcare.id,
      planName: 'Professional',
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    },
  });

  // Branches for Tenant 1
  const mainBranch = await prisma.branch.create({
    data: {
      pharmacyId: healthcare.id,
      name: 'Main Branch - Downtown',
      code: 'MAIN-01',
      address: '100 Medical Center Drive',
      phone: '+1-555-0199',
      type: 'Main',
    },
  });

  const westBranch = await prisma.branch.create({
    data: {
      pharmacyId: healthcare.id,
      name: 'Westside Express',
      code: 'WEST-02',
      address: '45 West Avenue',
      phone: '+1-555-0288',
      type: 'Branch',
    },
  });

  // Users for Tenant 1
  const ownerUser = await prisma.user.create({
    data: {
      pharmacyId: healthcare.id,
      branchId: mainBranch.id,
      name: 'Dr. Arthur Pendelton',
      email: 'owner@healthcare.com',
      password: hashedPassword,
      role: 'Owner',
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      pharmacyId: healthcare.id,
      branchId: mainBranch.id,
      name: 'Eleanor Vance',
      email: 'admin@healthcare.com',
      password: hashedPassword,
      role: 'Admin',
    },
  });

  const pharmacistUser = await prisma.user.create({
    data: {
      pharmacyId: healthcare.id,
      branchId: mainBranch.id,
      name: 'Marcus Brody',
      email: 'pharmacist@healthcare.com',
      password: hashedPassword,
      role: 'Pharmacist',
    },
  });

  const cashierUser = await prisma.user.create({
    data: {
      pharmacyId: healthcare.id,
      branchId: mainBranch.id,
      name: 'Clara Oswald',
      email: 'cashier@healthcare.com',
      password: hashedPassword,
      role: 'Cashier',
    },
  });

  // Categories
  const catAntibiotics = await prisma.category.create({
    data: {
      pharmacyId: healthcare.id,
      name: 'Antibiotics',
      description: 'Bacterial infection medications',
    },
  });

  const catAnalgesics = await prisma.category.create({
    data: {
      pharmacyId: healthcare.id,
      name: 'Analgesics & Pain Relief',
      description: 'Pain management and fever reduction',
    },
  });

  const catCardio = await prisma.category.create({
    data: {
      pharmacyId: healthcare.id,
      name: 'Cardiovascular',
      description: 'Heart and blood pressure treatments',
    },
  });

  const catVitamins = await prisma.category.create({
    data: {
      pharmacyId: healthcare.id,
      name: 'Vitamins & Supplements',
      description: 'Nutritional and immune system support',
    },
  });

  // Suppliers
  const suppPharmaCorp = await prisma.supplier.create({
    data: {
      pharmacyId: healthcare.id,
      name: 'PharmaCorp International',
      contactPerson: 'David Miller',
      email: 'orders@pharmacorp.com',
      phone: '+1-800-555-9000',
    },
  });

  const suppGlobalMeds = await prisma.supplier.create({
    data: {
      pharmacyId: healthcare.id,
      name: 'GlobalMeds Wholesalers',
      contactPerson: 'Samantha Reed',
      email: 'supply@globalmeds.com',
      phone: '+1-800-555-4321',
    },
  });

  // Medicines
  const medAmox = await prisma.medicine.create({
    data: {
      pharmacyId: healthcare.id,
      categoryId: catAntibiotics.id,
      supplierId: suppPharmaCorp.id,
      name: 'Amoxicillin 500mg Capsules',
      genericName: 'Amoxicillin Trihydrate',
      barcode: '8901234567890',
      sku: 'AMX-500MG',
      minStockLevel: 50,
      unitPrice: 14.50,
    },
  });

  const medPara = await prisma.medicine.create({
    data: {
      pharmacyId: healthcare.id,
      categoryId: catAnalgesics.id,
      supplierId: suppGlobalMeds.id,
      name: 'Paracetamol Extra 650mg',
      genericName: 'Acetaminophen / Caffeine',
      barcode: '8909876543210',
      sku: 'PCM-650MG',
      minStockLevel: 100,
      unitPrice: 8.25,
    },
  });

  const medIbu = await prisma.medicine.create({
    data: {
      pharmacyId: healthcare.id,
      categoryId: catAnalgesics.id,
      supplierId: suppGlobalMeds.id,
      name: 'Ibuprofen 400mg Film-Coated',
      genericName: 'Ibuprofen',
      barcode: '8901122334455',
      sku: 'IBU-400MG',
      minStockLevel: 40,
      unitPrice: 11.00,
    },
  });

  const medAtorva = await prisma.medicine.create({
    data: {
      pharmacyId: healthcare.id,
      categoryId: catCardio.id,
      supplierId: suppPharmaCorp.id,
      name: 'Atorvastatin 20mg Tablets',
      genericName: 'Atorvastatin Calcium',
      barcode: '8905544332211',
      sku: 'ATV-20MG',
      minStockLevel: 30,
      unitPrice: 28.00,
    },
  });

  // Batches (FEFO Inventory)
  const batchAmox1 = await prisma.batch.create({
    data: {
      pharmacyId: healthcare.id,
      branchId: mainBranch.id,
      medicineId: medAmox.id,
      supplierId: suppPharmaCorp.id,
      batchNumber: 'BATCH-AMX-2026A',
      quantity: 250,
      purchasePrice: 9.00,
      sellingPrice: 14.50,
      expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 180 days out
      mfgDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    },
  });

  const batchAmox2NearExpiry = await prisma.batch.create({
    data: {
      pharmacyId: healthcare.id,
      branchId: mainBranch.id,
      medicineId: medAmox.id,
      supplierId: suppPharmaCorp.id,
      batchNumber: 'BATCH-AMX-NEAR',
      quantity: 85,
      purchasePrice: 8.50,
      sellingPrice: 14.50,
      expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days (Near Expiry)
      mfgDate: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000),
    },
  });

  const batchPara1 = await prisma.batch.create({
    data: {
      pharmacyId: healthcare.id,
      branchId: mainBranch.id,
      medicineId: medPara.id,
      supplierId: suppGlobalMeds.id,
      batchNumber: 'BATCH-PCM-2026A',
      quantity: 450,
      purchasePrice: 4.80,
      sellingPrice: 8.25,
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      mfgDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
  });

  const batchIbuWest = await prisma.batch.create({
    data: {
      pharmacyId: healthcare.id,
      branchId: westBranch.id,
      medicineId: medIbu.id,
      supplierId: suppGlobalMeds.id,
      batchNumber: 'BATCH-IBU-WEST1',
      quantity: 180,
      purchasePrice: 6.50,
      sellingPrice: 11.00,
      expiryDate: new Date(Date.now() + 240 * 24 * 60 * 60 * 1000),
      mfgDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
    },
  });

  // Customers
  const custJohn = await prisma.customer.create({
    data: {
      pharmacyId: healthcare.id,
      name: 'John Smith',
      phone: '+1-555-8811',
      email: 'john.smith@gmail.com',
      loyaltyPoints: 120,
    },
  });

  const custSarah = await prisma.customer.create({
    data: {
      pharmacyId: healthcare.id,
      name: 'Sarah Connor',
      phone: '+1-555-9922',
      email: 'sarah.connor@sky.net',
      loyaltyPoints: 450,
    },
  });

  // POS Sale Transaction
  const sale1 = await prisma.sale.create({
    data: {
      pharmacyId: healthcare.id,
      branchId: mainBranch.id,
      cashierId: cashierUser.id,
      customerId: custJohn.id,
      invoiceNumber: 'INV-20260801-0001',
      subtotal: 37.25,
      discount: 2.25,
      tax: 2.50,
      totalAmount: 37.50,
      paymentMethod: 'card',
      status: 'completed',
      items: {
        create: [
          {
            medicineId: medAmox.id,
            batchId: batchAmox2NearExpiry.id,
            quantity: 2,
            unitPrice: 14.50,
            totalPrice: 29.00,
          },
          {
            medicineId: medPara.id,
            batchId: batchPara1.id,
            quantity: 1,
            unitPrice: 8.25,
            totalPrice: 8.25,
          },
        ],
      },
    },
  });

  // Audit Logs
  await prisma.auditLog.create({
    data: {
      pharmacyId: healthcare.id,
      userId: ownerUser.id,
      action: 'TENANT_INITIALIZED',
      entity: 'Pharmacy',
      entityId: healthcare.id,
      details: 'HealthCare Pharmacy tenant onboarding completed.',
    },
  });

  await prisma.auditLog.create({
    data: {
      pharmacyId: healthcare.id,
      userId: cashierUser.id,
      action: 'POS_SALE_COMPLETED',
      entity: 'Sale',
      entityId: sale1.id,
      details: `Invoice INV-20260801-0001 completed ($37.50 via Card).`,
    },
  });

  // 4. Create Tenant 2: MediLife Pharma
  const medilife = await prisma.pharmacy.create({
    data: {
      name: 'MediLife Pharma',
      slug: 'medilife-pharma',
      email: 'info@medilife.com',
      phone: '+1-555-0300',
      address: '750 Northside Boulevard',
      status: 'active',
    },
  });

  await prisma.branch.create({
    data: {
      pharmacyId: medilife.id,
      name: 'Northside Care',
      code: 'NORTH-01',
      address: '750 Northside Blvd',
      phone: '+1-555-0300',
      type: 'Main',
    },
  });

  await prisma.user.create({
    data: {
      pharmacyId: medilife.id,
      name: 'Dr. Gregory House',
      email: 'owner@medilife.com',
      password: hashedPassword,
      role: 'Owner',
    },
  });

  console.log('✅ Seeding completed successfully!');
  console.log('---------------------------------------------------------');
  console.log('🔑 Credentials Created:');
  console.log('  SuperAdmin: superadmin@pharmacyerp.com / SuperAdmin123!');
  console.log('  Tenant 1 Owner: owner@healthcare.com / Pharmacy123!');
  console.log('  Tenant 1 Cashier: cashier@healthcare.com / Pharmacy123!');
  console.log('  Tenant 2 Owner: owner@medilife.com / Pharmacy123!');
  console.log('---------------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
