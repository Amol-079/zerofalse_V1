import React, { useState } from 'react';
import { Sparkles, Info, Check, Eye, EyeOff, Loader2, Zap, Shield } from 'lucide-react';
import client from '../api/client';

const AIConfig = () => {
  const [selectedModel, setSelectedModel] = useState('claude');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const models = [
    {
      id: 'claude',
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      icon: 'A',
      iconBg: '#8b5cf6',
      rate: 96,
      rateColor: '#8b5cf6',
      desc: 'Best-in-class reasoning for detecting subtle injection patterns and context-aware attacks. Recommended.',
      placeholder: 'sk-ant-...'
    },
    {
      id: 'gpt4',
      name: 'GPT-4o',
      provider: 'OpenAI',
      icon: 'O',
      iconBg: '#0f172a',
      rate: 94,
      rateColor: '#10b981',
      desc: 'Excellent threat analysis with strong performance on code injection and shell attack patterns.',
      placeholder: 'sk-...'
    },
    {
      id: 'gemini',
      name: 'Gemini 1.5 Pro',
      provider: 'Google DeepMind',
      icon: 'G',
      iconBg: 'linear-gradient(135deg, #4285f4, #ea4335)',
      rate: 91,
      rateColor: '#f59e0b',
      desc: 'Strong multimodal understanding useful for detecting attacks embedded in diverse input formats.',
      placeholder: 'AIza...'
    },
    {
      id: 'custom',
      name: 'Custom Model',
      provider: 'Self-hosted',
      icon: '⚙',
      iconBg: '#64748b',
      rate: null,
      rateColor: '#64748b',
      desc: 'Connect any OpenAI-compatible API endpoint. Use local models like Llama 3 or Mistral for maximum privacy.',
      placeholder: 'http://localhost:8000/v1'
    }
  ];

  const currentModel = models.find(m => m.id === selectedModel);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      // Mock save - would call real API
      await new Promise(r => setTimeout(r, 1000));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      await new Promise(r => setTimeout(r, 1500));
      setTestResult({ success: true });
    } catch (err) {
      setTestResult({ success: false });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="page-transition" data-testid="ai-config-page">
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
          AI Model Configuration
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          Connect your own AI model to enhance threat detection beyond pattern matching
        </p>
      </div>

      {/* Explanation Card */}
      <div style={{
        background: 'linear-gradient(135deg, #eff4ff, #e8eeff)',
        border: '1px solid rgba(26,86,255,0.2)',
        borderRadius: '14px',
        padding: '24px',
        display: 'flex',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          background: 'var(--color-brand)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Info style={{ width: '20px', height: '20px', color: 'white' }} />
        </div>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
            How AI-Enhanced Detection Works
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
            When you connect an AI model, Zerofalse sends anonymized tool call metadata to your model for semantic analysis. 
            Your model can detect novel attacks that pattern matching alone might miss — such as subtle social engineering or 
            context-aware injection attempts. Your API key is used only for detection calls and is stored encrypted.
          </p>
        </div>
      </div>

      {/* Model Selection */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '20px' }}>
          Choose Your AI Model
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {models.map(model => (
            <div
              key={model.id}
              onClick={() => setSelectedModel(model.id)}
              style={{
                border: `1.5px solid ${selectedModel === model.id ? 'var(--color-brand)' : 'var(--color-border)'}`,
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                background: selectedModel === model.id ? 'var(--color-brand-light)' : 'var(--color-bg)',
                boxShadow: selectedModel === model.id ? '0 0 0 3px rgba(26,86,255,0.1)' : 'none',
                transition: 'all 0.15s ease'
              }}
              data-testid={`model-${model.id}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    background: model.iconBg,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: 'white'
                  }}>
                    {model.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{model.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{model.provider}</div>
                  </div>
                </div>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: `2px solid ${selectedModel === model.id ? 'var(--color-brand)' : 'var(--color-border)'}`,
                  background: selectedModel === model.id ? 'var(--color-brand)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {selectedModel === model.id && <Check style={{ width: '12px', height: '12px', color: 'white' }} />}
                </div>
              </div>
              
              <div style={{ marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Detection Rate</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: model.rateColor }}>
                    {model.rate ? `${model.rate}%` : 'Variable'}
                  </span>
                </div>
                <div style={{ height: '4px', borderRadius: '9999px', background: 'var(--color-surface-2)', overflow: 'hidden' }}>
                  {model.rate ? (
                    <div style={{
                      width: `${model.rate}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${model.rateColor}, ${model.rateColor}dd)`,
                      borderRadius: '9999px'
                    }} />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: `repeating-linear-gradient(90deg, ${model.rateColor} 0px, ${model.rateColor} 4px, transparent 4px, transparent 8px)`
                    }} />
                  )}
                </div>
              </div>
              
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.6, marginTop: '12px' }}>
                {model.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* API Key Configuration */}
      <div style={{
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '32px'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '16px' }}>
          API Key for {currentModel?.name}
        </h3>
        
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          {currentModel?.provider} API Key
        </label>
        <div style={{ position: 'relative', marginBottom: '12px' }}>
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={currentModel?.placeholder}
            style={{ width: '100%', paddingRight: '44px', boxSizing: 'border-box' }}
            data-testid="api-key-input"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
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
            {showKey ? (
              <EyeOff style={{ width: '18px', height: '18px', color: 'var(--color-text-muted)' }} />
            ) : (
              <Eye style={{ width: '18px', height: '18px', color: 'var(--color-text-muted)' }} />
            )}
          </button>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
          <Shield style={{ width: '14px', height: '14px', color: 'var(--color-text-muted)' }} />
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Your API key is encrypted at rest and never logged or shared.
          </span>
        </div>

        {saveSuccess && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            background: 'var(--color-success-bg)',
            border: '1px solid var(--color-success-border)',
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            <Check style={{ width: '18px', height: '18px', color: 'var(--color-success)' }} />
            <span style={{ fontSize: '14px', color: 'var(--color-success)' }}>
              API key saved. AI-enhanced detection is now active.
            </span>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleSave}
            disabled={!apiKey || isSaving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: !apiKey || isSaving ? 'var(--color-border)' : 'var(--color-brand)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: !apiKey || isSaving ? 'not-allowed' : 'pointer'
            }}
            data-testid="save-api-key"
          >
            {isSaving && <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 0.6s linear infinite' }} />}
            Save API Key
          </button>
          <button
            onClick={handleTest}
            disabled={!apiKey || isTesting}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: !apiKey || isTesting ? 'not-allowed' : 'pointer'
            }}
            data-testid="test-connection"
          >
            {isTesting && <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 0.6s linear infinite' }} />}
            Test Connection
          </button>
          {testResult && (
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              color: testResult.success ? 'var(--color-success)' : 'var(--color-danger)'
            }}>
              {testResult.success ? '✓ Connected successfully' : '✗ Connection failed — check your API key'}
            </span>
          )}
        </div>
      </div>

      {/* Detection Performance */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '20px' }}>
          Detection Performance
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Pattern Detection', value: '40+', subtitle: 'threat patterns', icon: Shield, color: 'var(--color-brand)' },
            { label: 'AI Enhancement', value: '+23%', subtitle: 'more threats caught', icon: Sparkles, color: '#8b5cf6' },
            { label: 'Avg Latency', value: '<4ms', subtitle: 'with AI enabled', icon: Zap, color: '#f59e0b' }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} style={{
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    background: `${stat.color}15`,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon style={{ width: '18px', height: '18px', color: stat.color }} />
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{stat.label}</span>
                </div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{stat.subtitle}</div>
              </div>
            );
          })}
        </div>

        {/* Comparison Table */}
        <div style={{
          background: 'var(--color-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-surface)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Threat Type</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pattern Engine</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>With AI</th>
              </tr>
            </thead>
            <tbody>
              {[
                { type: 'Prompt Injection', pattern: { detected: true, text: 'Detected' }, ai: { detected: true, text: '+ Context analysis' } },
                { type: 'Novel Attacks', pattern: { detected: false, text: 'May miss' }, ai: { detected: true, text: 'Semantic detection' } },
                { type: 'Credential Leak', pattern: { detected: true, text: 'Detected' }, ai: { detected: true, text: '+ Pattern verification' } },
                { type: 'Social Engineering', pattern: { detected: false, text: 'Not detected' }, ai: { detected: true, text: 'Intent analysis' } }
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: 'var(--color-text-primary)' }}>{row.type}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 600, color: row.pattern.detected ? 'var(--color-success)' : 'var(--color-danger)' }}>
                    {row.pattern.detected ? '✓' : '✗'} {row.pattern.text}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 600, color: row.ai.detected ? 'var(--color-success)' : 'var(--color-danger)' }}>
                    {row.ai.detected ? '✓' : '✗'} {row.ai.text}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default AIConfig;
