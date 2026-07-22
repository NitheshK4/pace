'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { formatINR } from '@/lib/currency';
import { 
  IndianRupee, 
  Activity, 
  Cpu, 
  Zap, 
  AlertTriangle, 
  Clock, 
  ArrowUpRight,
  Code2,
  RefreshCw
} from 'lucide-react';

interface OverviewData {
  total_spend_usd: number;
  total_requests: number;
  total_input_tokens: number;
  total_output_tokens: number;
  total_cached_tokens: number;
  total_reasoning_tokens: number;
  error_count: number;
  error_rate: number;
  rate_limit_count: number;
  avg_latency_ms: number;
  p95_latency_ms: number;
  unknown_cost_events_count: number;
  spend_provenance: string;
}

interface EventItem {
  id: string;
  event_id: string;
  time: string;
  provider: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  cost_usd: number | null;
  latency_ms: number;
  status_code: number;
}

export default function OverviewPage() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFirstProject();
  }, []);

  useEffect(() => {
    if (projectId) {
      loadData(projectId);
    }
  }, [projectId]);

  const fetchFirstProject = async () => {
    try {
      const projects = await apiFetch<any[]>('/projects');
      if (projects.length > 0) {
        setProjectId(projects[0].id);
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  };

  const loadData = async (pid: string) => {
    setLoading(true);
    try {
      const [ovData, evData] = await Promise.all([
        apiFetch<OverviewData>(`/analytics/overview?project_id=${pid}`),
        apiFetch<{ events: EventItem[] }>(`/analytics/events?project_id=${pid}&limit=10`),
      ]);
      setOverview(ovData);
      setEvents(evData.events);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-pace-muted space-x-2">
        <RefreshCw className="w-5 h-5 animate-spin text-pace-accent" />
        <span>Loading telemetry dashboard...</span>
      </div>
    );
  }

  if (!projectId || !overview) {
    return (
      <div className="max-w-2xl mx-auto mt-12 bg-pace-surface border border-pace-border rounded-2xl p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-pace-accent/10 border border-pace-accent/20 mx-auto flex items-center justify-center text-pace-accent">
          <Code2 className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">No Telemetry Events Received Yet</h2>
        <p className="text-sm text-pace-muted">
          Create a project, copy your ingestion key, and instrument your Python LLM application using the Pace SDK to view real-time telemetry analytics.
        </p>
        <a
          href="/quickstart"
          className="inline-block bg-pace-accent hover:bg-pace-accentHover text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
        >
          View Quick Start Guide
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Estimated Spend Card */}
        <div className="bg-pace-surface border border-pace-border rounded-xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-pace-muted text-xs font-semibold uppercase tracking-wider">
            <span>Estimated Spend (INR)</span>
            <IndianRupee className="w-4 h-4 text-pace-accent" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {formatINR(overview.total_spend_usd, 2)}
          </div>
          <div className="text-[11px] text-pace-muted flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-pace-accent"></span>
            <span>Transparent pricing estimate</span>
          </div>
        </div>

        {/* Total Requests Card */}
        <div className="bg-pace-surface border border-pace-border rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-pace-muted text-xs font-semibold uppercase tracking-wider">
            <span>Total Requests</span>
            <Activity className="w-4 h-4 text-pace-success" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {overview.total_requests.toLocaleString()}
          </div>
          <div className="text-[11px] text-pace-muted">
            100% server-side validated
          </div>
        </div>

        {/* Tokens Processed Card */}
        <div className="bg-pace-surface border border-pace-border rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-pace-muted text-xs font-semibold uppercase tracking-wider">
            <span>Tokens Processed</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {(overview.total_input_tokens + overview.total_output_tokens).toLocaleString()}
          </div>
          <div className="text-[11px] text-pace-muted">
            In: {overview.total_input_tokens.toLocaleString()} | Out: {overview.total_output_tokens.toLocaleString()}
          </div>
        </div>

        {/* Avg Latency & Error Rate Card */}
        <div className="bg-pace-surface border border-pace-border rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-pace-muted text-xs font-semibold uppercase tracking-wider">
            <span>Latency & Error Rate</span>
            <Clock className="w-4 h-4 text-pace-warning" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {overview.avg_latency_ms} <span className="text-sm font-normal text-pace-muted">ms</span>
          </div>
          <div className="text-[11px] text-pace-muted flex items-center justify-between">
            <span>P95: {overview.p95_latency_ms}ms</span>
            <span className={overview.error_rate > 0 ? 'text-pace-danger font-semibold' : 'text-pace-success'}>
              Err: {overview.error_rate}%
            </span>
          </div>
        </div>
      </div>

      {/* Unknown Cost Notice Banner if any */}
      {overview.unknown_cost_events_count > 0 && (
        <div className="bg-pace-warning/10 border border-pace-warning/30 rounded-xl p-4 flex items-center justify-between text-xs text-pace-warning">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>
              {overview.unknown_cost_events_count} event(s) used unlisted models or models without pricing rates. Cost is recorded as NULL.
            </span>
          </div>
          <a href="/pricing" className="underline font-semibold hover:text-white">Configure Rates</a>
        </div>
      )}

      {/* Recent Events Section */}
      <div className="bg-pace-surface border border-pace-border rounded-xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-pace-border flex items-center justify-between">
          <h3 className="font-bold text-white text-base">Recent Ingested Events</h3>
          <a href="/explorer" className="text-xs text-pace-accent hover:underline flex items-center space-x-1 font-semibold">
            <span>Explore All Events</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {events.length === 0 ? (
          <div className="p-8 text-center text-sm text-pace-muted">No recent events recorded in this time range.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-pace-text">
              <thead className="bg-pace-bg/60 border-b border-pace-border text-pace-muted uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Time (UTC)</th>
                  <th className="py-3 px-4">Provider</th>
                  <th className="py-3 px-4">Model</th>
                  <th className="py-3 px-4">Tokens (In / Out)</th>
                  <th className="py-3 px-4">Est. Cost</th>
                  <th className="py-3 px-4">Latency</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pace-border/50">
                {events.map((ev) => (
                  <tr key={ev.id} className="hover:bg-pace-border/30 transition">
                    <td className="py-3 px-4 font-mono text-pace-muted">{new Date(ev.time).toLocaleTimeString()}</td>
                    <td className="py-3 px-4 font-semibold text-white uppercase">{ev.provider}</td>
                    <td className="py-3 px-4 font-mono text-pace-accent">{ev.model}</td>
                    <td className="py-3 px-4">{ev.input_tokens} / {ev.output_tokens}</td>
                    <td className="py-3 px-4 font-mono text-white">
                      {ev.cost_usd !== null ? formatINR(ev.cost_usd, 4) : <span className="text-pace-muted italic">NULL (Unknown)</span>}
                    </td>
                    <td className="py-3 px-4">{ev.latency_ms} ms</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ev.status_code < 400 ? 'bg-pace-success/20 text-pace-success' : 'bg-pace-danger/20 text-pace-danger'
                      }`}>
                        {ev.status_code}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
