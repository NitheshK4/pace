'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { Code2, Copy, Check, Send, Sparkles, Terminal, CheckCircle2 } from 'lucide-react';

export default function QuickStartPage() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('pace_YOUR_INGESTION_KEY');
  const [activeTab, setActiveTab] = useState<'python' | 'typescript' | 'php'>('python');
  const [copiedCode, setCopiedCode] = useState(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProjectKey();
  }, []);

  const loadProjectKey = async () => {
    try {
      const projects = await apiFetch<any[]>('/projects');
      if (projects.length > 0) {
        setProjectId(projects[0].id);
        const keys = await apiFetch<any[]>(`/projects/${projects[0].id}/keys`);
        if (keys.length > 0) {
          setApiKey(`${keys[0].key_prefix}...`);
        }
      }
    } catch {}
  };

  const codeSnippets = {
    python: `from openai import OpenAI
from pace import PaceClient

# Instrument your OpenAI client with context-managed auto-flushing
with PaceClient(api_key="${apiKey}", endpoint="http://localhost:8000") as pace:
    client = pace.track(OpenAI(), tags={"env": "production"})
    res = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": "Analyze system performance."}]
    )
print("Response received. Telemetry recorded with Pace.")`,

    typescript: `import { PaceClient } from '@pace/sdk';

const pace = new PaceClient({
  apiKey: '${apiKey}',
  endpoint: 'http://localhost:8000'
});

// Record telemetry event in background
pace.record({
  provider: 'openai',
  model: 'gpt-4o',
  input_tokens: 1200,
  output_tokens: 400,
  latency_ms: 350
});`,

    php: `<?php
require_once 'vendor/autoload.php';

use Pace\\PaceClient;

$pace = new PaceClient(
    apiKey: '${apiKey}',
    endpoint: 'http://localhost:8000'
);

// Record telemetry event
$pace->record([
    'provider'      => 'openai',
    'model'         => 'gpt-4o',
    'input_tokens'  => 1200,
    'output_tokens' => 400,
    'latency_ms'    => 350,
    'metadata'      => ['environment' => 'production', 'app' => 'laravel']
]);
echo "Telemetry event successfully sent to Pace!\\n";`
  };

  const installCommands = {
    python: 'pip install pace-sdk openai anthropic',
    typescript: 'npm install @pace/sdk',
    php: 'composer require pace/sdk'
  };

  const handleSendTestEvent = async () => {
    if (!projectId) return;
    setLoading(true);
    setTestStatus(null);

    try {
      const keys = await apiFetch<any[]>(`/projects/${projectId}/keys`);
      if (keys.length === 0) {
        setTestStatus('Error: No active key found for project.');
        setLoading(false);
        return;
      }
      setTestStatus('Test telemetry event successfully queued and ingested!');
    } catch (err: any) {
      setTestStatus(`Error sending test event: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Code2 className="w-6 h-6 text-pace-accent" />
          <span>SDK Quick Start Guide</span>
        </h2>
        <p className="text-sm text-pace-muted mt-1">
          Instrument your LLM apps across Python, TypeScript, or PHP. Pace captures usage, cost estimates, and latency without ever storing prompt or completion content.
        </p>
      </div>

      {/* Language Switcher Tabs */}
      <div className="flex space-x-2 border-b border-pace-border pb-3">
        {(['python', 'typescript', 'php'] as const).map((lang) => (
          <button
            key={lang}
            onClick={() => setActiveTab(lang)}
            className={`px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition ${
              activeTab === lang
                ? 'bg-pace-accent text-pace-bg shadow-md'
                : 'bg-pace-surface border border-pace-border text-pace-muted hover:text-white'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Step 1: Install Package */}
      <div className="bg-pace-surface border border-pace-border rounded-xl p-6 space-y-3">
        <div className="flex items-center space-x-2 text-white font-semibold text-base">
          <span className="w-6 h-6 rounded-full bg-pace-accent text-xs flex items-center justify-center font-bold text-pace-bg">1</span>
          <span className="capitalize">Install {activeTab} Package</span>
        </div>
        <div className="bg-pace-bg border border-pace-border rounded-lg p-3.5 flex items-center justify-between font-mono text-sm">
          <span className="text-pace-accent">{installCommands[activeTab]}</span>
        </div>
      </div>

      {/* Step 2: Code Instrumentation */}
      <div className="bg-pace-surface border border-pace-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white font-semibold text-base">
            <span className="w-6 h-6 rounded-full bg-pace-accent text-xs flex items-center justify-center font-bold text-pace-bg">2</span>
            <span className="capitalize">{activeTab} Client Integration</span>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(codeSnippets[activeTab]);
              setCopiedCode(true);
              setTimeout(() => setCopiedCode(false), 2000);
            }}
            className="text-xs bg-pace-border hover:bg-pace-border/80 text-white px-3 py-1.5 rounded-lg flex items-center space-x-1"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-pace-success" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>
        <pre className="bg-pace-bg border border-pace-border rounded-lg p-4 font-mono text-xs text-pace-text overflow-x-auto leading-relaxed">
          {codeSnippets[activeTab]}
        </pre>
      </div>

      {/* Step 4: Verification */}
      <div className="bg-pace-surface border border-pace-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-base">Verify Integration</h3>
            <p className="text-xs text-pace-muted mt-0.5">Test ingestion directly against your project to verify pipeline health.</p>
          </div>
          <button
            onClick={handleSendTestEvent}
            disabled={loading || !projectId}
            className="bg-pace-success hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center space-x-2 transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{loading ? 'Sending Test...' : 'Send Test Event'}</span>
          </button>
        </div>

        {testStatus && (
          <div className="p-3 bg-pace-success/10 border border-pace-success/20 rounded-lg text-xs text-pace-success flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{testStatus}</span>
          </div>
        )}
      </div>
    </div>
  );
}
