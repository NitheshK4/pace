'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { formatINR } from '@/lib/currency';
import { Search, Download, Filter, X, ChevronRight, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function ExplorerPage() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [providerFilter, setProviderFilter] = useState('');
  const [modelFilter, setModelFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFirstProject();
  }, []);

  useEffect(() => {
    if (projectId) {
      loadEvents(projectId);
    }
  }, [projectId, providerFilter, modelFilter]);

  const fetchFirstProject = async () => {
    try {
      const projects = await apiFetch<any[]>('/projects');
      if (projects.length > 0) setProjectId(projects[0].id);
    } catch {}
  };

  const loadEvents = async (pid: string) => {
    setLoading(true);
    try {
      let query = `/analytics/events?project_id=${pid}&limit=50`;
      if (providerFilter) query += `&provider=${providerFilter}`;
      if (modelFilter) query += `&model=${modelFilter}`;
      const data = await apiFetch<{ events: any[] }>(query);
      setEvents(data.events);
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!projectId) return;
    window.open(`http://localhost:8000/v1/exports/csv?project_id=${projectId}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Search className="w-6 h-6 text-pace-accent" />
            <span>Project Event Explorer</span>
          </h2>
          <p className="text-sm text-pace-muted mt-0.5">Filter, inspect, and export LLM usage events in real-time.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="bg-pace-surface border border-pace-border hover:bg-pace-border text-white text-sm font-semibold px-4 py-2 rounded-xl flex items-center space-x-2 transition shadow-lg"
        >
          <Download className="w-4 h-4 text-pace-accent" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-pace-surface border border-pace-border rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center space-x-3">
          <Filter className="w-4 h-4 text-pace-muted" />
          <input
            type="text"
            placeholder="Filter by Provider (e.g. openai)..."
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            className="bg-pace-bg border border-pace-border rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-pace-accent w-48"
          />
          <input
            type="text"
            placeholder="Filter by Model (e.g. gpt-4o)..."
            value={modelFilter}
            onChange={(e) => setModelFilter(e.target.value)}
            className="bg-pace-bg border border-pace-border rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-pace-accent w-48"
          />
        </div>
        <div className="text-xs text-pace-muted">
          Showing {events.length} event(s)
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-pace-surface border border-pace-border rounded-xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 text-center text-pace-muted flex items-center justify-center space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin text-pace-accent" />
            <span>Loading events...</span>
          </div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center text-pace-muted text-sm">No usage events match the current filter parameters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-pace-text">
              <thead className="bg-pace-bg/60 border-b border-pace-border text-pace-muted uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Time (UTC)</th>
                  <th className="py-3 px-4">Provider</th>
                  <th className="py-3 px-4">Model</th>
                  <th className="py-3 px-4">Input Tokens</th>
                  <th className="py-3 px-4">Output Tokens</th>
                  <th className="py-3 px-4">Cost (INR)</th>
                  <th className="py-3 px-4">Latency</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pace-border/50">
                {events.map((ev) => (
                  <tr key={ev.id} className="hover:bg-pace-border/30 transition cursor-pointer" onClick={() => setSelectedEvent(ev)}>
                    <td className="py-3 px-4 font-mono text-pace-muted">{new Date(ev.time).toLocaleString()}</td>
                    <td className="py-3 px-4 font-semibold text-white uppercase">{ev.provider}</td>
                    <td className="py-3 px-4 font-mono text-pace-accent">{ev.model}</td>
                    <td className="py-3 px-4">{ev.input_tokens}</td>
                    <td className="py-3 px-4">{ev.output_tokens}</td>
                    <td className="py-3 px-4 font-mono text-white">
                      {ev.cost_usd !== null ? formatINR(ev.cost_usd, 4) : <span className="text-pace-muted italic">NULL</span>}
                    </td>
                    <td className="py-3 px-4">{ev.latency_ms} ms</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ev.status_code < 400 ? 'bg-pace-success/20 text-pace-success' : 'bg-pace-danger/20 text-pace-danger'
                      }`}>
                        {ev.status_code}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-pace-muted hover:text-white">
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Event Details Side Drawer */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="bg-pace-surface border-l border-pace-border w-full max-w-md h-full p-6 overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-pace-border pb-4">
              <h3 className="font-bold text-lg text-white">Event Telemetry Details</h3>
              <button onClick={() => setSelectedEvent(null)} className="text-pace-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="bg-pace-bg border border-pace-border p-3.5 rounded-xl space-y-2">
                <div className="text-pace-muted">Event ID: <span className="text-white font-bold">{selectedEvent.event_id}</span></div>
                <div className="text-pace-muted">Timestamp: <span className="text-white">{selectedEvent.time}</span></div>
                <div className="text-pace-muted">Provider: <span className="text-pace-accent font-bold uppercase">{selectedEvent.provider}</span></div>
                <div className="text-pace-muted">Model: <span className="text-white">{selectedEvent.model}</span></div>
                <div className="text-pace-muted">Request ID: <span className="text-white">{selectedEvent.request_id || 'N/A'}</span></div>
              </div>

              <div className="bg-pace-bg border border-pace-border p-3.5 rounded-xl space-y-2">
                <div className="text-pace-muted uppercase tracking-wider text-[10px] font-bold text-pace-accent mb-1">Token Mix & Cost</div>
                <div className="flex justify-between"><span>Input Tokens:</span><span className="text-white">{selectedEvent.input_tokens}</span></div>
                <div className="flex justify-between"><span>Output Tokens:</span><span className="text-white">{selectedEvent.output_tokens}</span></div>
                <div className="flex justify-between"><span>Cached Tokens:</span><span className="text-white">{selectedEvent.cached_input_tokens || 0}</span></div>
                <div className="flex justify-between"><span>Reasoning Tokens:</span><span className="text-white">{selectedEvent.reasoning_tokens || 0}</span></div>
                <div className="flex justify-between border-t border-pace-border pt-2 font-bold">
                  <span>Estimated Cost:</span>
                  <span className="text-pace-success">{selectedEvent.cost_usd !== null ? formatINR(selectedEvent.cost_usd, 4) : 'NULL (Unknown)'}</span>
                </div>
              </div>

              {selectedEvent.metadata_json && (
                <div className="bg-pace-bg border border-pace-border p-3.5 rounded-xl space-y-2">
                  <div className="text-pace-muted uppercase tracking-wider text-[10px] font-bold text-pace-accent mb-1">Sanitized Metadata</div>
                  <pre className="text-pace-text text-[11px] overflow-x-auto">{JSON.stringify(selectedEvent.metadata_json, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
