import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div 
      style={{ 
        minHeight: '100vh', 
        display: 'flex',
        backgroundColor: 'var(--color-bg)'
      }} 
      data-testid="login-page"
    >
      {/* Left Panel - Branding */}
      <div 
        style={{
          width: '45%',
          backgroundColor: 'var(--color-navy)',
          padding: '48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
        className="hidden lg:flex"
      >
        <div>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '36px',
              height: '36px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <span style={{ fontSize: '22px', fontWeight: 700, color: 'white' }}>Zerofalse</span>
          </Link>
        </div>

        <div>
          <h1 style={{ 
            fontSize: 'var(--text-4xl)', 
            fontWeight: 700, 
            color: 'white',
            lineHeight: 1.2,
            marginBottom: '24px'
          }}>
            Welcome back
          </h1>
          <p style={{ 
            fontSize: 'var(--text-lg)', 
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '40px',
            lineHeight: 1.6
          }}>
            Your AI agents are waiting. Check on your security posture and monitor for threats.
          </p>
          
          {/* Stats */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '24px',
            padding: '24px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div>
              <div style={{ 
                fontSize: 'var(--text-2xl)', 
                fontWeight: 700, 
                color: 'white',
                fontFamily: 'var(--font-mono)'
              }}>
                &lt;5ms
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                Avg latency
              </div>
            </div>
            <div>
              <div style={{ 
                fontSize: 'var(--text-2xl)', 
                fontWeight: 700, 
                color: 'white',
                fontFamily: 'var(--font-mono)'
              }}>
                99.99%
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                Uptime
              </div>
            </div>
            <div>
              <div style={{ 
                fontSize: 'var(--text-2xl)', 
                fontWeight: 700, 
                color: 'white',
                fontFamily: 'var(--font-mono)'
              }}>
                0
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                False positives
              </div>
            </div>
          </div>
        </div>

        <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)' }}>
          © 2025 Zerofalse. Securing AI agents worldwide.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px'
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          {/* Mobile Logo */}
          <div className="lg:hidden" style={{ marginBottom: '32px', textAlign: 'center' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'var(--color-brand)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Shield style={{ width: '18px', height: '18px', color: 'white' }} />
              </div>
              <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)' }}>Zerofalse</span>
            </Link>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: 'var(--text-2xl)', 
              fontWeight: 700, 
              color: 'var(--color-text-primary)',
              marginBottom: '8px'
            }}>
              Sign in to your account
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                style={{ color: 'var(--color-brand)', fontWeight: 500, textDecoration: 'none' }}
                data-testid="signup-link"
              >
                Sign up free
              </Link>
            </p>
          </div>

          {error && (
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                backgroundColor: 'var(--color-danger-bg)',
                border: '1px solid var(--color-danger-border)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '24px'
              }}
              data-testid="login-error"
            >
              <AlertCircle style={{ width: '18px', height: '18px', color: 'var(--color-danger)' }} />
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-danger)' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: 'var(--text-sm)', 
                fontWeight: 500, 
                color: 'var(--color-text-primary)',
                marginBottom: '6px'
              }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@company.com"
                required
                style={{ width: '100%', boxSizing: 'border-box' }}
                data-testid="login-email"
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ 
                  fontSize: 'var(--text-sm)', 
                  fontWeight: 500, 
                  color: 'var(--color-text-primary)'
                }}>
                  Password
                </label>
                <Link 
                  to="/forgot-password"
                  style={{ 
                    fontSize: 'var(--text-xs)', 
                    color: 'var(--color-brand)', 
                    textDecoration: 'none',
                    fontWeight: 500
                  }}
                  data-testid="forgot-password-link"
                >
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  style={{ width: '100%', boxSizing: 'border-box', paddingRight: '44px' }}
                  data-testid="login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  {showPassword ? (
                    <EyeOff style={{ width: '18px', height: '18px', color: 'var(--color-text-muted)' }} />
                  ) : (
                    <Eye style={{ width: '18px', height: '18px', color: 'var(--color-text-muted)' }} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: isLoading ? 'var(--color-border)' : 'var(--color-brand)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                boxShadow: 'var(--shadow-brand)',
                transition: 'var(--transition-fast)'
              }}
              data-testid="login-submit"
            >
              {isLoading ? (
                <div style={{
                  width: '18px',
                  height: '18px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite'
                }} />
              ) : (
                <>
                  Sign In
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </>
              )}
            </button>
          </form>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            marginTop: '32px'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>or continue with</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
          </div>

          <button
            type="button"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              backgroundColor: 'var(--color-bg)',
              color: 'var(--color-text-primary)',
              padding: '12px 24px',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              border: '1px solid var(--color-border)',
              cursor: 'pointer',
              marginTop: '16px',
              transition: 'var(--transition-fast)'
            }}
            data-testid="google-login"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;
