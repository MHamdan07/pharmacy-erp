import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { ArrowLeftRight, Plus, CheckCircle, Clock, Send, AlertCircle } from 'lucide-react';

const StockTransfers = () => {
  const { branches, activeBranchId } = useAuth();
  const [transfers, setTransfers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [toBranchId, setToBranchId] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [quantity, setQuantity] = useState(10);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchTransfers();
  }, [activeBranchId]);

  const fetchTransfers = async () => {
    try {
      const res = await API.get('/transfers/transfers');
      setTransfers(res.data || []);
    } catch (err) {
      console.error('Failed to load transfers:', err);
    }
  };

  const handleCreateTransfer = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        toBranchId,
        items: [
          {
            medicine: '66a5e1002010992019280191', // fallback reference
            batchNumber,
            expiryDate: new Date(Date.now() + 365*24*60*60*1000),
            quantity: Number(quantity)
          }
        ],
        notes
      };
      await API.post('/transfers/transfers', payload);
      setShowModal(false);
      fetchTransfers();
    } catch (err) {
      alert(err.response?.data?.message || 'Transfer request failed.');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/transfers/transfers/${id}/status`, { status });
      fetchTransfers();
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ArrowLeftRight className="w-6 h-6 text-emerald-400" />
            Inter-Branch Stock Transfers
          </h1>
          <p className="text-xs text-slate-400">Transfer inventory batches between main headquarters and branch stores</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Request Stock Transfer
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Transfer #</th>
                <th className="py-3 px-4">Origin Branch</th>
                <th className="py-3 px-4">Destination Branch</th>
                <th className="py-3 px-4">Items Transferred</th>
                <th className="py-3 px-4">Requested By</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {transfers.length > 0 ? (
                transfers.map((tr) => (
                  <tr key={tr._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-400">{tr.transferNumber}</td>
                    <td className="py-3 px-4 font-medium text-white">{tr.fromBranch?.name}</td>
                    <td className="py-3 px-4 font-medium text-white">{tr.toBranch?.name}</td>
                    <td className="py-3 px-4">
                      {tr.items?.map((it, i) => (
                        <div key={i} className="text-slate-300 font-mono">
                          Batch: {it.batchNumber} (x{it.quantity})
                        </div>
                      ))}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{tr.requestedBy?.name || 'Staff'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        tr.status === 'received' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        tr.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {tr.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {tr.status === 'pending' && (
                        <button
                          onClick={() => handleStatusChange(tr._id, 'received')}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded text-[11px] font-semibold cursor-pointer"
                        >
                          Confirm Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500">
                    No stock transfer requests recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-200 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-white">Create Stock Transfer Request</h2>

            <form onSubmit={handleCreateTransfer} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400">Destination Branch *</label>
                <select
                  required
                  value={toBranchId}
                  onChange={(e) => setToBranchId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                >
                  <option value="">Select Target Branch</option>
                  {branches.map(b => (
                    <option key={b._id} value={b._id}>{b.name} ({b.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400">Batch Number to Transfer *</label>
                <input
                  type="text"
                  required
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value.toUpperCase())}
                  placeholder="BT-AMX-001"
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400">Quantity to Transfer *</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg cursor-pointer"
                >
                  Submit Transfer
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default StockTransfers;
