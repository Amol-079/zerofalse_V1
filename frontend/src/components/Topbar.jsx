import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Bell, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

export const Topbar = () => {
  const { user, org, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [openAlerts, setOpenAlerts] = useState(0);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await client.get('/api/v1/dashboard/stats');
        setOpenAlerts(response.data.open_alerts || 0);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };
    fetchAlerts();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = () => {
    if (!user?.full_name) return 'U';
    const names = user.full_name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return user.full_name[0].toUpperCase();
  };

  return (
    <header 
      className="sticky top-0 z-10"
      style={{ 
        height: '64px', 
        backgroundColor: 'var(--color-bg)', 
        borderBottom: '1px solid var(--color-border)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
      data-testid="topbar"
    >
      <div>
        <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '18px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
          {org?.name || 'Dashboard'}
        </h1>
      </div>
      
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button
          onClick={() => navigate('/alerts')}
          style={{
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
            transition: 'var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-2)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Bell style={{ width: '20px', height: '20px', color: 'var(--color-text-secondary)' }} />
          {openAlerts > 0 && (
            <span style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '8px',
              height: '8px',
              backgroundColor: 'var(--color-danger)',
              borderRadius: '50%'
            }} />
          )}
        </button>

        <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--color-border)' }} />

        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              transition: 'var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-brand-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-brand)'
            }}>
              {getInitials()}
            </div>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-primary)' }}>
              {user?.email?.split('@')[0]}
            </span>
          </div>

          {showDropdown && (
            <>
              <div 
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 10
                }}
                onClick={() => setShowDropdown(false)}
              />
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                backgroundColor: 'var(--color-bg)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--color-border)',
                minWidth: '160px',
                zIndex: 20,
                overflow: 'hidden'
              }}>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    navigate('/settings');
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-primary)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-danger)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderTop: '1px solid var(--color-border)',
                    transition: 'var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  data-testid="logout-btn"
                >
                  Log Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
