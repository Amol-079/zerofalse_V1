import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Clock,
  ArrowRight,
  Activity,
  Zap,
  Eye
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import client from '../api/client';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const navigate = useNavigate();
  const { org } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, scansRes] = await Promise.all([
          client.get('/api/v1/dashboard/stats'),
          client.get('/api/v1/scan/history?limit=5')
        ]);
        setStats(statsRes.data);
        setRecentScans(scansRes.data.scans || []);
        
        // Generate chart data from stats
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const mockChart = days.map((day, i) => ({
          name: day,
          scans: Math.floor(Math.random() * 500) + 100,
          blocked: Math.floor(Math.random() * 20)
        }));
        setChartData(mockChart);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const StatCard = ({ icon: Icon, label, value, change, changeType, color, bgColor }) => (
    <div 
      style={{
        backgroundColor: 'var(--color-bg)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        border: '1px solid var(--color-border)',
        transition: 'var(--transition-base)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          backgroundColor: bgColor,
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon style={{ width: '22px', height: '22px', color: color }} />
        </div>
        {change && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            color: changeType === 'up' ? 'var(--color-success)' : 'var(--color-danger)'
          }}>
            <TrendingUp style={{ 
              width: '14px', 
              height: '14px',
              transform: changeType === 'down' ? 'rotate(180deg)' : 'none'
            }} />
            {change}
          </div>
        )}
      </div>
      <div style={{ 
        fontSize: 'var(--text-3xl)', 
        fontWeight: 700, 
        color: 'var(--color-text-primary)',
        marginBottom: '4px',
        fontFamily: 'var(--font-mono)'
      }}>
        {value}
      </div>
      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
        {label}
      </div>
    </div>
  );

  const SkeletonCard = () => (
    <div style={{
      backgroundColor: 'var(--color-bg)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      border: '1px solid var(--color-border)'
    }}>
      <div className="skeleton" style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }} />
      <div className="skeleton" style={{ width: '80px', height: '32px', marginBottom: '8px' }} />
      <div className="skeleton" style={{ width: '120px', height: '16px' }} />
    </div>
  );

  const getDecisionBadge = (decision) => {
    const styles = {
      allowed: { bg: 'var(--color-success-bg)', color: 'var(--color-success)', label: 'Allowed' },
      blocked: { bg: 'var(--color-danger-bg)', color: 'var(--color-danger)', label: 'Blocked' },
      flagged: { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)', label: 'Flagged' }
    };
    const style = styles[decision] || styles.allowed;
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 10px',
        backgroundColor: style.bg,
        color: style.color,
        fontSize: 'var(--text-xs)',
        fontWeight: 600,
        borderRadius: 'var(--radius-full)'
      }}>
        {decision === 'allowed' && <CheckCircle style={{ width: '12px', height: '12px' }} />}
        {decision === 'blocked' && <XCircle style={{ width: '12px', height: '12px' }} />}
        {decision === 'flagged' && <AlertTriangle style={{ width: '12px', height: '12px' }} />}
        {style.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="page-transition" data-testid="dashboard-page">
        <div style={{ marginBottom: '32px' }}>
          <div className="skeleton" style={{ width: '200px', height: '28px', marginBottom: '8px' }} />
          <div className="skeleton" style={{ width: '300px', height: '18px' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  const hasScans = stats?.total_scans > 0;

  return (
    <div className="page-transition" data-testid="dashboard-page">
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: 'var(--text-2xl)', 
          fontWeight: 700, 
          color: 'var(--color-text-primary)',
          marginBottom: '4px'
        }}>
          Security Overview
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          Monitor your AI agents' security posture in real-time
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '20px', 
        marginBottom: '32px' 
      }}>
        <StatCard
          icon={Activity}
          label="Total Scans"
          value={stats?.total_scans?.toLocaleString() || '0'}
          change="+12%"
          changeType="up"
          color="var(--color-brand)"
          bgColor="var(--color-brand-light)"
        />
        <StatCard
          icon={XCircle}
          label="Threats Blocked"
          value={stats?.blocked_scans?.toLocaleString() || '0'}
          color="var(--color-danger)"
          bgColor="var(--color-danger-bg)"
        />
        <StatCard
          icon={AlertTriangle}
          label="Open Alerts"
          value={stats?.open_alerts?.toLocaleString() || '0'}
          color="var(--color-warning)"
          bgColor="var(--color-warning-bg)"
        />
        <StatCard
          icon={Zap}
          label="Avg Response"
          value={`${stats?.avg_latency_ms || 4}ms`}
          color="var(--color-success)"
          bgColor="var(--color-success-bg)"
        />
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
        {/* Chart Section */}
        <div style={{
          backgroundColor: 'var(--color-bg)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          border: '1px solid var(--color-border)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Scan Activity
              </h2>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                Last 7 days
              </p>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', backgroundColor: 'var(--color-brand)', borderRadius: '2px' }} />
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Scans</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', backgroundColor: 'var(--color-danger)', borderRadius: '2px' }} />
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Blocked</span>
              </div>
            </div>
          </div>
          
          {hasScans ? (
            <div style={{ height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-brand)" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="var(--color-brand)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-sm)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="scans" 
                    stroke="var(--color-brand)" 
                    strokeWidth={2}
                    fill="url(#colorScans)" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="blocked" 
                    stroke="var(--color-danger)" 
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ 
              height: '240px', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-md)'
            }}>
              <Eye style={{ width: '40px', height: '40px', color: 'var(--color-text-muted)', marginBottom: '16px' }} />
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                No scan data yet.<br />
                Integrate Zerofalse to see activity.
              </p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div style={{
          backgroundColor: 'var(--color-bg)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          overflow: 'hidden'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '20px 24px',
            borderBottom: '1px solid var(--color-border)'
          }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              Recent Scans
            </h2>
            <button 
              onClick={() => navigate('/scan-logs')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: 'var(--color-brand)',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
              data-testid="view-all-scans"
            >
              View All
              <ArrowRight style={{ width: '14px', height: '14px' }} />
            </button>
          </div>
          
          {recentScans.length > 0 ? (
            <div>
              {recentScans.map((scan, i) => (
                <div 
                  key={scan.id || i}
                  style={{
                    padding: '16px 24px',
                    borderBottom: i < recentScans.length - 1 ? '1px solid var(--color-border)' : 'none',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <code style={{ 
                      fontSize: 'var(--text-sm)', 
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 500,
                      color: 'var(--color-text-primary)'
                    }}>
                      {scan.tool_name || 'unknown_tool'}
                    </code>
                    {getDecisionBadge(scan.decision)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                      Risk: {scan.risk_score || 0}%
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                      •
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                      {scan.created_at ? new Date(scan.created_at).toLocaleTimeString() : 'Just now'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              padding: '48px 24px', 
              textAlign: 'center' 
            }}>
              <Shield style={{ width: '40px', height: '40px', color: 'var(--color-text-muted)', margin: '0 auto 16px' }} />
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                No scans yet
              </p>
              <button
                onClick={() => navigate('/api-keys')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  backgroundColor: 'var(--color-brand)',
                  color: 'white',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer'
                }}
                data-testid="get-api-key"
              >
                Get API Key
                <ArrowRight style={{ width: '14px', height: '14px' }} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Usage Banner */}
      {org && (
        <div style={{
          marginTop: '24px',
          padding: '20px 24px',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
              Monthly Usage
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              {org.scan_count_month?.toLocaleString() || 0} of {org.scan_limit_month?.toLocaleString() || 10000} scans used
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '200px', height: '8px', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{ 
                width: `${Math.min((org.scan_count_month / org.scan_limit_month) * 100, 100)}%`,
                height: '100%',
                backgroundColor: 'var(--color-brand)',
                borderRadius: 'var(--radius-full)',
                transition: 'var(--transition-base)'
              }} />
            </div>
            <button
              style={{
                padding: '8px 16px',
                backgroundColor: 'var(--color-brand)',
                color: 'white',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer'
              }}
            >
              Upgrade Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
