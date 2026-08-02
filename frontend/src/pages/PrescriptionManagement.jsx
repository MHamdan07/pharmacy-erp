import { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Upload,
  Brain,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Search,
  Sparkles,
  RefreshCw,
  XCircle,
  UserCheck,
  Clock,
  ExternalLink
} from 'lucide-react';
import API from '../api/axios';

const PrescriptionManagement = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [doctorName, setDoctorName] = useState('Dr. A. Khan');
  const [rawText, setRawText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [message, setMessage] = useState('');

  const fetchPrescriptions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get('/prescriptions');
      setPrescriptions(res.data.prescriptions || []);
    } catch {
      setMessage('Failed to load prescriptions list');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setMessage('');

    try {
      const res = await API.post('/prescriptions/upload', {
        patientName,
        patientPhone,
        doctorName,
        rawText: rawText || 'Rx: Paracetamol 500mg - 1 tab TDS x 5 days\nAmoxicillin 500mg - 1 cap BD x 7 days'
      });

      setMessage('Prescription uploaded & analyzed by AI OCR!');
      setPatientName('');
      setPatientPhone('');
      setRawText('');
      fetchPrescriptions();
      setSelectedPrescription(res.data.prescription);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to upload prescription');
    } finally {
      setUploading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await API.put(`/prescriptions/${id}/approve`);
      setMessage('Prescription approved by Pharmacist!');
      fetchPrescriptions();
      if (selectedPrescription?._id === id) {
        setSelectedPrescription((prev) => ({ ...prev, status: 'approved' }));
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to approve prescription');
    }
  };

  const filteredList = prescriptions.filter((p) => {
    if (filterStatus === 'all') return true;
    return p.status === filterStatus;
  });

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
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
        <button
          onClick={fetchPrescriptions}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Intake
        </button>
      </div>

      {message && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs rounded-xl flex items-center gap-2">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Main Grid: Upload Form + Prescriptions List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Upload className="w-5 h-5 text-blue-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Intake Prescription</h2>
          </div>

          <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Patient Name</label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Patient Phone</label>
                <input
                  type="text"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="+1 555 0199"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Doctor Name</label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="Dr. A. Khan"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Prescription Text / Scan Input</label>
              <textarea
                rows={3}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Rx: Paracetamol 500mg 1 tab TDS x 5 days..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 placeholder-slate-600 font-mono text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Brain className="w-4 h-4 animate-pulse" />
              {uploading ? 'Scanning & Parsing AI OCR...' : 'Process Prescription with AI OCR'}
            </button>
          </form>
        </div>

        {/* Prescriptions List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-bold text-white">Intake History</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              {['all', 'pending', 'ocr_completed', 'approved'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1 rounded-lg capitalize font-medium transition-all ${
                    filterStatus === st ? 'bg-blue-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredList.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-500 text-xs">
                No prescriptions found in this view. Upload a new prescription to scan.
              </div>
            ) : (
              filteredList.map((p) => (
                <div
                  key={p._id}
                  onClick={() => setSelectedPrescription(p)}
                  className={`p-4 bg-slate-900 border rounded-2xl transition-all cursor-pointer space-y-3 ${
                    selectedPrescription?._id === p._id ? 'border-blue-500 ring-1 ring-blue-500/50' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{p.patientName}</span>
                      <span className="text-slate-500">({p.doctorName})</span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                        p.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {p.status.replace('_', ' ')}
                    </span>
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(p._id);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all flex items-center gap-1 text-[11px] cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Pharmacist Approve
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionManagement;
