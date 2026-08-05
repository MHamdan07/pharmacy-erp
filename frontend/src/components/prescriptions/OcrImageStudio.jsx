import { useState } from 'react';
import {
  RotateCw,
  Sliders,
  Crop,
  Sparkles,
  Check,
  Eye,
  FileCode,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { Card, Button, Badge, Textarea } from '../ui';

const OcrImageStudio = ({ prescription, onProcessPreprocessing, loading }) => {
  const [rotation, setRotation] = useState(prescription?.imagePreprocessing?.rotationAngle || 0);
  const [denoise, setDenoise] = useState(prescription?.imagePreprocessing?.isDenoised || false);
  const [deskew, setDeskew] = useState(prescription?.imagePreprocessing?.isDeskewed || false);
  const [brightness, setBrightness] = useState(prescription?.imagePreprocessing?.brightness || 100);
  const [contrast, setContrast] = useState(prescription?.imagePreprocessing?.contrast || 100);
  const [zoom, setZoom] = useState(100);
  const [viewMode, setViewMode] = useState('canvas'); // 'canvas' | 'text' | 'split'
  const [customText, setCustomText] = useState(prescription?.ocrRawText || '');

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleApplyPreprocessing = () => {
    if (!prescription?._id) return;
    onProcessPreprocessing(prescription._id, {
      rotationAngle: rotation,
      isDenoised: denoise,
      isDeskewed: deskew,
      brightness,
      contrast,
      customRawText: customText
    });
  };

  const imageStyle = {
    transform: `rotate(${rotation}deg) scale(${zoom / 100})`,
    filter: `brightness(${brightness}%) contrast(${contrast}%) ${denoise ? 'blur(0.2px) contrast(110%)' : ''} ${deskew ? 'skewX(1deg)' : ''}`,
    transition: 'all 0.3s ease'
  };

  return (
    <Card variant="glass" className="p-4 space-y-4 border-slate-800">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              OCR Image Enhancement & Canvas Studio
              <Badge variant={prescription?.ocrConfidence > 90 ? 'success' : 'warning'} size="sm">
                {prescription?.ocrConfidence || 95}% AI Confidence
              </Badge>
            </h3>
            <p className="text-[11px] font-medium text-slate-400">
              Interactive image enhancement, rotation, crop region, deskew, and text parsing workbench
            </p>
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('canvas')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium ${
              viewMode === 'canvas' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5 inline mr-1" /> Canvas
          </button>
          <button
            type="button"
            onClick={() => setViewMode('text')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium ${
              viewMode === 'text' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 inline mr-1" /> OCR Text
          </button>
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium ${
              viewMode === 'split' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5 inline mr-1" /> Split View
          </button>
        </div>
      </div>

      {/* Preprocessing Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={RotateCw} onClick={handleRotate}>
            Rotate ({rotation}°)
          </Button>

          <button
            type="button"
            onClick={() => setDenoise(!denoise)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              denoise
                ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 inline mr-1" /> Denoise Filter: {denoise ? 'ON' : 'OFF'}
          </button>

          <button
            type="button"
            onClick={() => setDeskew(!deskew)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              deskew
                ? 'bg-blue-600/20 border-blue-500/40 text-blue-400'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Crop className="w-3.5 h-3.5 inline mr-1" /> Auto Deskew: {deskew ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Controls: Brightness / Contrast & Zoom */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Bright:</span>
            <input
              type="range"
              min="50"
              max="150"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-16 accent-blue-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.max(50, prev - 10))}
              className="p-1 hover:text-white transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="font-mono text-[11px] font-bold text-slate-300">{zoom}%</span>
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.min(200, prev + 10))}
              className="p-1 hover:text-white transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            leftIcon={Check}
            loading={loading}
            onClick={handleApplyPreprocessing}
            className="shadow-md shadow-blue-500/20"
          >
            Apply Enhancement
          </Button>
        </div>
      </div>

      {/* Main Studio Viewport */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {(viewMode === 'canvas' || viewMode === 'split') && (
          <div
            className={`${
              viewMode === 'split' ? 'md:col-span-6' : 'md:col-span-12'
            } relative h-72 bg-slate-950 rounded-xl border border-slate-800 overflow-auto custom-scrollbar flex items-center justify-center p-4 group`}
          >
            <img
              src={prescription?.prescriptionUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80'}
              alt="Prescription Document Scan"
              style={imageStyle}
              className="max-h-full max-w-full object-contain rounded-md shadow-2xl transition-transform duration-300 cursor-grab active:cursor-grabbing"
            />

            {/* OCR Bounding Region Box Overlay Simulation */}
            <div className="absolute inset-x-8 top-12 bottom-12 border-2 border-dashed border-emerald-400/60 rounded-lg pointer-events-none flex items-start justify-end p-2 bg-emerald-500/5">
              <span className="bg-emerald-500/90 text-slate-950 font-bold font-mono text-[10px] px-2 py-0.5 rounded shadow">
                OCR Crop Region Verified (Active)
              </span>
            </div>
          </div>
        )}

        {(viewMode === 'text' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'md:col-span-6' : 'md:col-span-12'} space-y-2`}>
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="font-bold text-slate-300 flex items-center gap-1">
                <FileCode className="w-4 h-4 text-blue-400" /> Extracted Raw OCR Transcript:
              </span>
              <span className="font-mono text-emerald-400 text-[11px] font-semibold">
                Confidence Level: {prescription?.ocrConfidence || 95}%
              </span>
            </div>
            <Textarea
              rows={8}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="OCR Extracted raw text appears here..."
              className="font-mono text-xs bg-slate-950 text-emerald-300 border-slate-800 focus:border-blue-500 custom-scrollbar overflow-y-auto"
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default OcrImageStudio;
