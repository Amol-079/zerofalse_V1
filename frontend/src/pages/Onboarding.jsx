import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Key, Code, CheckCircle, Copy, Check } from 'lucide-react';
import client from '../api/client';
import { CodeBlock } from '../components/CodeBlock';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [apiKey, setApiKey] = useState(null);
  const [keyName, setKeyName] = useState('Production Key');
  const [copied, setCopied] = useState(false);
  const [keySaved, setKeySaved] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const integrationCode = `from zerofalse import ZerofalseClient

# Initialize with your API key
zf = ZerofalseClient(api_key="${apiKey?.full_key || 'zf_live_...'}")

# Protect any tool call
@zf.guard_tool
def execute_shell(command):
    return os.system(command)

# Or use context manager
with zf.scan_context(agent_id="my-agent"):
    result = my_agent.execute_tool("search_docs", {"query": "Q4 report"})`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
            Welcome to Zerofalse
          </h1>
          <p className="text-gray-600">Let's get you set up in 3 easy steps</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <React.Fragment key={i}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                  step >= i ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {i}
              </div>
              {i < 3 && (
                <div className={`w-12 h-1 rounded ${step > i ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {step === 1 && (
            <div className="text-center" data-testid="onboarding-step-1">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
                Protect Your AI Agents
              </h2>
              <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                Zerofalse inspects every tool call your AI agents make in real-time, blocking attacks before they cause damage.
                Let's create your first API key to get started.
              </p>
              <button
                onClick={() => setStep(2)}
                className="px-8 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                data-testid="onboarding-next-btn"
              >
                Let's Get Started
              </button>
            </div>
          )}

          {step === 2 && (
            <div data-testid="onboarding-step-2">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Key className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Create API Key
                </h2>
                <p className="text-gray-600">This key will be used to authenticate your API requests</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Key Name</label>
                <input
                  type="text"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Production Key"
                  data-testid="api-key-name-input"
                />
              </div>

              <button
                onClick={handleCreateKey}
                disabled={loading || !keyName.trim()}
                className="w-full py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                data-testid="create-api-key-btn"
              >
                {loading ? 'Creating...' : 'Create API Key'}
              </button>
            </div>
          )}

          {step === 3 && apiKey && (
            <div data-testid="onboarding-step-3">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                  <Key className="w-8 h-8 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Save Your API Key
                </h2>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 mb-4">
                  <span className="font-semibold">⚠️ Important:</span>
                  <span>This is the only time you'll see this key</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="p-4 bg-gray-900 rounded-lg font-mono text-sm text-gray-100 flex items-center justify-between">
                  <span className="break-all">{apiKey.full_key}</span>
                  <button
                    onClick={handleCopyKey}
                    className="ml-4 p-2 hover:bg-gray-800 rounded transition-colors flex-shrink-0"
                    data-testid="copy-key-btn"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={keySaved}
                    onChange={(e) => setKeySaved(e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                    data-testid="key-saved-checkbox"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    I have copied and saved my API key
                  </span>
                </label>
              </div>

              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Code className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Quick Integration</h3>
                    <p className="text-sm text-blue-700">
                      Use this code snippet to integrate Zerofalse into your agent
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <CodeBlock code={integrationCode} language="python" />
              </div>

              <button
                onClick={() => navigate('/dashboard')}
                disabled={!keySaved}
                className="w-full py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                data-testid="open-dashboard-btn"
              >
                <span>Open Dashboard</span>
                <CheckCircle className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
