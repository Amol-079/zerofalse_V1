import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Eye, Lock, ArrowRight, Check, ChevronRight } from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: Eye,
      title: 'Real-time Inspection',
      description: 'Monitor every tool call your AI agents make in milliseconds with zero latency impact.'
    },
    {
      icon: Shield,
      title: 'Threat Detection',
      description: 'Catch prompt injection, credential theft, and shell injection before they execute.'
    },
    {
      icon: Lock,
      title: 'Policy Enforcement',
      description: 'Define granular policies to allow, block, or alert on specific tool behaviors.'
    },
    {
      icon: Zap,
      title: 'Instant Alerts',
      description: 'Get notified immediately when suspicious activity is detected in your agent fleet.'
    }
  ];

  const stats = [
    { value: '< 5ms', label: 'Avg latency' },
    { value: '99.99%', label: 'Uptime SLA' },
    { value: '10M+', label: 'Scans/day' }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }} data-testid="landing-page">
      {/* Navigation */}
      <nav 
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid var(--color-border)'
        }}
      >
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
            <span style={{ 
              fontSize: '20px', 
              fontWeight: 700, 
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-sans)'
            }}>
              Zerofalse
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link 
              to="/login" 
              style={{ 
                fontSize: 'var(--text-sm)', 
                fontWeight: 500, 
                color: 'var(--color-text-secondary)',
                textDecoration: 'none',
                transition: 'var(--transition-fast)'
              }}
              data-testid="nav-login"
            >
              Log in
            </Link>
            <Link 
              to="/signup"
              style={{
                backgroundColor: 'var(--color-brand)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'var(--transition-fast)',
                boxShadow: 'var(--shadow-brand)'
              }}
              data-testid="nav-signup"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ 
        paddingTop: '140px', 
        paddingBottom: '80px',
        background: 'linear-gradient(180deg, var(--color-brand-light) 0%, var(--color-bg) 100%)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-full)',
              padding: '6px 16px',
              marginBottom: '24px'
            }}
          >
            <span style={{ 
              width: '6px', 
              height: '6px', 
              backgroundColor: 'var(--color-success)', 
              borderRadius: '50%' 
            }} />
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
              Now in public beta
            </span>
          </div>
          
          <h1 style={{ 
            fontSize: 'clamp(36px, 5vw, 60px)', 
            fontWeight: 700, 
            color: 'var(--color-text-primary)',
            lineHeight: 1.1,
            marginBottom: '20px',
            fontFamily: 'var(--font-sans)'
          }}>
            Runtime Security for<br />
            <span style={{ color: 'var(--color-brand)' }}>AI Agents</span>
          </h1>
          
          <p style={{ 
            fontSize: 'var(--text-lg)', 
            color: 'var(--color-text-secondary)', 
            maxWidth: '600px', 
            margin: '0 auto 32px',
            lineHeight: 1.6
          }}>
            Inspect every tool call. Detect threats in real-time. Block malicious actions 
            before they reach your systems.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/signup"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--color-brand)',
                color: 'white',
                padding: '14px 28px',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-base)',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: 'var(--shadow-brand)',
                transition: 'var(--transition-fast)'
              }}
              data-testid="hero-cta"
            >
              Get Started Free
              <ArrowRight style={{ width: '18px', height: '18px' }} />
            </Link>
            <a 
              href="#features"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-text-primary)',
                padding: '14px 28px',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-base)',
                fontWeight: 600,
                textDecoration: 'none',
                border: '1px solid var(--color-border)',
                transition: 'var(--transition-fast)'
              }}
            >
              See How It Works
            </a>
          </div>

          {/* Stats */}
          <div style={{ 
            display: 'flex', 
            gap: '48px', 
            justifyContent: 'center', 
            marginTop: '64px',
            flexWrap: 'wrap'
          }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: 'var(--text-3xl)', 
                  fontWeight: 700, 
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {stat.value}
                </div>
                <div style={{ 
                  fontSize: 'var(--text-sm)', 
                  color: 'var(--color-text-muted)', 
                  marginTop: '4px' 
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Preview */}
      <section style={{ padding: '40px 24px 80px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div 
            className="animate-float"
            style={{
              backgroundColor: 'var(--color-navy)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)'
            }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '14px 20px',
              borderBottom: '1px solid var(--color-navy-mid)'
            }}>
              <span style={{ width: '12px', height: '12px', backgroundColor: '#ff5f57', borderRadius: '50%' }} />
              <span style={{ width: '12px', height: '12px', backgroundColor: '#ffbd2e', borderRadius: '50%' }} />
              <span style={{ width: '12px', height: '12px', backgroundColor: '#28ca41', borderRadius: '50%' }} />
              <span style={{ 
                marginLeft: 'auto', 
                fontSize: 'var(--text-xs)', 
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-mono)'
              }}>
                agent.py
              </span>
            </div>
            <pre style={{ 
              padding: '24px', 
              margin: 0, 
              overflow: 'auto',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              lineHeight: 1.7
            }}>
              <code style={{ color: '#e2e8f0' }}>
                <span style={{ color: '#7dd3fc' }}>import</span> zerofalse{'\n'}
                {'\n'}
                <span style={{ color: '#94a3b8' }}># Wrap your agent's tool executor</span>{'\n'}
                <span style={{ color: '#c4b5fd' }}>@zerofalse.protect</span>{'\n'}
                <span style={{ color: '#7dd3fc' }}>def</span> <span style={{ color: '#fde68a' }}>execute_tool</span>(tool_name, args):{'\n'}
                {'    '}<span style={{ color: '#94a3b8' }}># Your existing tool logic</span>{'\n'}
                {'    '}<span style={{ color: '#7dd3fc' }}>return</span> tool_registry[tool_name](**args){'\n'}
                {'\n'}
                <span style={{ color: '#94a3b8' }}># Zerofalse inspects every call</span>{'\n'}
                <span style={{ color: '#94a3b8' }}># Blocks threats automatically</span>
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '80px 24px', backgroundColor: 'var(--color-surface)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ 
              fontSize: 'var(--text-3xl)', 
              fontWeight: 700, 
              color: 'var(--color-text-primary)',
              marginBottom: '16px'
            }}>
              Enterprise-grade protection
            </h2>
            <p style={{ 
              fontSize: 'var(--text-lg)', 
              color: 'var(--color-text-secondary)',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              Everything you need to secure your AI agent infrastructure
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
            gap: '24px' 
          }}>
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={i}
                  style={{
                    backgroundColor: 'var(--color-bg)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '28px',
                    border: '1px solid var(--color-border)',
                    transition: 'var(--transition-base)'
                  }}
                  className="animate-fadeInUp"
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: 'var(--color-brand-light)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px'
                  }}>
                    <Icon style={{ width: '24px', height: '24px', color: 'var(--color-brand)' }} />
                  </div>
                  <h3 style={{ 
                    fontSize: 'var(--text-lg)', 
                    fontWeight: 600, 
                    color: 'var(--color-text-primary)',
                    marginBottom: '8px'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{ 
                    fontSize: 'var(--text-sm)', 
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.6
                  }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto',
          backgroundColor: 'var(--color-navy)',
          borderRadius: 'var(--radius-xl)',
          padding: '64px 48px',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            fontSize: 'var(--text-3xl)', 
            fontWeight: 700, 
            color: 'white',
            marginBottom: '16px'
          }}>
            Ready to secure your agents?
          </h2>
          <p style={{ 
            fontSize: 'var(--text-base)', 
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '32px'
          }}>
            Start with 10,000 free scans. No credit card required.
          </p>
          <Link 
            to="/signup"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'white',
              color: 'var(--color-navy)',
              padding: '14px 32px',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-base)',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'var(--transition-fast)'
            }}
            data-testid="cta-signup"
          >
            Create Free Account
            <ChevronRight style={{ width: '18px', height: '18px' }} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        padding: '32px 24px', 
        borderTop: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg)'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield style={{ width: '18px', height: '18px', color: 'var(--color-brand)' }} />
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              © 2025 Zerofalse
            </span>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textDecoration: 'none' }}>
              Privacy
            </a>
            <a href="#" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textDecoration: 'none' }}>
              Terms
            </a>
            <a href="#" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textDecoration: 'none' }}>
              Docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
