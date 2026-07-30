import { useState, useEffect } from 'react';
import API from '../api/axios';
import {
  Barcode, QrCode, Printer, Search, Tag, Layers, Pill,
  CheckCircle, Camera, RefreshCw, Box, Layers3, Sparkles
} from 'lucide-react';

const BarcodeLabels = () => {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMed, setSelectedMed] = useState(null);

  // Label Configuration
  const [labelType, setLabelType] = useState('shelf'); // 'shelf', 'barcode_sticker', 'qr_label'
  const [stickerCopies, setStickerCopies] = useState(10);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await API.get('/inventory/medicines');
      setMedicines(res.data || []);
      if (res.data?.length > 0) {
        setSelectedMed(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to load medicines for barcode labeling:', err);
    }
  };

  const handlePrintLabels = () => {
    window.print();
  };

  const filteredMedicines = medicines.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.barcode && m.barcode.includes(searchTerm))
  );

  return (
    <div className="space-y-6">

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Barcode className="w-6 h-6 text-amber-400" />
            Barcode & QR Code Printing, Sticker Labels & Shelf Cards
          </h1>
          <p className="text-xs text-slate-400">Generate, scan, and print thermal barcode stickers, QR code labels, and shelf cards with rack locations</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsScanning(!isScanning)}
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Camera className="w-4 h-4" /> {isScanning ? 'Close Live Scanner' : 'Launch QR/Barcode Scanner'}
          </button>
          <button
            onClick={handlePrintLabels}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Printer className="w-4 h-4" /> Print Sticker Labels ({stickerCopies} Copies)
          </button>
        </div>
      </div>

      {/* Camera / Scanner Simulation */}
      {isScanning && (
        <div className="bg-slate-900 border border-purple-500/50 p-6 rounded-2xl shadow-xl text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-purple-500/10 text-purple-400 rounded-full flex items-center justify-center border border-purple-500/30 animate-pulse">
            <Camera className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white">Live Camera / Handheld Scanner Active</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">Point barcode reader or camera at product barcode/QR code for instant item lookup and POS cart insertion.</p>
        </div>
      )}

      {/* Main Grid: Selection & Label Generator Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left: Product Selector (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Medicine by Name, SKU, Barcode..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredMedicines.map((med) => {
              const isSelected = selectedMed?._id === med._id;
              return (
                <div
                  key={med._id}
                  onClick={() => setSelectedMed(med)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex justify-between items-center text-xs ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 text-white font-bold'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className="font-bold text-white text-sm">{med.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">SKU: {med.sku} · Barcode: {med.barcode || med.sku}</div>
                  </div>
                  <span className="text-emerald-400 font-bold font-mono">${med.unitPrice?.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Label Print Studio & Live Preview (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-6">

          {/* Label Type Selector */}
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div className="flex gap-2 text-xs font-bold">
              <button
                onClick={() => setLabelType('shelf')}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  labelType === 'shelf' ? 'bg-amber-600 border-amber-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                Shelf Label Card
              </button>
              <button
                onClick={() => setLabelType('barcode_sticker')}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  labelType === 'barcode_sticker' ? 'bg-amber-600 border-amber-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                Barcode Sticker Label
              </button>
              <button
                onClick={() => setLabelType('qr_label')}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  labelType === 'qr_label' ? 'bg-amber-600 border-amber-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                QR Verification Tag
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Copies to Print:</span>
              <input
                type="number"
                min="1"
                max="100"
                value={stickerCopies}
                onChange={(e) => setStickerCopies(Math.max(1, Number(e.target.value)))}
                className="w-16 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white font-mono text-center font-bold"
              />
            </div>
          </div>

          {/* Live Printable Preview Container */}
          {selectedMed ? (
            <div className="space-y-4">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Live Sticker / Shelf Card Preview:</div>

              {/* 1. SHELF LABEL CARD PREVIEW */}
              {labelType === 'shelf' && (
                <div className="bg-white text-slate-900 p-5 rounded-2xl border-2 border-slate-300 shadow-xl max-w-sm mx-auto font-mono space-y-3">
                  <div className="flex justify-between items-start border-b-2 border-slate-900 pb-2">
                    <div>
                      <div className="text-xs font-bold text-slate-600 uppercase">SHELF RACK CARD</div>
                      <h2 className="font-extrabold text-base uppercase leading-tight">{selectedMed.name}</h2>
                      <div className="text-[10px] text-slate-600 font-bold">{selectedMed.brandName} · {selectedMed.genericName}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded font-bold">
                        RACK: {selectedMed.batches?.[0]?.rackNumber || 'A-1'}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-[10px] text-slate-500">Retail Price:</div>
                      <div className="text-2xl font-extrabold text-slate-900">${selectedMed.unitPrice?.toFixed(2)} / {selectedMed.unit}</div>
                    </div>
                    <div className="text-right text-[10px] text-slate-600">
                      <div>SKU: {selectedMed.sku}</div>
                      <div>Tax Rate: {selectedMed.taxRate || 0}%</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-300 flex flex-col items-center">
                    <div className="h-12 flex items-center justify-center space-x-0.5">
                      {[2,1,3,1,2,4,1,2,1,3,1,2,1,4,2,1,3,2,1].map((w, i) => (
                        <span key={i} className="bg-black inline-block h-10" style={{ width: `${w * 1.5}px` }}></span>
                      ))}
                    </div>
                    <div className="text-[10px] font-bold tracking-widest mt-1">{selectedMed.barcode || selectedMed.sku}</div>
                  </div>

                  <div className="text-[9px] text-slate-500 text-center italic border-t border-slate-200 pt-1">
                    {selectedMed.storageInstructions || 'Store in a cool, dry place below 25°C.'}
                  </div>
                </div>
              )}

              {/* 2. BARCODE STICKER LABEL PREVIEW */}
              {labelType === 'barcode_sticker' && (
                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                  {Array.from({ length: Math.min(4, stickerCopies) }).map((_, idx) => (
                    <div key={idx} className="bg-white text-slate-900 p-3 rounded-xl border border-slate-300 shadow-md font-mono text-[10px] text-center space-y-1">
                      <div className="font-bold truncate">{selectedMed.name}</div>
                      <div className="font-extrabold text-sm">${selectedMed.unitPrice?.toFixed(2)}</div>
                      <div className="h-8 flex items-center justify-center space-x-0.5">
                        {[2,1,3,1,2,4,1,2,1,3,1].map((w, i) => (
                          <span key={i} className="bg-black inline-block h-7" style={{ width: `${w * 1.2}px` }}></span>
                        ))}
                      </div>
                      <div className="text-[9px] font-bold">{selectedMed.barcode || selectedMed.sku}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* 3. QR VERIFICATION TAG PREVIEW */}
              {labelType === 'qr_label' && (
                <div className="bg-white text-slate-900 p-5 rounded-2xl border-2 border-slate-300 shadow-xl max-w-xs mx-auto font-mono text-center space-y-3">
                  <div className="font-extrabold text-sm uppercase">{selectedMed.name}</div>
                  <div className="w-28 h-28 mx-auto bg-slate-950 p-2 rounded flex flex-wrap gap-1 items-center justify-center">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <span key={i} className={`w-3.5 h-3.5 ${i % 2 === 0 || i % 5 === 0 ? 'bg-white' : 'bg-slate-950'}`}></span>
                    ))}
                  </div>
                  <div className="text-[10px] font-bold text-slate-600">Scan QR Code for Authentication</div>
                  <div className="text-[9px] text-slate-500 font-mono">{selectedMed.sku}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs italic">
              Select a medicine from the left list to generate sticker labels and shelf cards.
            </div>
          )}

        </div>

      </div>

      {/* PRINT-ONLY STICKER LABELS SHEET CONTAINER (ONLY VISIBLE DURING PRINT) */}
      {selectedMed && (
        <div className="printable-label-sheet hidden font-mono text-black">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-2">
            {Array.from({ length: stickerCopies }).map((_, idx) => (
              <div key={idx} className="border border-black p-3 rounded text-[10px] text-center space-y-1 bg-white break-inside-avoid">
                {labelType === 'shelf' && (
                  <div className="space-y-1">
                    <div className="font-extrabold text-xs uppercase leading-tight">{selectedMed.name}</div>
                    <div className="text-[9px] font-bold text-gray-700">RACK: {selectedMed.batches?.[0]?.rackNumber || 'A-1'} · SKU: {selectedMed.sku}</div>
                    <div className="text-sm font-extrabold">${selectedMed.unitPrice?.toFixed(2)} / {selectedMed.unit}</div>
                    <div className="h-7 flex justify-center items-center space-x-0.5 my-1">
                      {[2,1,3,1,2,4,1,2,1,3,1].map((w, i) => (
                        <span key={i} className="bg-black inline-block h-6" style={{ width: `${w * 1.3}px` }}></span>
                      ))}
                    </div>
                    <div className="text-[9px] font-bold">{selectedMed.barcode || selectedMed.sku}</div>
                  </div>
                )}

                {labelType === 'barcode_sticker' && (
                  <div className="space-y-1 py-1">
                    <div className="font-bold text-xs truncate">{selectedMed.name}</div>
                    <div className="font-extrabold text-sm">${selectedMed.unitPrice?.toFixed(2)}</div>
                    <div className="h-7 flex justify-center items-center space-x-0.5">
                      {[2,1,3,1,2,4,1,2,1,3,1].map((w, i) => (
                        <span key={i} className="bg-black inline-block h-6" style={{ width: `${w * 1.3}px` }}></span>
                      ))}
                    </div>
                    <div className="text-[9px] font-bold">{selectedMed.barcode || selectedMed.sku}</div>
                  </div>
                )}

                {labelType === 'qr_label' && (
                  <div className="space-y-1 py-1 flex flex-col items-center">
                    <div className="font-bold text-xs uppercase truncate max-w-[120px]">{selectedMed.name}</div>
                    <div className="w-16 h-16 bg-black p-1 rounded flex flex-wrap gap-0.5 items-center justify-center">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <span key={i} className={`w-2.5 h-2.5 ${i % 2 === 0 || i % 3 === 0 ? 'bg-white' : 'bg-black'}`}></span>
                      ))}
                    </div>
                    <div className="text-[9px] font-extrabold">${selectedMed.unitPrice?.toFixed(2)}</div>
                    <div className="text-[8px] font-bold">{selectedMed.sku}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default BarcodeLabels;
