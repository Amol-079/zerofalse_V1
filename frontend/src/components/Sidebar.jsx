import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, Bell, Key, Settings, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Sidebar = () => {
  const { org } = useAuth();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Overview' },
    { path: '/scan-logs', icon: FileText, label: 'Scan Logs' },
    { path: '/alerts', icon: Bell, label: 'Alerts' },
    { path: '/api-keys', icon: Key, label: 'API Keys' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const usagePercent = org ? Math.round((org.scan_count_month / org.scan_limit_month) * 100) : 0;

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col" data-testid="sidebar">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>Zerofalse</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
              data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {org && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs font-medium text-gray-500 mb-2">Usage This Month</div>
          <div className="flex items-center justify-between text-xs text-gray-700 mb-1.5">
            <span>{org.scan_count_month?.toLocaleString() || 0}</span>
            <span>{org.scan_limit_month?.toLocaleString() || 0}</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            />
          </div>
        </div>
      )}
    </aside>
  );
};
