import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Check, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    org_name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const benefits = [
    '10,000 free scans per month',
    'Unlimited team members',
    'Real-time threat detection',
    'No credit card required'
  ];

  const passwordRequirements = [
    { label: 'At least 8 characters', met: formData.password.length >= 8 },
    { label: 'Contains a number', met: /\d/.test(formData.password) },
    { label: 'Contains uppercase', met: /[A-Z]/.test(formData.password) }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register(formData);
      navigate('/onboarding');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
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
      data-testid="signup-page"
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
            Protect your AI agents from day one
          </h1>
          <p style={{ 
            fontSize: 'var(--text-lg)', 
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '40px',
            lineHeight: 1.6
          }}>
            Join thousands of developers securing their AI infrastructure with real-time threat detection.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {benefits.map((benefit, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: 'var(--color-success)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Check style={{ width: '12px', height: '12px', color: 'white' }} />
                </div>
                <span style={{ fontSize: 'var(--text-base)', color: 'rgba(255,255,255,0.9)' }}>
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ 
          padding: '24px',
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
            "Zerofalse caught a prompt injection attack that would have exposed our production database. 
            Setup took 5 minutes."
          </p>
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'var(--color-brand)',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 600,
              color: 'white'
            }}>
              JD
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'white' }}>
                James Davis
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)' }}>
                CTO at Acme AI
              </div>
            </div>
          </div>
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
              Create your account
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              Already have an account?{' '}
              <Link 
                to="/login" 
                style={{ color: 'var(--color-brand)', fontWeight: 500, textDecoration: 'none' }}
                data-testid="login-link"
              >
                Sign in
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
              data-testid="signup-error"
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
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                style={{ width: '100%', boxSizing: 'border-box' }}
                data-testid="signup-name"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: 'var(--text-sm)', 
                fontWeight: 500, 
                color: 'var(--color-text-primary)',
                marginBottom: '6px'
              }}>
                Work Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@company.com"
                required
                style={{ width: '100%', boxSizing: 'border-box' }}
                data-testid="signup-email"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: 'var(--text-sm)', 
                fontWeight: 500, 
                color: 'var(--color-text-primary)',
                marginBottom: '6px'
              }}>
                Organization Name
              </label>
              <input
                type="text"
                name="org_name"
                value={formData.org_name}
                onChange={handleChange}
                placeholder="Acme Inc"
                required
                style={{ width: '100%', boxSizing: 'border-box' }}
                data-testid="signup-org"
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: 'var(--text-sm)', 
                fontWeight: 500, 
                color: 'var(--color-text-primary)',
                marginBottom: '6px'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                  style={{ width: '100%', boxSizing: 'border-box', paddingRight: '44px' }}
                  data-testid="signup-password"
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
              
              {formData.password && (
                <div style={{ marginTop: '12px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  {passwordRequirements.map((req, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        backgroundColor: req.met ? 'var(--color-success)' : 'var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {req.met && <Check style={{ width: '10px', height: '10px', color: 'white' }} />}
                      </div>
                      <span style={{ 
                        fontSize: 'var(--text-xs)', 
                        color: req.met ? 'var(--color-success)' : 'var(--color-text-muted)' 
                      }}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
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
              data-testid="signup-submit"
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
                  Create Account
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </>
              )}
            </button>
          </form>

          <p style={{ 
            fontSize: 'var(--text-xs)', 
            color: 'var(--color-text-muted)', 
            textAlign: 'center',
            marginTop: '24px',
            lineHeight: 1.5
          }}>
            By signing up, you agree to our{' '}
            <a href="#" style={{ color: 'var(--color-text-secondary)', textDecoration: 'underline' }}>Terms</a>
            {' '}and{' '}
            <a href="#" style={{ color: 'var(--color-text-secondary)', textDecoration: 'underline' }}>Privacy Policy</a>
          </p>
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

export default Signup;
