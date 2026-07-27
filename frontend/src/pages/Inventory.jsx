import { useEffect, useState } from 'react';
import API from '../api/axios';

export default function Inventory() {
  const [categories, setCategories] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [catRes, medRes, supRes] = await Promise.all([
          API.get('/inventory/categories'),
          API.get('/inventory/medicines'),
          API.get('/inventory/suppliers'),
        ]);
        setCategories(catRes.data);
        setMedicines(medRes.data);
        setSuppliers(supRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-slate-600">Loading inventory...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-800">Inventory Management</h1>
          <p className="mt-1 text-slate-600">Medicine catalog, categories, supplier profiles, purchase orders, and receipts.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">Categories</h2>
            <p className="mt-2 text-sm text-slate-500">{categories.length} categories configured</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {categories.slice(0, 5).map((item) => (
                <li key={item._id} className="rounded-lg bg-slate-50 p-2">{item.name}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">Suppliers</h2>
            <p className="mt-2 text-sm text-slate-500">{suppliers.length} supplier profiles</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {suppliers.slice(0, 5).map((item) => (
                <li key={item._id} className="rounded-lg bg-slate-50 p-2">{item.name}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">Medicines</h2>
            <p className="mt-2 text-sm text-slate-500">{medicines.length} items in catalog</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {medicines.slice(0, 5).map((item) => (
                <li key={item._id} className="rounded-lg bg-slate-50 p-2">{item.name} — {item.stockQty} in stock</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
