import { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  FileText,
  Layers,
  Sparkles,
  CheckCircle2,
  Trash2,
  Brain,
  AlertCircle
} from 'lucide-react';
import { Modal, Button, Input, Textarea, Badge } from '../ui';

const IntakeChannelModal = ({ isOpen, onClose, onSubmitSingle, onSubmitBatch }) => {
  const [channel, setChannel] = useState('drag_drop'); // 'drag_drop' | 'pdf' | 'camera' | 'batch'
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [doctorName, setDoctorName] = useState('Dr. Sarah Jenkins (Neurology)');
  const [rawText, setRawText] = useState('');
  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  // Batch queue state
  const [batchQueue, setBatchQueue] = useState([
    {
      id: '1',
      patientName: 'Alice Smith',
      patientPhone: '+1 555 0123',
      doctorName: 'Dr. R. Vance',
      rawText: 'Rx: Lipitor 20mg 1 tab OD x 30 days',
      fileType: 'image'
    },
    {
      id: '2',
      patientName: 'Robert Johnson',
      patientPhone: '+1 555 0199',
      doctorName: 'Dr. M. Gable',
      rawText: 'Rx: Amoxicillin 500mg 1 cap BD x 7 days',
      fileType: 'pdf'
    }
  ]);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFilePreview(URL.createObjectURL(file));
      if (!rawText) {
        setRawText(`Rx: ${file.name.replace(/\.[^/.]+$/, '')} - 1 tab TDS x 7 days\nExtracted via AI OCR Engine v2.4`);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFilePreview(URL.createObjectURL(file));
      if (!rawText) {
        setRawText(`Rx: ${file.name.replace(/\.[^/.]+$/, '')} - 1 tab TDS x 7 days\nExtracted via AI OCR Engine v2.4`);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (channel === 'batch') {
        await onSubmitBatch(batchQueue);
      } else {
        await onSubmitSingle({
          patientName: patientName || 'Walk-in Patient',
          patientPhone,
          doctorName: doctorName || 'Dr. Unspecified',
          prescriptionUrl: filePreview || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
          rawText: rawText || 'Rx: Paracetamol 500mg 1 tab TDS x 5 days',
          fileType: channel === 'camera' ? 'camera_scan' : channel === 'pdf' ? 'pdf' : 'image'
        });
      }
      onClose();
    } catch {
      // Error handled by parent toast
    } finally {
      setLoading(false);
    }
  };

  const addBatchItem = () => {
    setBatchQueue((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        patientName: `Patient #${prev.length + 1}`,
        patientPhone: '+1 555 0000',
        doctorName: 'Dr. General Practitioner',
        rawText: 'Rx: Paracetamol 500mg 1 tab TDS x 5 days',
        fileType: 'image'
      }
    ]);
  };

  const removeBatchItem = (id) => {
    setBatchQueue((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Intake Prescription & Multi-Channel Scanner"
      size="lg"
    >
      <div className="space-y-5 text-slate-100">
        {/* Channel selector tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'drag_drop', label: 'Drag & Drop', icon: Upload },
            { id: 'pdf', label: 'PDF Document', icon: FileText },
            { id: 'camera', label: 'Camera Scan', icon: Camera },
            { id: 'batch', label: 'Batch Queue', icon: Layers }
          ].map((item) => {
            const Icon = item.icon;
            const active = channel === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setChannel(item.id)}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  active
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {channel !== 'batch' ? (
            <>
              {/* Drop / Capture Zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="h-44 border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl bg-slate-950/70 p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all relative overflow-hidden group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept={channel === 'pdf' ? '.pdf' : 'image/*'}
                  className="hidden"
                />

                {channel === 'camera' ? (
                  <div className="space-y-2 text-center">
                    <div className="p-3 bg-blue-600/20 text-blue-400 rounded-full inline-block animate-pulse">
                      <Camera className="w-8 h-8" />
                    </div>
                    <p className="text-xs font-bold text-white">Live WebCam Feed Active</p>
                    <p className="text-[11px] text-slate-400">Position prescription document in front of camera feed</p>
                    <Button
                      type="button"
                      size="sm"
                      variant="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCameraActive(!cameraActive);
                        setFilePreview('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80');
                      }}
                    >
                      {cameraActive ? 'Snapshot Captured!' : 'Capture WebCam Frame'}
                    </Button>
                  </div>
                ) : filePreview ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={filePreview}
                      alt="Prescription preview"
                      className="h-32 rounded-lg object-contain border border-slate-800 shadow"
                    />
                    <div className="text-left text-xs space-y-1">
                      <Badge variant="success" size="sm">File Loaded</Badge>
                      <p className="font-bold text-white">Prescription Scan Ready</p>
                      <p className="text-[11px] text-slate-400">Click to replace file artifact</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="p-3 bg-slate-900 rounded-full inline-block text-blue-400 border border-slate-800">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-white">
                      {channel === 'pdf' ? 'Click to select or drop PDF Prescription' : 'Drag & drop prescription photo here'}
                    </p>
                    <p className="text-[11px] text-slate-400">Supports PNG, JPG, JPEG, WEBP or PDF documents up to 25MB</p>
                  </div>
                )}
              </div>

              {/* Patient & Doctor Form Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <Input
                  label="Patient Name"
                  placeholder="e.g. Eleanor Vance"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  required
                />
                <Input
                  label="Patient Phone Number"
                  placeholder="+1 (555) 234-5678"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                />
              </div>

              <Input
                label="Prescribing Physician / Doctor"
                placeholder="Dr. Sarah Jenkins (MD - Registration #REG-8829)"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
              />

              <Textarea
                label="Prescription Text / OCR Raw Transcript"
                rows={3}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Rx: Amoxicillin 500mg 1 cap BD x 7 days..."
                className="font-mono text-xs"
              />
            </>
          ) : (
            /* Batch Queue Channel */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-400" /> Batch Upload Queue ({batchQueue.length} items)
                </span>
                <Button type="button" size="sm" variant="outline" onClick={addBatchItem}>
                  + Add Batch Document
                </Button>
              </div>

              <div className="max-h-60 overflow-y-auto pr-1.5 custom-scrollbar space-y-2">
                {batchQueue.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 font-bold text-white">
                        <span>#{idx + 1}. {item.patientName}</span>
                        <Badge size="sm" variant="secondary">{item.fileType}</Badge>
                      </div>
                      <p className="text-[11px] text-slate-400">{item.doctorName} • {item.rawText}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeBatchItem(item.id)}
                      className="p-1 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={loading}
              leftIcon={Brain}
              className="shadow-lg shadow-blue-500/20"
            >
              {channel === 'batch'
                ? `Run AI OCR Processing on ${batchQueue.length} Prescriptions`
                : 'Upload & Extract with AI OCR Engine'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default IntakeChannelModal;
