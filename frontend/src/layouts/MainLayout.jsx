import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SubscriptionGatekeeper from '../components/SubscriptionGatekeeper';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      {/* Persistent Top Navigation Bar */}
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Responsive Navigation Sidebar */}
        <Sidebar />

        {/* Main Operational Workspace Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950">
          <SubscriptionGatekeeper />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
