import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import FinBot from './FinBot';
import NotificationPanel from './NotificationPanel';
import { Menu, Bell } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import useStore from '../store';
import { useSocket } from '../hooks/useSocket';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { incrementUnread, unreadCount } = useStore();

  // Connect socket and listen for real-time events
  useSocket({
    'notification:new': () => {
      incrementUnread();
    },
  });

  return (
    <div className="app" id="app">
      <Sidebar
        mobileOpen={isMobileMenuOpen}
        onNotifClick={() => setIsNotifOpen(!isNotifOpen)}
      />

      {/* Mobile Header */}
      <header className="mobile-header" id="mobileHeader">
        <button
          className="mob-menu-btn"
          aria-label="Open menu"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu />
        </button>
        <div className="logo">
          <svg viewBox="0 0 28 28" fill="none" width="28" height="28">
            <rect width="28" height="28" rx="6" fill="#111"/>
            <path d="M7 20V12l5-4v12M16 20V8l5-4v16" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>FinSocial</span>
        </div>
        <button className="notif-bell" onClick={() => setIsNotifOpen(!isNotifOpen)} aria-label="Notifications">
          <Bell size={18} />
          {unreadCount > 0 && <span className="notif-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
        </button>
      </header>

      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div
          className="sidebar-overlay active"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Notification Panel */}
      <NotificationPanel open={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      {isNotifOpen && <div className="sidebar-overlay active" onClick={() => setIsNotifOpen(false)} style={{ zIndex: 99 }} />}

      {/* Main Content */}
      <main className="main" id="main">
        <Outlet />
      </main>

      {/* FinBot floating chatbot */}
      <FinBot />
    </div>
  );
};

export default Layout;
