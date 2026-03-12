import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, Bell, Key, Settings, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import client from '../api/client';

export const Sidebar = () => {
  const { org } = useAuth();
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    const fetchAlertCount = async () => {
      try {
        const response = await client.get('/api/v1/dashboard/stats');
        setAlertCount(response.data.open_alerts || 0);
      } catch (error) {
        console.error('Error fetching alert count:', error);
      }
    };
    fetchAlertCount();
  }, []);

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Overview' },
    { path: '/scan-logs', icon: FileText, label: 'Scan Logs' },
    { path: '/alerts', icon: Bell, label: 'Alerts', badge: alertCount },
    { path: '/api-keys', icon: Key, label: 'API Keys' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const usagePercent = org ? Math.min((org.scan_count_month / org.scan_limit_month) * 100, 100) : 0;
  let usageColor = 'var(--color-brand)';
  if (usagePercent > 95) usageColor = 'var(--color-danger)';
  else if (usagePercent > 80) usageColor = 'var(--color-warning)';

  return (
    <aside 
      className="flex flex-col" 
      style={{ 
        width: '240px', 
        backgroundColor: 'var(--color-bg)', 
        borderRight: '1px solid var(--color-border)',
        height: '100vh'
      }}
      data-testid="sidebar"
    >
      <div 
        className="flex items-center gap-2"
        style={{ 
          height: '64px', 
          padding: '0 20px',
          borderBottom: '1px solid var(--color-border)'
        }}
      >
        <div 
          className="flex items-center justify-center"
          style={{ 
            width: '20px', 
            height: '20px',
            backgroundColor: 'var(--color-brand)',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <Shield style={{ width: '14px', height: '14px', color: 'white' }} />
        </div>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
          Zerofalse
        </span>
      </div>

      <nav style={{ padding: '12px 8px', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => isActive ? 'nav-item-active' : 'nav-item'}
              data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--color-brand)' : 'var(--color-text-secondary)',
                backgroundColor: isActive ? 'var(--color-brand-subtle)' : 'transparent',
                marginBottom: '2px',
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
                textDecoration: 'none',
                position: 'relative'
              })}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      width: '3px',
                      height: '20px',
                      backgroundColor: 'var(--color-brand)',
                      borderRadius: '0 2px 2px 0'
                    }} />
                  )}
                  <Icon style={{ width: '20px', height: '20px', color: isActive ? 'var(--color-brand)' : 'var(--color-text-secondary)' }} />
                  <span>{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span style={{
                      position: 'absolute',
                      right: '12px',
                      height: '18px',
                      minWidth: '18px',
                      padding: '0 5px',
                      backgroundColor: 'var(--color-danger)',
                      color: 'white',
                      fontSize: '11px',
                      fontWeight: 600,
                      borderRadius: 'var(--radius-full)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {org && (
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
            Monthly Scans
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
            {org.scan_count_month?.toLocaleString() || 0} of {org.scan_limit_month?.toLocaleString() || 0} used
          </div>
          <div style={{ 
            height: '6px', 
            backgroundColor: 'var(--color-surface-2)', 
            borderRadius: 'var(--radius-full)', 
            overflow: 'hidden',
            marginTop: '6px'
          }}>
            <div style={{ 
              width: `${usagePercent}%`, 
              height: '100%', 
              backgroundColor: usageColor, 
              borderRadius: 'var(--radius-full)',
              transition: 'var(--transition-base)'
            }} />
          </div>
        </div>
      )}
    </aside>
  );
};
