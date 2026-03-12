import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Shield, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { validateEmail, validatePassword, getPasswordStrength } from '../utils/validators';

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    org_name: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthColors = { weak: '#ef4444', medium: '#f59e0b', strong: '#10b981' };
  const strengthSegments = passwordStrength.level === 'weak' ? 1 : passwordStrength.level === 'medium' ? 2 : 4;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!validateEmail(formData.email)) newErrors.email = 'Invalid email address';
    
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) newErrors.password = passwordValidation.message;
    
    if (!formData.org_name.trim()) newErrors.org_name = 'Organization name is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/onboarding');
    } catch (error) {
      setErrors({ api: error.response?.data?.detail || 'Registration failed' });
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
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
          <div style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
              <div><span style={{ color: '#8b5cf6' }}>from</span> zerofalse <span style={{ color: '#8b5cf6' }}>import</span> ZerofalseClient</div>
              <div style={{ marginTop: '8px' }}>zf = ZerofalseClient(api_key=...)</div>
              <div style={{ marginTop: '8px' }}><span style={{ color: '#8b5cf6' }}>@zf</span>.guard_tool</div>
            </div>
          </div>
        </div>
        <div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)' }}>Already have an account? <Link to="/login" style={{ color: 'white', textDecoration: 'underline' }}>Sign in</Link></p>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px', backgroundColor: 'var(--color-bg)' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '8px' }}>Create your account</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: '32px' }}>Start protecting your AI agents in minutes</p>

          {errors.api && (
            <div style={{ marginBottom: '24px', padding: '14px 18px', backgroundColor: 'var(--color-danger-bg)', border: '1px solid var(--color-danger-border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <AlertCircle style={{ width: '20px', height: '20px', color: 'var(--color-danger)', flexShrink: 0 }} />
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-danger)' }}>{errors.api}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} data-testid="signup-form">
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Full Name</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                style={{ width: '100%' }}
                data-testid="signup-name-input"
              />
              {errors.full_name && <p style={{ marginTop: '6px', fontSize: 'var(--text-xs)', color: 'var(--color-danger)' }}>{errors.full_name}</p>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Work Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ width: '100%' }}
                data-testid="signup-email-input"
              />
              {errors.email && <p style={{ marginTop: '6px', fontSize: 'var(--text-xs)', color: 'var(--color-danger)' }}>{errors.email}</p>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{ width: '100%', paddingRight: '40px' }}
                  data-testid="signup-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', padding: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {showPassword ? <EyeOff style={{ width: '16px', height: '16px', color: 'var(--color-text-muted)' }} /> : <Eye style={{ width: '16px', height: '16px', color: 'var(--color-text-muted)' }} />}
                </button>
              </div>
              {formData.password && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', gap: '3px', marginBottom: '6px' }}>
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} style={{ flex: 1, height: '4px', backgroundColor: i <= strengthSegments ? strengthColors[passwordStrength.level] : 'var(--color-surface-2)', borderRadius: 'var(--radius-full)', transition: 'var(--transition-base)' }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: strengthColors[passwordStrength.level], fontWeight: 600, textTransform: 'capitalize' }}>{passwordStrength.level}</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>8+ chars, 1 uppercase, 1 number</span>
                  </div>
                </div>
              )}
              {errors.password && <p style={{ marginTop: '6px', fontSize: 'var(--text-xs)', color: 'var(--color-danger)' }}>{errors.password}</p>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Organization Name</label>
              <input
                type="text"
                value={formData.org_name}
                onChange={(e) => setFormData({ ...formData, org_name: e.target.value })}
                style={{ width: '100%' }}
                data-testid="signup-org-input"
              />
              {errors.org_name && <p style={{ marginTop: '6px', fontSize: 'var(--text-xs)', color: 'var(--color-danger)' }}>{errors.org_name}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '10px 20px', marginTop: '4px', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'white', backgroundColor: 'var(--color-brand)', border: 'none', borderRadius: 'var(--radius-md)', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1, boxShadow: 'var(--shadow-brand)', transition: 'var(--transition-fast)' }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = 'var(--color-brand-dark)')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = 'var(--color-brand)')}
              className="btn-press"
              data-testid="signup-submit-btn"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ marginTop: '16px', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textAlign: 'center' }}>By creating an account you agree to our <a href="#" style={{ color: 'var(--color-text-muted)', textDecoration: 'underline' }}>Terms</a> and <a href="#" style={{ color: 'var(--color-text-muted)', textDecoration: 'underline' }}>Privacy Policy</a></p>

          <p style={{ marginTop: '24px', textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 600, color: 'var(--color-brand)', textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}