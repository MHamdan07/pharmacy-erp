import { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Pill,
  ShieldCheck,
  Truck,
  Clock,
  PhoneCall,
  CheckCircle,
  Plus,
  Minus,
  Trash2,
  FileUp,
  CreditCard,
  Building2,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const SAMPLE_PRODUCTS = [
  {
    id: 'p1',
    name: 'Panadol Extra 500mg',
    generic: 'Paracetamol / Caffeine',
    category: 'Tablets',
    price: 8.5,
    stock: 120,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80',
    uses: 'Pain relief, fever reduction, headache treatment'
  },
  {
    id: 'p2',
    name: 'Amoxil 500mg Capsules',
    generic: 'Amoxicillin Trihydrate',
    category: 'Capsules',
    price: 24.0,
    stock: 85,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80',
    uses: 'Bacterial infections, respiratory tract infections'
  },
  {
    id: 'p3',
    name: 'Brufen 400mg Tablets',
    generic: 'Ibuprofen',
    category: 'Tablets',
    price: 12.0,
    stock: 200,
    image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=500&q=80',
    uses: 'Anti-inflammatory, joint pain relief, fever'
  },
  {
    id: 'p4',
    name: 'Augmentin 625mg',
    generic: 'Amoxicillin + Clavulanic Acid',
    category: 'Tablets',
    price: 38.5,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80',
    uses: 'Broad-spectrum bacterial infection therapy'
  }
];

const CustomerStorefront = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [activeTab, setActiveTab] = useState('store');
  const [trackPhone, setTrackPhone] = useState('');

  const categories = ['All', 'Tablets', 'Capsules', 'Syrups', 'Vitamins', 'Baby Care'];

  const filteredProducts = SAMPLE_PRODUCTS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.generic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateCartQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = (e) => {
    e.preventDefault();
    setOrderPlaced(true);
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-white">HealthCare Plus Online Pharmacy</h1>
            <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Licensed Enterprise SaaS Storefront
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('store')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'store' ? 'bg-blue-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            Medicine Store
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'track' ? 'bg-blue-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            Track Order
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => setIsCheckoutOpen(!isCheckoutOpen)}
            className="relative px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-blue-400" />
            <span>Cart</span>
            {cart.length > 0 && (
              <span className="bg-blue-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                {cart.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'store' ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-900/40 via-indigo-950 to-slate-900 border border-blue-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" /> 24/7 Digital Pharmacy & Home Delivery
                </div>
                <h2 className="text-3xl font-extrabold text-white leading-tight">
                  Authentic Medicines Delivered to Your Doorstep
                </h2>
                <p className="text-xs text-slate-400">
                  Search 50+ genuine prescription & OTC medicines with instant barcode verification and fast delivery dispatch.
                </p>
              </div>

              {/* Search Bar */}
              <div className="w-full md:w-80 space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search brand or generic name..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between space-y-4 group transition-all"
                >
                  <div className="space-y-3">
                    <div className="h-40 bg-slate-950 rounded-xl overflow-hidden relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/80 backdrop-blur border border-slate-800 text-[10px] font-bold text-slate-300 rounded-lg">
                        {product.category}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 italic">Generic: {product.generic}</p>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{product.uses}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <div>
                      <span className="text-xs text-slate-400">Price: </span>
                      <strong className="text-base font-extrabold text-emerald-400">${product.price.toFixed(2)}</strong>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Track Order View */
          <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <Truck className="w-10 h-10 text-blue-400 mx-auto" />
              <h2 className="text-2xl font-bold text-white">Live Order Tracking</h2>
              <p className="text-xs text-slate-400">Enter your order ID or phone number to check dispatch status</p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={trackPhone}
                onChange={(e) => setTrackPhone(e.target.value)}
                placeholder="Enter Phone Number e.g. +1 555 0199"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
              <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 font-bold text-xs rounded-xl text-white cursor-pointer">
                Track Status
              </button>
            </div>

            {/* Timeline */}
            <div className="pt-6 border-t border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order Status Timeline</h3>
              <div className="space-y-4">
                {[
                  { step: '1. Order Placed & Confirmed', time: '10:30 AM', active: true },
                  { step: '2. Prescription & Pharmacist Verification', time: '10:35 AM', active: true },
                  { step: '3. FEFO Batch Packed in Dispatch Store', time: '10:45 AM', active: true },
                  { step: '4. Out for Home Delivery', time: '11:00 AM', active: false }
                ].map((st, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-3 bg-slate-950 rounded-xl">
                    <div className="flex items-center gap-2">
                      <CheckCircle className={`w-4 h-4 ${st.active ? 'text-emerald-400' : 'text-slate-700'}`} />
                      <span className={st.active ? 'text-white font-bold' : 'text-slate-500'}>{st.step}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{st.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Cart & Checkout Modal Drawer */}
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
            <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 flex flex-col justify-between space-y-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-blue-400" />
                    <h2 className="text-base font-bold text-white">Your Shopping Cart</h2>
                  </div>
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="text-slate-400 hover:text-white text-xs font-bold"
                  >
                    Close ✕
                  </button>
                </div>

                {orderPlaced ? (
                  <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-3">
                    <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                    <h3 className="text-lg font-bold text-white">Order Confirmed!</h3>
                    <p className="text-xs text-slate-300">
                      Your order has been sent to our Pharmacists for fulfillment. Track progress in the Track Order tab.
                    </p>
                    <button
                      onClick={() => setOrderPlaced(false)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Shop More Medicines
                    </button>
                  </div>
                ) : cart.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-8">Your cart is empty. Add medicines from the store.</p>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="p-3 bg-slate-950 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-white">{item.name}</p>
                          <p className="text-[10px] text-slate-400">${item.price.toFixed(2)} / unit</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCartQty(item.id, -1)}
                            className="p-1 bg-slate-800 text-slate-300 hover:text-white rounded"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-white">{item.qty}</span>
                          <button
                            onClick={() => updateCartQty(item.id, 1)}
                            className="p-1 bg-slate-800 text-slate-300 hover:text-white rounded"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {!orderPlaced && cart.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-300">Subtotal:</span>
                    <span className="text-emerald-400">${cartTotal.toFixed(2)}</span>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-2 text-xs">
                    <label className="block text-slate-400 font-bold">Payment Gateway</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="cod">Cash on Delivery</option>
                      <option value="jazzcash">JazzCash Mobile Wallet</option>
                      <option value="easypaisa">EasyPaisa Mobile Wallet</option>
                      <option value="card">Credit / Debit Card</option>
                    </select>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Complete Checkout (${cartTotal.toFixed(2)})
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerStorefront;
