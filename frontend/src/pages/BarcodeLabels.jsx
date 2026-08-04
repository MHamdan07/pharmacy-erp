import { useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import {
  Barcode, QrCode, Printer, Search, Tag, Layers, Pill,
  CheckCircle, Camera, RefreshCw, Box, Sparkles
} from 'lucide-react';
import { Button, Input, Select, Card, Badge, Skeleton, useToast } from '../components/ui';

const BarcodeLabels = () => {
  const toast = useToast();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMed, setSelectedMed] = useState(null);

  // Label Configuration
  const [labelType, setLabelType] = useState('shelf'); // 'shelf', 'barcode_sticker', 'qr_label'
  const [stickerCopies, setStickerCopies] = useState(10);
  const [isScanning, setIsScanning] = useState(false);

  const fetchMedicines = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get('/inventory/medicines');
      const data = res.data || [];
      setMedicines(data);
      if (data.length > 0) {
        setSelectedMed(data[0]);
      }
    } catch (err) {
      console.error('Failed to load medicines for barcode labeling:', err);
      toast.error('Failed to load medicines list for barcode generation.');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  const handlePrintLabels = () => {
    if (!selectedMed) {
      toast.warning('Please select a medicine before printing labels.');
      return;
    }
    toast.info(`Sending ${stickerCopies} copies to printer...`);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const toggleScanner = () => {
    const nextState = !isScanning;
    setIsScanning(nextState);
    if (nextState) {
      toast.info('Live QR/Barcode scanner initialized.');
    } else {
      toast.info('Scanner camera deactivated.');
    }
  };

  const filteredMedicines = medicines.filter((m) =>
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.barcode && m.barcode.includes(searchTerm))
  );

  return (
    <div className="space-y-6">

      {/* Top Banner Header */}
      <Card variant="solid" className="p-5 border-slate-800 dark:border-slate-800 light:border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 flex items-center gap-2 tracking-tight">
              <Barcode className="w-6 h-6 text-amber-400" />
              Barcode & QR Code Printing, Sticker Labels & Shelf Cards
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 mt-1">
              Generate, scan, and print thermal barcode stickers, QR code labels, and shelf cards with rack locations
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant={isScanning ? 'danger' : 'secondary'}
              size="sm"
              leftIcon={Camera}
              onClick={toggleScanner}
            >
              {isScanning ? 'Close Live Scanner' : 'Launch QR/Barcode Scanner'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={Printer}
              onClick={handlePrintLabels}
              disabled={!selectedMed}
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              Print Sticker Labels ({stickerCopies} Copies)
            </Button>
          </div>
        </div>
      </Card>

      {/* Camera / Scanner Simulation */}
      {isScanning && (
        <Card variant="solid" className="border-purple-500/50 p-6 text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-purple-500/10 text-purple-400 rounded-full flex items-center justify-center border border-purple-500/30 animate-pulse">
            <Camera className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
            Live Camera / Handheld Scanner Active
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 max-w-md mx-auto">
            Point barcode reader or camera at product barcode/QR code for instant item lookup and POS cart insertion.
          </p>
        </Card>
      )}

      {/* Main Grid: Selection & Label Generator Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left: Product Selector (5 cols) */}
        <Card variant="solid" className="lg:col-span-5 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200 dark:text-slate-200 light:text-slate-800 flex items-center gap-2">
              <Pill className="w-4 h-4 text-blue-400" /> Select Medicine
            </h2>
            <Badge variant="neutral" size="sm">
              {filteredMedicines.length} Items
            </Badge>
          </div>

          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Medicine by Name, SKU, Barcode..."
            leftIcon={Search}
            size="sm"
          />

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {loading ? (
              <div className="space-y-2 p-2">
                <Skeleton className="h-14 w-full rounded-xl" />
                <Skeleton className="h-14 w-full rounded-xl" />
                <Skeleton className="h-14 w-full rounded-xl" />
                <Skeleton className="h-14 w-full rounded-xl" />
              </div>
            ) : filteredMedicines.length > 0 ? (
              filteredMedicines.map((med) => {
                const isSelected = selectedMed?._id === med._id;
                return (
                  <div
                    key={med._id}
                    onClick={() => setSelectedMed(med)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex justify-between items-center text-xs ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 text-white font-bold shadow-md'
                        : 'bg-slate-800/40 dark:bg-slate-800/40 light:bg-slate-50 border-slate-700/60 dark:border-slate-700/60 light:border-slate-200 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 text-sm">
                        {med.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        SKU: {med.sku} · Barcode: {med.barcode || med.sku}
                      </div>
                    </div>
                    <span className="text-emerald-400 font-bold font-mono">
                      ${med.unitPrice?.toFixed(2)}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                No medicines match search terms.
              </div>
            )}
          </div>
        </Card>

        {/* Right: Label Print Studio & Live Preview (7 cols) */}
        <Card variant="solid" className="lg:col-span-7 p-5 space-y-6">

          {/* Label Type Selector Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 dark:border-slate-800 light:border-slate-200 pb-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={labelType === 'shelf' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setLabelType('shelf')}
                className={labelType === 'shelf' ? 'bg-amber-600 hover:bg-amber-500 border-amber-500 text-white' : ''}
              >
                Shelf Label Card
              </Button>
              <Button
                variant={labelType === 'barcode_sticker' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setLabelType('barcode_sticker')}
                className={labelType === 'barcode_sticker' ? 'bg-amber-600 hover:bg-amber-500 border-amber-500 text-white' : ''}
              >
                Barcode Sticker Label
              </Button>
              <Button
                variant={labelType === 'qr_label' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setLabelType('qr_label')}
                className={labelType === 'qr_label' ? 'bg-amber-600 hover:bg-amber-500 border-amber-500 text-white' : ''}
              >
                QR Verification Tag
              </Button>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Copies to Print:</span>
              <Input
                type="number"
                min="1"
                max="100"
                value={stickerCopies}
                onChange={(e) => setStickerCopies(Math.max(1, Number(e.target.value)))}
                size="sm"
                className="w-20 font-mono text-center font-bold"
                fullWidth={false}
              />
            </div>
          </div>

          {/* Live Printable Preview Container */}
          {selectedMed ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  Live Sticker / Shelf Card Preview
                </div>
                <Badge variant="info" size="sm" icon={Sparkles}>
                  {labelType === 'shelf' ? 'Standard Thermal Shelf Card' : labelType === 'barcode_sticker' ? 'Thermal Roll Sticker' : '2D Matrix QR Code'}
                </Badge>
              </div>

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
            <div className="text-center py-16 text-slate-500 text-xs italic">
              Select a medicine from the left list to generate sticker labels and shelf cards.
            </div>
          )}

        </Card>

      </div>

      {/* PRINT-ONLY STICKER LABELS SHEET CONTAINER (ONLY VISIBLE DURING PRINT) */}
      {selectedMed && (
        <div className="printable-label-sheet hidden font-mono text-black">
          <style>{`
            @media print {
              body * {
                visibility: hidden;
              }
              .printable-label-sheet, .printable-label-sheet * {
                visibility: visible;
              }
              .printable-label-sheet {
                display: block !important;
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
              }
            }
          `}</style>
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

