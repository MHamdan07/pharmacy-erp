import { Building2, Package, CheckCircle2, AlertCircle, ArrowRightLeft } from 'lucide-react';
import { Card, Badge, Button } from '../ui';

const BranchInventoryMatrix = ({ items = [], branchInventory = [] }) => {
  const mockInventory = branchInventory.length > 0 ? branchInventory : [
    {
      medicineId: 'm1',
      name: 'Paracetamol 500mg',
      genericName: 'Acetaminophen',
      totalStock: 120,
      branches: [
        { branchName: 'Main Branch (Current)', stock: 85, batch: 'BATCH-2026A (Exp: 2027-04)' },
        { branchName: 'Downtown Branch', stock: 35, batch: 'BATCH-2026B (Exp: 2027-02)' }
      ]
    },
    {
      medicineId: 'm2',
      name: 'Amoxicillin 500mg',
      genericName: 'Amoxicillin Trihydrate',
      totalStock: 42,
      branches: [
        { branchName: 'Main Branch (Current)', stock: 24, batch: 'BATCH-2025X (Exp: 2026-11)' },
        { branchName: 'Downtown Branch', stock: 18, batch: 'BATCH-2025Y (Exp: 2026-12)' }
      ]
    }
  ];

  return (
    <Card variant="glass" className="p-4 space-y-4 border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Cross-Branch Inventory Matrix & FEFO Batches
            </h3>
            <p className="text-[11px] text-slate-400">
              Real-time stock level verification by branch and FEFO batch allocation
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 text-xs max-h-60 overflow-y-auto pr-1.5 custom-scrollbar">
        {mockInventory.map((item, idx) => (
          <div key={idx} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white">{item.name}</span>
                <span className="text-slate-500 text-[11px]">({item.genericName})</span>
              </div>
              <Badge variant={item.totalStock > 20 ? 'success' : 'warning'} size="sm">
                Total Store Stock: {item.totalStock} units
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              {item.branches.map((b, bIdx) => (
                <div key={bIdx} className="p-2 bg-slate-900/90 rounded-lg border border-slate-850 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-200">{b.branchName}</p>
                    <p className="text-[10px] text-slate-500">{b.batch}</p>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold font-mono ${b.stock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {b.stock} in stock
                    </span>
                    {b.stock <= 0 && (
                      <button className="block text-[10px] text-blue-400 hover:underline flex items-center gap-0.5 mt-0.5">
                        <ArrowRightLeft className="w-3 h-3 inline" /> Transfer
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default BranchInventoryMatrix;
