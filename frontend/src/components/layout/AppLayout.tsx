import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../common/Header';
import { Sidebar } from '../common/Sidebar';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        selectedWeek={selectedWeek}
        onSelectWeek={setSelectedWeek}
      />

      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeWeek={selectedWeek}
        />

        <main className="min-h-[calc(100vh-4rem)] w-full flex-1 transition-all lg:pl-64">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <Outlet context={{ selectedWeek, setSelectedWeek }} />
          </div>
        </main>
      </div>
    </div>
  );
};
