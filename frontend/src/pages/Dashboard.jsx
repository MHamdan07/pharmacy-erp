import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const roleName = typeof user?.role === 'object' ? user?.role?.name : (user?.role || 'Owner');

  const menuItems = ['Overview', 'Inventory', 'Orders', 'Customers', 'Reports'];

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 bg-slate-900 p-6 text-white md:flex md:flex-col">
          <div>
            <h2 className="text-xl font-semibold">Pharmacy ERP</h2>
            <p className="mt-2 text-sm text-slate-400">Operations Hub</p>
          </div>

          <nav className="mt-8 space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={item}
                onClick={() => {
                  if (item === 'Overview') navigate('/dashboard');
                  else if (item === 'Inventory') navigate('/inventory');
                }}
                className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium transition ${index === 0 ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="mt-auto rounded-xl bg-slate-800 p-4">
            <p className="text-sm font-medium">Signed in as</p>
            <p className="mt-1 text-sm text-slate-300">{user?.email}</p>
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-8">
          <div className="mx-auto max-w-6xl space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-600">Pharmacy ERP Dashboard</p>
                  <h1 className="text-2xl font-bold text-slate-800">Welcome back, {user?.name || 'Admin'}</h1>
                  <p className="mt-1 text-slate-600">Here is a quick overview of your pharmacy operations.</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
                    {roleName}
                  </span>
                  <button
                    onClick={logout}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-slate-500">Orders Today</p>
                <p className="mt-2 text-3xl font-bold text-slate-800">128</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-slate-500">Inventory Items</p>
                <p className="mt-2 text-3xl font-bold text-slate-800">342</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-slate-500">Pending Alerts</p>
                <p className="mt-2 text-3xl font-bold text-slate-800">7</p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800">Quick Actions</h3>
                <div className="mt-4 space-y-3">
                  <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">Add new prescription</div>
                  <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">Update stock levels</div>
                  <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">Review pending orders</div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800">System Status</h3>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                    <span>Database</span>
                    <span className="font-semibold text-emerald-600">Online</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                    <span>API</span>
                    <span className="font-semibold text-emerald-600">Healthy</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                    <span>Emails</span>
                    <span className="font-semibold text-amber-600">Queued</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}