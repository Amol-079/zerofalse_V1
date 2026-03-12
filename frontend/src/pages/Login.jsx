import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Shield, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ width: window.innerWidth >= 768 ? '45%' : '0', background: 'linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-light) 100%)', padding: window.innerWidth >= 768 ? '48px' : '0', display: window.innerWidth >= 768 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '48px' }}>
            <div style={{ width: '24px', height: '24px', backgroundColor: 'white', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield style={{ width: '16px', height: '16px', color: 'var(--color-brand)' }} />
            </div>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '20px', fontWeight: 700, color: 'white' }}>Zerofalse</span>
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'white', marginBottom: '16px' }}>Protect Your AI Agents</h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: '32px' }}>Real-time security for every tool call your agents make.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              'Real-time tool call inspection',
              'Blocks attacks in < 2ms',
              'Works with LangChain, CrewAI, AutoGen',
              'Zero infrastructure changes'
            ].map((benefit, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Check style={{ width: '20px', height: '20px', color: '#10b981', flexShrink: 0 }} />
                <span style={{ fontSize: '15px', fontWeight: 500, color: 'white' }}>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)' }}>Don't have an account? <Link to="/signup" style={{ color: 'white', textDecoration: 'underline' }}>Start free</Link></p>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px', backgroundColor: 'var(--color-bg)' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '8px' }}>Welcome back</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: '32px' }}>Sign in to your Zerofalse account</p>

          {error && (
            <div style={{ marginBottom: '24px', padding: '14px 18px', backgroundColor: 'var(--color-danger-bg)', border: '1px solid var(--color-danger-border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <AlertCircle style={{ width: '20px', height: '20px', color: 'var(--color-danger)', flexShrink: 0 }} />
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-danger)' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} data-testid="login-form">
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ width: '100%' }}
                required
                data-testid="login-email-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{ width: '100%', paddingRight: '40px' }}
                  required
                  data-testid="login-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', padding: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {showPassword ? <EyeOff style={{ width: '16px', height: '16px', color: 'var(--color-text-muted)' }} /> : <Eye style={{ width: '16px', height: '16px', color: 'var(--color-text-muted)' }} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Link to="/forgot-password" style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-brand)', textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '10px 20px', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'white', backgroundColor: 'var(--color-brand)', border: 'none', borderRadius: 'var(--radius-md)', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1, boxShadow: 'var(--shadow-brand)', transition: 'var(--transition-fast)' }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = 'var(--color-brand-dark)')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = 'var(--color-brand)')}
              className="btn-press"
              data-testid="login-submit-btn"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ marginTop: '24px', textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ fontWeight: 600, color: 'var(--color-brand)', textDecoration: 'none' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}