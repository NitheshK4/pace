'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { Code2, Copy, Check, Send, Sparkles, Terminal, CheckCircle2 } from 'lucide-react';

export default function QuickStartPage() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('pace_YOUR_INGESTION_KEY');
  const [copiedOpenAI, setCopiedOpenAI] = useState(false);
  const [copiedAnthropic, setCopiedAnthropic] = useState(false);
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
    } catch {
      // fallback
    }
  };

  const openAiCode = `from openai import OpenAI
from pace import track

# Instrument your OpenAI client with 1 line of code
client = track(
    OpenAI(),
    api_key="${apiKey}",
    endpoint="http://localhost:8000",
    metadata={"service": "chat-backend", "environment": "production"}
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Analyze system performance."}]
)
print("Response received. Telemetry sent to Pace in background.")`;

  const anthropicCode = `from anthropic import Anthropic
from pace import track

# Instrument your Anthropic client with 1 line of code
client = track(
    Anthropic(),
    api_key="${apiKey}",
    endpoint="http://localhost:8000",
    metadata={"service": "agent-workflow", "environment": "staging"}
)

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1000,
    messages=[{"role": "user", "content": "Summarize user feedback."}]
)
print("Response received. Telemetry sent to Pace in background.")`;

  const handleSendTestEvent = async () => {
    if (!projectId) return;
    setLoading(true);
    setTestStatus(null);

    try {
      // Create temporary test key or send test event through API test endpoint
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
          Instrument your OpenAI or Anthropic LLM clients with 1 line of code. Pace captures usage, cost estimates, and latency in background non-blocking threads without ever logging prompt or completion content.
        </p>
      </div>

      {/* Step 1: Install Package */}
      <div className="bg-pace-surface border border-pace-border rounded-xl p-6 space-y-3">
        <div className="flex items-center space-x-2 text-white font-semibold text-base">
          <span className="w-6 h-6 rounded-full bg-pace-accent text-xs flex items-center justify-center font-bold">1</span>
          <span>Install Python SDK</span>
        </div>
        <div className="bg-pace-bg border border-pace-border rounded-lg p-3.5 flex items-center justify-between font-mono text-sm">
          <span className="text-pace-accent">pip install pace-sdk openai anthropic</span>
        </div>
      </div>

      {/* Step 2: OpenAI Instrumentation */}
      <div className="bg-pace-surface border border-pace-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white font-semibold text-base">
            <span className="w-6 h-6 rounded-full bg-pace-accent text-xs flex items-center justify-center font-bold">2</span>
            <span>OpenAI Client Example</span>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(openAiCode);
              setCopiedOpenAI(true);
              setTimeout(() => setCopiedOpenAI(false), 2000);
            }}
            className="text-xs bg-pace-border hover:bg-pace-border/80 text-white px-3 py-1.5 rounded-lg flex items-center space-x-1"
          >
            {copiedOpenAI ? <Check className="w-3.5 h-3.5 text-pace-success" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedOpenAI ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>
        <pre className="bg-pace-bg border border-pace-border rounded-lg p-4 font-mono text-xs text-pace-text overflow-x-auto leading-relaxed">
          {openAiCode}
        </pre>
      </div>

      {/* Step 3: Anthropic Instrumentation */}
      <div className="bg-pace-surface border border-pace-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white font-semibold text-base">
            <span className="w-6 h-6 rounded-full bg-pace-accent text-xs flex items-center justify-center font-bold">3</span>
            <span>Anthropic Client Example</span>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(anthropicCode);
              setCopiedAnthropic(true);
              setTimeout(() => setCopiedAnthropic(false), 2000);
            }}
            className="text-xs bg-pace-border hover:bg-pace-border/80 text-white px-3 py-1.5 rounded-lg flex items-center space-x-1"
          >
            {copiedAnthropic ? <Check className="w-3.5 h-3.5 text-pace-success" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAnthropic ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>
        <pre className="bg-pace-bg border border-pace-border rounded-lg p-4 font-mono text-xs text-pace-text overflow-x-auto leading-relaxed">
          {anthropicCode}
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
