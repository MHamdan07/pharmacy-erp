import { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Upload,
  Brain,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import API from '../api/axios';
import { Card, Button, Badge, Skeleton, Input, Textarea, useToast } from '../components/ui';

const PrescriptionManagement = () => {
  const toast = useToast();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [doctorName, setDoctorName] = useState('Dr. A. Khan');
  const [rawText, setRawText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const fetchPrescriptions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get('/prescriptions');
      setPrescriptions(res.data.prescriptions || []);
    } catch {
      toast.error('Failed to load prescriptions list');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const res = await API.post('/prescriptions/upload', {
        patientName,
        patientPhone,
        doctorName,
        rawText: rawText || 'Rx: Paracetamol 500mg - 1 tab TDS x 5 days\nAmoxicillin 500mg - 1 cap BD x 7 days'
      });

      toast.success('Prescription uploaded & analyzed by AI OCR!');
      setPatientName('');
      setPatientPhone('');
      setRawText('');
      fetchPrescriptions();
      setSelectedPrescription(res.data.prescription);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload prescription');
    } finally {
      setUploading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await API.put(`/prescriptions/${id}/approve`);
      toast.success('Prescription approved by Pharmacist!');
      fetchPrescriptions();
      if (selectedPrescription?._id === id) {
        setSelectedPrescription((prev) => ({ ...prev, status: 'approved' }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve prescription');
    }
  };

  const filteredList = prescriptions.filter((p) => {
    if (filterStatus === 'all') return true;
    return p.status === filterStatus;
  });

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen font-sans">
      {/* Header */}
      <Card variant="glass" className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Prescription & AI OCR Studio</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Scan handwritten prescriptions, extract dosage with AI OCR, and manage pharmacist approvals.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          leftIcon={RefreshCw}
          loading={loading}
          onClick={fetchPrescriptions}
        >
          Refresh Intake
        </Button>
      </Card>

      {/* Main Grid: Upload Form + Prescriptions List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload Form */}
        <Card variant="glass" className="lg:col-span-5 p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Upload className="w-5 h-5 text-blue-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Intake Prescription</h2>
          </div>

          <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
            <Input
              label="Patient Name"
              type="text"
              required
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. John Doe"
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Patient Phone"
                type="text"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                placeholder="+1 555 0199"
              />
              <Input
                label="Doctor Name"
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="Dr. A. Khan"
              />
            </div>

            <Textarea
              label="Prescription Text / Scan Input"
              rows={3}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Rx: Paracetamol 500mg 1 tab TDS x 5 days..."
              className="font-mono"
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={uploading}
              leftIcon={Brain}
              className="shadow-lg shadow-blue-500/20"
            >
              {uploading ? 'Scanning & Parsing AI OCR...' : 'Process Prescription with AI OCR'}
            </Button>
          </form>
        </Card>

        {/* Prescriptions List */}
        <div className="lg:col-span-7 space-y-4">
          <Card variant="glass" className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-bold text-white">Intake History</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              {['all', 'pending', 'ocr_completed', 'approved'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1 rounded-lg capitalize font-medium transition-all cursor-pointer ${
                    filterStatus === st ? 'bg-blue-600 text-white font-bold' : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </Card>

          <div className="space-y-3">
            {loading ? (
              <Skeleton.Card className="h-32" />
            ) : filteredList.length === 0 ? (
              <Card variant="glass" className="p-8 text-center text-slate-500 text-xs">
                No prescriptions found in this view. Upload a new prescription to scan.
              </Card>
            ) : (
              filteredList.map((p) => (
                <Card
                  key={p._id}
                  variant="glass"
                  onClick={() => setSelectedPrescription(p)}
                  className={`p-4 transition-all cursor-pointer space-y-3 ${
                    selectedPrescription?._id === p._id ? 'border-blue-500 ring-1 ring-blue-500/50' : 'hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{p.patientName}</span>
                      <span className="text-slate-500">({p.doctorName})</span>
                    </div>
                    <Badge
                      variant={p.status === 'approved' ? 'success' : 'warning'}
                      size="sm"
                    >
                      {p.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="p-2.5 bg-slate-950 rounded-xl text-xs font-mono text-slate-300 space-y-1">
                    <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest flex items-center gap-1">
                      <Brain className="w-3 h-3" /> AI Extracted Medications:
                    </div>
                    {p.extractedMedicines.map((m, idx) => (
                      <div key={idx} className="flex justify-between border-b border-slate-900 pb-1">
                        <span>• {m.medicineName} ({m.dosageFrequency})</span>
                        <span className="text-emerald-400 font-bold">${(m.unitPrice * m.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {p.drugInteractionAlerts?.length > 0 && (
                    <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Drug Safety Note: </span>
                        {p.drugInteractionAlerts[0].warningMessage}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-400 font-medium">Total: <strong className="text-white">${p.totalAmount.toFixed(2)}</strong></span>
                    {p.status !== 'approved' && (
                      <Button
                        variant="success"
                        size="sm"
                        leftIcon={CheckCircle2}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(p._id);
                        }}
                      >
                        Pharmacist Approve
                      </Button>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionManagement;
