import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { RestrictedBanner } from './RestrictedBanner';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <RestrictedBanner />
      <Topbar onToggleSidebar={toggleSidebar} />
      <div className="shell">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
}
