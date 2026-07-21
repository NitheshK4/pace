'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { Settings, ShieldCheck, Database, RefreshCw, Trash2, CheckCircle2, Server, Cpu } from 'lucide-react';

interface DiagnosticsData {
  component: string;
  version: string;
  database_status: string;
  timescale_enabled: boolean;
  demo_mode: boolean;
  worker_enabled: boolean;
  data_retention_days: number;
  pricing_registry_version: string;
}

export default function SystemSettingsPage() {
  const [diag, setDiag] = useState<DiagnosticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [purging, setPurging] = useState(false);
  const [purgeStatus, setPurgeStatus] = useState<string | null>(null);

  useEffect(() => {
    loadDiagnostics();
  }, []);

  const loadDiagnostics = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<DiagnosticsData>('/system/diagnostics');
      setDiag(data);
    } catch {} finally {
      setLoading(false);
    }
  };

  const handlePurge = async () => {
    if (!confirm('Are you sure you want to purge telemetry data older than 90 days?')) return;
    setPurging(true);
    setPurgeStatus(null);

    try {
      const res = await apiFetch<{ message: string; purged_count: number }>('/system/retention-purge?days=90', {
        method: 'POST',
      });
      setPurgeStatus(`Purge complete: ${res.purged_count} historical telemetry events removed.`);
    } catch (err: any) {
      setPurgeStatus(`Purge error: ${err.message}`);
    } finally {
      setPurging(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Settings className="w-6 h-6 text-pace-accent" />
          <span>System Diagnostics & Maintenance</span>
        </h2>
        <p className="text-sm text-pace-muted mt-0.5">Component health, zero-content privacy verification, and retention controls.</p>
      </div>

      {/* Component Status Cards */}
      {loading || !diag ? (
        <div className="p-8 text-center text-pace-muted flex items-center justify-center space-x-2">
          <RefreshCw className="w-4 h-4 animate-spin text-pace-accent" />
          <span>Fetching system diagnostics...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-pace-surface border border-pace-border rounded-xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center space-x-2 text-white font-bold">
              <Server className="w-4 h-4 text-pace-accent" />
              <span>Core API & Engine</span>
            </div>
            <div className="space-y-1.5 text-xs text-pace-muted font-mono">
              <div className="flex justify-between"><span>Version:</span><span className="text-white">{diag.version}</span></div>
              <div className="flex justify-between">
                <span>Database Status:</span>
                <span className="text-pace-success font-bold uppercase">{diag.database_status}</span>
              </div>
              <div className="flex justify-between">
                <span>TimescaleDB Acceleration:</span>
                <span className={diag.timescale_enabled ? 'text-pace-success' : 'text-pace-muted'}>
                  {diag.timescale_enabled ? 'ENABLED' : 'OPTIONAL (Postgres Baseline)'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-pace-surface border border-pace-border rounded-xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center space-x-2 text-white font-bold">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>Worker & Pricing Engine</span>
            </div>
            <div className="space-y-1.5 text-xs text-pace-muted font-mono">
              <div className="flex justify-between">
                <span>Background Worker:</span>
                <span className="text-pace-success font-bold uppercase">{diag.worker_enabled ? 'ACTIVE' : 'INACTIVE'}</span>
              </div>
              <div className="flex justify-between"><span>Pricing Registry:</span><span className="text-white">{diag.pricing_registry_version}</span></div>
              <div className="flex justify-between"><span>Configured Retention:</span><span className="text-white">{diag.data_retention_days} Days</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Security & Zero-Content Statement */}
      <div className="bg-pace-surface border border-pace-border rounded-xl p-6 space-y-4">
        <div className="flex items-center space-x-2 text-pace-success font-bold text-base">
          <ShieldCheck className="w-5 h-5" />
          <span>Zero-Content & Privacy Hardening Policy</span>
        </div>
        <div className="text-xs text-pace-muted leading-relaxed space-y-2">
          <p>Pace is engineered with strict zero-content principles. By design:</p>
          <ul className="list-disc list-inside space-y-1 text-pace-text font-mono">
            <li>Provider API keys (e.g. OpenAI/Anthropic keys) are NEVER requested, received, or stored.</li>
            <li>Prompts, completions, message content, and system instructions are NEVER logged or saved.</li>
            <li>Project ingestion keys are stored as salted HMAC-SHA256 hashes, never raw.</li>
            <li>Cost metrics are transparent estimates calculated via the versioned pricing registry.</li>
          </ul>
        </div>
      </div>

      {/* Retention Purge Control */}
      <div className="bg-pace-surface border border-pace-border rounded-xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-base">Manual Telemetry Retention Purge</h3>
            <p className="text-xs text-pace-muted mt-0.5">Purge telemetry events older than 90 days to free up database storage.</p>
          </div>
          <button
            onClick={handlePurge}
            disabled={purging}
            className="bg-pace-danger/20 hover:bg-pace-danger/30 text-pace-danger border border-pace-danger/30 text-xs font-semibold px-4 py-2 rounded-lg flex items-center space-x-2 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{purging ? 'Purging...' : 'Execute Retention Purge'}</span>
          </button>
        </div>

        {purgeStatus && (
          <div className="p-3 bg-pace-bg border border-pace-border rounded-lg text-xs text-pace-accent flex items-center space-x-2 font-mono">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{purgeStatus}</span>
          </div>
        )}
      </div>
    </div>
  );
}
