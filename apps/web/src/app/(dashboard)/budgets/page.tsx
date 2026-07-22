'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { formatINR, formatINRShort } from '@/lib/currency';
import { Wallet, Plus, Bell, RefreshCw, X, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface Budget {
  id: string;
  name: string;
  amount_usd: number;
  period: string;
  metric: string;
  thresholds: number[];
  destinations: any[];
  is_active: boolean;
}

interface AlertItem {
  id: string;
  event_type: string;
  threshold_percent: number;
  severity: string;
  observed_value: number;
  limit_value: number;
  destination_type: string;
  status: string;
  delivered_at: string;
}

export default function BudgetsPage() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form state
  const [name, setName] = useState('Monthly Cost Limit');
  const [amountUsd, setAmountUsd] = useState('500');
  const [period, setPeriod] = useState('monthly');
  const [webhookUrl, setWebhookUrl] = useState('');

  useEffect(() => {
    fetchFirstProject();
  }, []);

  useEffect(() => {
    if (projectId) {
      loadBudgetsAndAlerts(projectId);
    }
  }, [projectId]);

  const fetchFirstProject = async () => {
    try {
      const projects = await apiFetch<any[]>('/projects');
      if (projects.length > 0) setProjectId(projects[0].id);
    } catch {}
  };

  const loadBudgetsAndAlerts = async (pid: string) => {
    setLoading(true);
    try {
      const [bData, aData] = await Promise.all([
        apiFetch<Budget[]>(`/budgets?project_id=${pid}`),
        apiFetch<AlertItem[]>(`/budgets/alerts?project_id=${pid}`),
      ]);
      setBudgets(bData);
      setAlerts(aData);
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return;

    try {
      const dests: Array<{ type: string; url?: string }> = [{ type: 'console' }];
      if (webhookUrl.trim()) {
        dests.push({ type: 'webhook', url: webhookUrl.trim() });
      }

      await apiFetch('/budgets', {
        method: 'POST',
        body: JSON.stringify({
          project_id: projectId,
          name,
          amount_usd: parseFloat(amountUsd),
          period,
          metric: 'spend',
          thresholds: [50, 80, 100, 120],
          destinations: dests,
        }),
      });

      setIsAddOpen(false);
      loadBudgetsAndAlerts(projectId);
    } catch (err: any) {
      alert(err.message || 'Failed to create budget');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Wallet className="w-6 h-6 text-pace-accent" />
            <span>Budgets & Alert Controls</span>
          </h2>
          <p className="text-sm text-pace-muted mt-0.5">Configure threshold limits, deduplicated alerts, and webhook destinations.</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-pace-accent hover:bg-pace-accentHover text-white text-sm font-semibold px-4 py-2 rounded-xl flex items-center space-x-2 transition shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Budget Limit</span>
        </button>
      </div>

      {/* Active Budgets Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-pace-muted uppercase tracking-wider">Active Budget Controls</h3>
        {loading ? (
          <div className="p-8 text-center text-pace-muted flex items-center justify-center space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin text-pace-accent" />
            <span>Loading budget controls...</span>
          </div>
        ) : budgets.length === 0 ? (
          <div className="bg-pace-surface border border-pace-border p-6 rounded-xl text-center text-sm text-pace-muted">
            No budgets configured yet. Click "New Budget Limit" above to set a spend limit.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {budgets.map((b) => (
              <div key={b.id} className="bg-pace-surface border border-pace-border rounded-xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-base">{b.name}</h4>
                    <span className="text-xs text-pace-muted uppercase tracking-wider font-semibold">{b.period} {b.metric} limit</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-white">{formatINRShort(b.amount_usd, 2)}</div>
                    <span className="text-[10px] text-pace-success font-semibold bg-pace-success/10 px-2 py-0.5 rounded border border-pace-success/20">ACTIVE</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-pace-muted">
                    <span>Threshold Alerts:</span>
                    <span className="font-mono text-white">{b.thresholds.join('%, ')}%</span>
                  </div>
                  <div className="w-full bg-pace-bg h-2 rounded-full overflow-hidden border border-pace-border">
                    <div className="bg-pace-accent h-full w-[25%] rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Alert Delivery History Feed */}
      <div className="bg-pace-surface border border-pace-border rounded-xl overflow-hidden shadow-xl space-y-4 p-5">
        <div className="flex items-center space-x-2 text-white font-bold text-base">
          <Bell className="w-5 h-5 text-pace-warning" />
          <span>Recorded Alert Deliveries & Audit Trail</span>
        </div>

        {alerts.length === 0 ? (
          <div className="text-center text-xs text-pace-muted py-6">No alert deliveries recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-pace-text">
              <thead className="bg-pace-bg/60 border-b border-pace-border text-pace-muted uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Delivered At (UTC)</th>
                  <th className="py-3 px-4">Event Type</th>
                  <th className="py-3 px-4">Threshold</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Observed / Limit</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pace-border/50">
                {alerts.map((a) => (
                  <tr key={a.id} className="hover:bg-pace-border/30 transition">
                    <td className="py-3 px-4 font-mono text-pace-muted">{new Date(a.delivered_at).toLocaleString()}</td>
                    <td className="py-3 px-4 font-semibold text-white">{a.event_type}</td>
                    <td className="py-3 px-4 font-bold text-pace-accent">{a.threshold_percent}%</td>
                    <td className="py-3 px-4 uppercase font-bold text-[10px]">
                      <span className={`px-2 py-0.5 rounded ${
                        a.severity === 'critical' ? 'bg-pace-danger/20 text-pace-danger' : 'bg-pace-warning/20 text-pace-warning'
                      }`}>
                        {a.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">{formatINRShort(a.observed_value, 2)} / {formatINRShort(a.limit_value, 2)}</td>
                    <td className="py-3 px-4 text-pace-muted">{a.destination_type}</td>
                    <td className="py-3 px-4">
                      <span className="bg-pace-success/20 text-pace-success px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Budget Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-pace-surface border border-pace-border w-full max-w-md rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-white">Create Budget Limit</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-pace-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBudget} className="space-y-4 text-xs">
              <div>
                <label className="block text-pace-muted mb-1 font-semibold">Budget Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monthly Production LLM Cap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-pace-bg border border-pace-border rounded-lg p-2.5 text-white focus:outline-none focus:border-pace-accent"
                />
              </div>

              <div>
                <label className="block text-pace-muted mb-1 font-semibold">Amount (USD - auto-converted to INR)</label>
                <input
                  type="number"
                  step="1"
                  required
                  value={amountUsd}
                  onChange={(e) => setAmountUsd(e.target.value)}
                  className="w-full bg-pace-bg border border-pace-border rounded-lg p-2.5 text-white focus:outline-none focus:border-pace-accent font-mono"
                />
              </div>

              <div>
                <label className="block text-pace-muted mb-1 font-semibold">Period</label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full bg-pace-bg border border-pace-border rounded-lg p-2.5 text-white focus:outline-none focus:border-pace-accent"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="rolling_24h">Rolling 24 Hours</option>
                </select>
              </div>

              <div>
                <label className="block text-pace-muted mb-1 font-semibold">Webhook Destination URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://hooks.slack.com/services/..."
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full bg-pace-bg border border-pace-border rounded-lg p-2.5 text-white focus:outline-none focus:border-pace-accent font-mono"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 text-pace-muted hover:text-white">Cancel</button>
                <button type="submit" className="bg-pace-accent hover:bg-pace-accentHover text-white font-semibold px-4 py-2 rounded-lg">Save Budget</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
