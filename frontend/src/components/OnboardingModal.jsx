import React, { useState, useEffect } from 'react';
import { X, Check, Copy } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { CodeBlock } from './CodeBlock';
import client from '../api/client';

export const OnboardingModal = ({ onComplete }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [apiKey, setApiKey] = useState(null);
  const [keyName, setKeyName] = useState('Production Key');
  const [keySaved, setKeySaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCreateKey = async () => {
    setLoading(true);
    try {
      const response = await client.post('/api/v1/keys/', { name: keyName });
      setApiKey(response.data);
      setStep(3);
    } catch (error) {
      console.error('Error creating API key:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey.full_key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleComplete = () => {
    localStorage.setItem('zf_onboarded', 'true');
    onComplete();
  };

  const integrationCode = `from zerofalse import ZerofalseClient

# Initialize with your API key
zf = ZerofalseClient(api_key="${apiKey?.full_key || 'zf_live_...'}")

# Protect any tool call
@zf.guard_tool
def execute_shell(command):
    return os.system(command)`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" data-testid="onboarding-modal">
      <div className="bg-white rounded-2xl w-full max-w-2xl relative" style={{ boxShadow: 'var(--shadow-4)' }}>
        <button
          onClick={handleComplete}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          data-testid="close-onboarding"
        >
          <X className="w-5 h-5" style={{ color: 'var(--text-3)' }} />
        </button>

        <div className="p-8">
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  step >= i ? 'w-8' : ''
                }`}
                style={{ backgroundColor: step >= i ? 'var(--brand-600)' : 'var(--border)' }}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-1)' }}>
                Welcome, {user?.full_name?.split(' ')[0] || 'there'}!
              </h2>
              <p className="text-lg mb-8" style={{ color: 'var(--text-3)' }}>
                Zerofalse protects your AI agents by inspecting every tool call in real-time.
              </p>
              <button
                onClick={() => setStep(2)}
                className="px-8 py-3 text-base font-semibold text-white rounded-lg transition-all hover:scale-98 active:scale-95"
                style={{ backgroundColor: 'var(--brand-600)', boxShadow: 'var(--shadow-2)' }}
                data-testid="onboarding-next-step1"
              >
                Get Started
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-2 text-center" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-1)' }}>
                Create Your API Key
              </h2>
              <p className="text-center mb-6" style={{ color: 'var(--text-3)' }}>
                You'll need this key to start scanning tool calls
              </p>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-2)', fontWeight: 500 }}>
                  Key Name
                </label>
                <input
                  type="text"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg"
                  style={{ borderColor: 'var(--border)', borderRadius: '8px' }}
                  placeholder="Production Key"
                  data-testid="onboarding-key-name"
                />
              </div>

              <button
                onClick={handleCreateKey}
                disabled={loading || !keyName.trim()}
                className="w-full py-3 text-base font-semibold text-white rounded-lg transition-all disabled:opacity-50"
                style={{ backgroundColor: 'var(--brand-600)', boxShadow: 'var(--shadow-2)', borderRadius: '8px' }}
                data-testid="onboarding-create-key"
              >
                {loading ? 'Creating...' : 'Create API Key'}
              </button>
            </div>
          )}

          {step === 3 && apiKey && (
            <div>
              <h2 className="text-2xl font-bold mb-2 text-center" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-1)' }}>
                Save Your API Key
              </h2>
              
              <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: 'var(--warning-bg)', borderColor: 'var(--warning)', borderWidth: '1px', borderRadius: '8px' }}>
                <p className="text-sm font-medium" style={{ color: 'var(--text-2)' }}>
                  ⚠️ This is the only time you'll see this key. Copy it now!
                </p>
              </div>

              <div className="mb-4 p-4 rounded-lg flex items-center justify-between" style={{ backgroundColor: 'var(--navy)', borderRadius: '8px' }}>
                <code className="text-sm text-white break-all font-mono">{apiKey.full_key}</code>
                <button
                  onClick={handleCopyKey}
                  className="ml-4 p-2 hover:bg-white/10 rounded transition-colors flex-shrink-0"
                  data-testid="onboarding-copy-key"
                >
                  {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
                </button>
              </div>

              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={keySaved}
                    onChange={(e) => setKeySaved(e.target.checked)}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: 'var(--brand-600)' }}
                    data-testid="onboarding-confirm-saved"
                  />
                  <span className="text-sm font-medium" style={{ color: 'var(--text-2)', fontWeight: 500 }}>
                    I have copied and saved my API key
                  </span>
                </label>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-2)', fontWeight: 600 }}>
                  Quick Start Code:
                </h3>
                <CodeBlock code={integrationCode} language="python" />
              </div>

              <button
                onClick={handleComplete}
                disabled={!keySaved}
                className="w-full py-3 text-base font-semibold text-white rounded-lg transition-all disabled:opacity-50"
                style={{ backgroundColor: 'var(--brand-600)', boxShadow: 'var(--shadow-2)', borderRadius: '8px' }}
                data-testid="onboarding-complete"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
