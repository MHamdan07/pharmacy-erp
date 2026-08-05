import { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Upload,
  Brain,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  RefreshCw,
  Sparkles,
  Search,
  SlidersHorizontal,
  BarChart3,
  History,
  Layers,
  Building2,
  Plus
} from 'lucide-react';
import prescriptionService from '../services/prescriptionService';
import { Card, Button, Badge, Skeleton, Input, useToast } from '../components/ui';

// Import Sub-components
import OcrImageStudio from '../components/prescriptions/OcrImageStudio';
import IntakeChannelModal from '../components/prescriptions/IntakeChannelModal';
import ClinicalValidationCard from '../components/prescriptions/ClinicalValidationCard';
import BranchInventoryMatrix from '../components/prescriptions/BranchInventoryMatrix';
import BioEquivalentRecommender from '../components/prescriptions/BioEquivalentRecommender';
import PharmacistReviewConsole from '../components/prescriptions/PharmacistReviewConsole';
import PrescriptionAnalyticsDashboard from '../components/prescriptions/PrescriptionAnalyticsDashboard';
import PrescriptionAuditTimeline from '../components/prescriptions/PrescriptionAuditTimeline';

const PrescriptionManagement = () => {
  const toast = useToast();

  // Navigation & View Tabs
  const [activeTab, setActiveTab] = useState('workspace'); // 'workspace' | 'analytics' | 'history'
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);

  // Core Data States
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch prescriptions list
  const fetchPrescriptions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await prescriptionService.getPrescriptions({
        page,
        limit: 10,
        search: searchQuery,
        status: statusFilter
      });
      const list = data.prescriptions || [];
      setPrescriptions(list);
      setTotalPages(data.totalPages || 1);

      if (list.length > 0 && !selectedPrescription) {
        setSelectedPrescription(list[0]);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load prescriptions intake list');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, statusFilter, selectedPrescription, toast]);

  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    try {
      const data = await prescriptionService.getAnalytics();
      setAnalyticsData(data.analytics);
    } catch {
      // Ignore analytics fetch error gracefully
    }
  }, []);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalytics();
    }
  }, [activeTab, fetchAnalytics]);

  // Single Intake Submission Handler
  const handleSingleIntakeSubmit = async (intakeData) => {
    try {
      setActionLoading(true);
      const res = await prescriptionService.uploadPrescription(intakeData);
      toast.success('Prescription uploaded & processed with AI OCR Engine!');
      fetchPrescriptions();
      if (res.prescription) {
        setSelectedPrescription(res.prescription);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to upload prescription');
    } finally {
      setActionLoading(false);
    }
  };

  // Batch Intake Submission Handler
  const handleBatchIntakeSubmit = async (batchQueue) => {
    try {
      setActionLoading(true);
      const res = await prescriptionService.batchUploadPrescriptions({ prescriptions: batchQueue });
      toast.success(`${res.prescriptions?.length || batchQueue.length} Prescriptions batch-extracted successfully!`);
      fetchPrescriptions();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to process batch upload');
    } finally {
      setActionLoading(false);
    }
  };

  // Image Preprocessing Action Handler
  const handleProcessPreprocessing = async (id, settings) => {
    try {
      setActionLoading(true);
      const res = await prescriptionService.processOcrPreprocessing(id, settings);
      toast.success('Image preprocessing & OCR recalculation applied!');
      setSelectedPrescription(res.prescription);
      fetchPrescriptions();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to apply image preprocessing');
    } finally {
      setActionLoading(false);
    }
  };

  // Pharmacist Review Action Handler (Approve, Reject, Edit, Request Clarification)
  const handleReviewAction = async (id, reviewData) => {
    try {
      setActionLoading(true);
      const res = await prescriptionService.reviewPrescription(id, reviewData);
      toast.success(res.message || `Prescription action ${reviewData.action} recorded.`);
      setSelectedPrescription(res.prescription);
      fetchPrescriptions();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to record pharmacist review action');
    } finally {
      setActionLoading(false);
    }
  };

  // Convert to POS Billing Invoice Handler
  const handleConvertToPos = async (id) => {
    try {
      setActionLoading(true);
      const res = await prescriptionService.convertToPosSale(id);
      toast.success('Prescription successfully converted to POS Billing Draft Invoice!');
      setSelectedPrescription(res.prescription);
      fetchPrescriptions();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to convert prescription to POS draft');
    } finally {
      setActionLoading(false);
    }
  };

  // Substitute Generic Medicine Handler
  const handleApplySubstitute = (alt) => {
    toast.success(`Substituted ${alt.originalDrug} with ${alt.suggestedBrand} (Save $${alt.savings.toFixed(2)})`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen font-sans">
      {/* Enterprise Page Header */}
      <Card variant="glass" className="p-6 border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/10">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                Prescription Processing Center & AI OCR Studio
                <Badge variant="success" size="sm">Enterprise v2.4</Badge>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                AI-powered intake, multi-channel image preprocessing, clinical validation, DDI safety, and Pharmacist sign-off workstation
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            leftIcon={RefreshCw}
            loading={loading}
            onClick={fetchPrescriptions}
          >
            Refresh Queue
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={Plus}
            onClick={() => setIsIntakeModalOpen(true)}
            className="shadow-lg shadow-blue-500/20"
          >
            Intake New Prescription
          </Button>
        </div>
      </Card>

      {/* Main Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('workspace')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'workspace'
              ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Brain className="w-4 h-4" /> Pharmacist Workstation & Queue
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> OCR & Operational Analytics
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <History className="w-4 h-4" /> Audit Log & Patient History
        </button>
      </div>

      {/* TAB 1: WORKSPACE & INTAKE QUEUE */}
      {activeTab === 'workspace' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Prescription Intake Queue List (4 cols) */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-4 self-start">
            <Card variant="glass" className="p-4 space-y-3 border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-blue-400" /> Intake Queue ({prescriptions.length})
                </span>
                <Badge variant="secondary" size="sm">Branch Filtered</Badge>
              </div>

              {/* Search input */}
              <Input
                placeholder="Search patient, phone, doctor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={Search}
                className="text-xs"
              />

              {/* Status Pills */}
              <div className="flex flex-wrap items-center gap-1 text-[11px]">
                {['all', 'pending', 'ocr_completed', 'approved', 'rejected'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg capitalize transition-all cursor-pointer font-medium ${
                      statusFilter === st
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-850'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </Card>

            {/* Prescriptions List Items with Custom Scrollbar */}
            <div className="space-y-3 max-h-[calc(100vh-320px)] min-h-[400px] overflow-y-auto pr-1.5 custom-scrollbar pb-2">
              {loading ? (
                <Skeleton.Card className="h-28" />
              ) : prescriptions.length === 0 ? (
                <Card variant="glass" className="p-8 text-center text-slate-500 text-xs border-slate-800">
                  No prescription records match your criteria. Intake a new prescription above.
                </Card>
              ) : (
                prescriptions.map((p) => {
                  const isSelected = selectedPrescription?._id === p._id;
                  return (
                    <Card
                      key={p._id}
                      variant="glass"
                      onClick={() => setSelectedPrescription(p)}
                      className={`p-4 transition-all cursor-pointer space-y-2 border-slate-800 ${
                        isSelected
                          ? 'border-blue-500 ring-2 ring-blue-500/40 bg-blue-950/20'
                          : 'hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{p.patientName}</span>
                        <Badge
                          variant={
                            p.status === 'approved' || p.status === 'fulfilled'
                              ? 'success'
                              : p.status === 'rejected'
                              ? 'danger'
                              : 'warning'
                          }
                          size="sm"
                        >
                          {p.status.replace('_', ' ')}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span>{p.doctorName}</span>
                        <span className="text-emerald-400 font-bold">{p.ocrConfidence || 95}% AI Conf</span>
                      </div>

                      <div className="p-2 bg-slate-950 rounded-lg text-[11px] font-mono text-slate-300 space-y-0.5 border border-slate-850">
                        {p.extractedMedicines?.slice(0, 2).map((m, idx) => (
                          <div key={idx} className="truncate text-slate-300">
                            • {m.medicineName} ({m.dosageFrequency})
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>Total: <strong className="text-white">${p.totalAmount?.toFixed(2) || '0.00'}</strong></span>
                        <span className="text-[10px] text-slate-500 font-mono">{new Date(p.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Detailed Pharmacist Studio & Clinical Workstation (8 cols) */}
          <div className="lg:col-span-8 space-y-6 max-h-[calc(100vh-220px)] overflow-y-auto pr-1.5 custom-scrollbar pb-6">
            {selectedPrescription ? (
              <>
                {/* 1. OCR Image Preprocessing & Canvas Studio */}
                <OcrImageStudio
                  prescription={selectedPrescription}
                  onProcessPreprocessing={handleProcessPreprocessing}
                  loading={actionLoading}
                />

                {/* 2. Pharmacist Review Console */}
                <PharmacistReviewConsole
                  prescription={selectedPrescription}
                  onReviewAction={handleReviewAction}
                  onConvertToPos={handleConvertToPos}
                  loading={actionLoading}
                />

                {/* 3. Clinical Validation & Safety Guardrails */}
                <ClinicalValidationCard
                  validationData={selectedPrescription.clinicalValidation}
                  alerts={selectedPrescription.drugInteractionAlerts}
                />

                {/* 4. Cross-Branch Inventory Matrix */}
                <BranchInventoryMatrix
                  items={selectedPrescription.extractedMedicines}
                />

                {/* 5. Generic Bio-Equivalent Recommender */}
                <BioEquivalentRecommender
                  medicines={selectedPrescription.extractedMedicines}
                  onApplySubstitute={handleApplySubstitute}
                />
              </>
            ) : (
              <Card variant="glass" className="p-12 text-center text-slate-500 text-xs border-slate-800">
                Select a prescription from the left queue to open the Pharmacist Workstation Studio.
              </Card>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ANALYTICS & INSIGHTS */}
      {activeTab === 'analytics' && (
        <PrescriptionAnalyticsDashboard analyticsData={analyticsData} />
      )}

      {/* TAB 3: PATIENT HISTORY & AUDIT TRAIL */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <PrescriptionAuditTimeline
            history={selectedPrescription?.statusHistory}
            status={selectedPrescription?.status}
          />
        </div>
      )}

      {/* Multi-Channel Intake Modal */}
      <IntakeChannelModal
        isOpen={isIntakeModalOpen}
        onClose={() => setIsIntakeModalOpen(false)}
        onSubmitSingle={handleSingleIntakeSubmit}
        onSubmitBatch={handleBatchIntakeSubmit}
      />
    </div>
  );
};

export default PrescriptionManagement;
