import React, { useState, useEffect } from 'react';
import { useDashboard } from '../hooks/useAuth';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ScanResultBadge } from '../components/ScanResultBadge';
import { RiskMeter } from '../components/RiskMeter';
import { Activity, Shield, AlertTriangle, Users, ChevronDown, ChevronUp, X, Copy } from 'lucide-react';
import { formatRelativeTime } from '../utils/formatters';
import client from '../api/client';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [threatBreakdown, setThreatBreakdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, eventsRes, threatsRes] = await Promise.all([
          client.get('/api/v1/dashboard/stats'),
          client.get('/api/v1/dashboard/recent-events'),
          client.get('/api/v1/dashboard/threat-breakdown')
        ]);
        setStats(statsRes.data);
        setRecentEvents(eventsRes.data);
        setThreatBreakdown(threatsRes.data);
        
        const shouldShow = statsRes.data.total_scans_today === 0 && !localStorage.getItem('zf_onboarding_dismissed');
        setShowOnboarding(shouldShow);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const dismissOnboarding = () => {
    localStorage.setItem('zf_onboarding_dismissed', 'true');
    setShowOnboarding(false);
  };

  const statCards = [
    { title: 'Scans Today', value: stats?.total_scans_today || 0, icon: Activity, color: 'var(--color-brand)', bg: 'var(--color-brand-light)' },
    { title: 'Blocked Today', value: stats?.blocked_today || 0, icon: Shield, color: 'var(--color-danger)', bg: 'var(--color-danger-bg)' },
    { title: 'Open Alerts', value: stats?.open_alerts || 0, icon: AlertTriangle, color: 'var(--color-warning)', bg: 'var(--color-warning-bg)' },
    { title: 'Active Agents', value: stats?.active_agents || 0, icon: Users, color: 'var(--color-success)', bg: 'var(--color-success-bg)' }
  ];

  const pieData = threatBreakdown?.by_type
    ? Object.entries(threatBreakdown.by_type).map(([name, value]) => ({ name: name.replace('_', ' '), value }))
    : [];

  const COLORS = ['var(--color-brand)', 'var(--color-warning)', 'var(--color-danger)', '#8b5cf6', '#14b8a6'];

  return (
    <div className="page-transition" style={{ padding: '0' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Overview</h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Monitor your AI agent security in real-time</p>
      </div>

      {showOnboarding && (
        <div style={{ padding: '20px 24px', backgroundColor: 'var(--color-brand-subtle)', border: '1px solid rgba(26,86,255,0.2)', borderRadius: 'var(--radius-lg)', marginBottom: '24px', position: 'relative' }}>
          <button onClick={dismissOnboarding} style={{ position: 'absolute', top: '16px', right: '16px', padding: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
            <X style={{ width: '16px', height: '16px', color: 'var(--color-text-muted)' }} />
          </button>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-brand)', marginBottom: '16px' }}>Get Started with Zerofalse</h3>
          <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth >= 768 ? 'repeat(3, 1fr)' : '1fr', gap: '16px' }}>
            {[
              { num: 1, title: 'Create an API Key', action: 'Go to API Keys', link: '/api-keys' },
              { num: 2, title: 'Install the SDK', action: 'pip install zerofalse', copy: true },
              { num: 3, title: 'Make your first scan', action: 'View Docs', link: '#' }
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--color-brand)', color: 'white', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{step.num}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>{step.title}</div>
                  {step.copy ? (
                    <button onClick={() => navigator.clipboard.writeText(step.action)} style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-brand)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Copy style={{ width: '12px', height: '12px' }} /> {step.action}
                    </button>
                  ) : (
                    <a href={step.link} style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-brand)', textDecoration: 'none' }}>{step.action} →</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth >= 768 ? 'repeat(4, 1fr)' : window.innerWidth >= 640 ? 'repeat(2, 1fr)' : '1fr', gap: '16px', marginBottom: '20px' }}>
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="animate-fadeInUp" style={{ padding: '20px 24px', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', animationDelay: `${i * 50}ms`, transition: 'var(--transition-base)', cursor: 'default' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }} data-testid={`stat-card-${card.title.toLowerCase().replace(' ', '-')}`}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-muted)', marginBottom: '8px' }}>{card.title}</div>
                {loading ? (
                  <div className="skeleton" style={{ width: '60px', height: '28px' }} />
                ) : (
                  <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>{card.value.toLocaleString()}</div>
                )}
              </div>
              <div style={{ width: '36px', height: '36px', backgroundColor: card.bg, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon style={{ width: '20px', height: '20px', color: card.color }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth >= 1024 ? '65fr 35fr' : '1fr', gap: '20px', marginBottom: '20px' }}>
        <div style={{ padding: '24px', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>Scan Activity — Last 14 Days</h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '20px' }}>Total scans and blocked threats</p>
          {stats?.daily_trend && stats.daily_trend.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={stats.daily_trend}>
                <defs>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-brand)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--color-brand)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="scans" stroke="var(--color-brand)" strokeWidth={2} fill="url(#colorScans)" name="Total Scans" />
                <Area type="monotone" dataKey="blocked" stroke="var(--color-danger)" strokeWidth={2} fill="rgba(239,68,68,0.1)" name="Blocked" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
              <Activity style={{ width: '48px', height: '48px', opacity: 0.2, marginBottom: '12px' }} />
              <p style={{ fontSize: 'var(--text-sm)' }}>No scan activity yet</p>
            </div>
          )}
        </div>

        <div style={{ padding: '24px', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '20px' }}>Threats by Type</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
              <Shield style={{ width: '48px', height: '48px', opacity: 0.2, marginBottom: '12px' }} />
              <p style={{ fontSize: 'var(--text-sm)' }}>No threats detected</p>
            </div>
          )}
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text-primary)' }}>Recent Scan Events</h3>
          <a href="/scan-logs" style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-brand)', textDecoration: 'none' }}>View all →</a>
        </div>

        {recentEvents && recentEvents.length > 0 ? (
          <div>
            {recentEvents.slice(0, 10).map((event) => (
              <div key={event.id}>
                <div onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)} style={{ display: 'flex', alignItems: 'center', padding: '12px 24px', borderBottom: '1px solid var(--color-surface-2)', cursor: 'pointer', transition: 'var(--transition-fast)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <div style={{ width: '80px', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', flexShrink: 0 }}>{formatRelativeTime(event.created_at)}</div>
                  <div style={{ width: '120px', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 0 }}>{event.agent_id}</div>
                  <div style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-primary)' }}>{event.tool_name}</div>
                  <div style={{ flexShrink: 0, marginRight: '12px' }}><ScanResultBadge decision={event.decision} /></div>
                  <div style={{ width: '64px', flexShrink: 0, marginRight: '12px' }}><RiskMeter score={event.risk_score} /></div>
                  <div style={{ flexShrink: 0 }}>{expandedEvent === event.id ? <ChevronUp style={{ width: '16px', height: '16px', color: 'var(--color-text-muted)' }} /> : <ChevronDown style={{ width: '16px', height: '16px', color: 'var(--color-text-muted)' }} />}</div>
                </div>
                {expandedEvent === event.id && event.evidence_summary && (
                  <div style={{ padding: '16px 24px 24px 104px', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-surface-2)' }}>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Evidence:</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{event.evidence_summary}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '64px 24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <Activity style={{ width: '48px', height: '48px', opacity: 0.2, marginBottom: '12px', marginLeft: 'auto', marginRight: 'auto' }} />
            <p style={{ fontSize: 'var(--text-sm)' }}>No scan events yet. Start making API calls to see data here.</p>
          </div>
        )}
      </div>
    </div>
  );
}