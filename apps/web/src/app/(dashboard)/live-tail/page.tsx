'use client';

import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '@/lib/api';
import { formatINR } from '@/lib/currency';
import { Radio, Pause, Play, Wifi, WifiOff, Trash2 } from 'lucide-react';

interface LiveEvent {
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

export default function LiveTailPage() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    fetchFirstProject();
  }, []);

  useEffect(() => {
    if (!projectId || isPaused) return;

    const token = localStorage.getItem('pace_token') || '';
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/v1';
    const url = `${baseUrl}/analytics/live-tail?project_id=${projectId}`;

    const es = new EventSource(url, { withCredentials: true });
    eventSourceRef.current = es;

    es.onopen = () => {
      setIsConnected(true);
    };

    es.onmessage = (e) => {
      try {
        const evData: LiveEvent = JSON.parse(e.data);
        setEvents((prev) => [evData, ...prev.slice(0, 99)]);
      } catch {}
    };

    es.onerror = () => {
      setIsConnected(false);
    };

    return () => {
      es.close();
      setIsConnected(false);
    };
  }, [projectId, isPaused]);

  const fetchFirstProject = async () => {
    try {
      const projects = await apiFetch<any[]>('/projects');
      if (projects.length > 0) setProjectId(projects[0].id);
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Radio className="w-6 h-6 text-pace-accent animate-pulse" />
            <span>Live Tail Feed</span>
          </h2>
          <p className="text-sm text-pace-muted mt-0.5">Real-time SSE event stream for live LLM usage monitoring.</p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Connection Status Badge */}
          <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
            isConnected ? 'bg-pace-success/10 text-pace-success border border-pace-success/30' : 'bg-pace-warning/10 text-pace-warning border border-pace-warning/30'
          }`}>
            {isConnected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isConnected ? 'STREAM CONNECTED' : 'RECONNECTING'}</span>
          </div>

          {/* Pause / Play toggle */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="bg-pace-surface border border-pace-border hover:bg-pace-border text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition"
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-pace-success" /> : <Pause className="w-3.5 h-3.5 text-pace-warning" />}
            <span>{isPaused ? 'Resume Stream' : 'Pause Stream'}</span>
          </button>

          {/* Clear Feed */}
          <button
            onClick={() => setEvents([])}
            className="bg-pace-surface border border-pace-border hover:bg-pace-border text-pace-muted hover:text-white text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Stream Events Box */}
      <div className="bg-pace-surface border border-pace-border rounded-xl p-5 shadow-2xl space-y-3 font-mono text-xs max-h-[600px] overflow-y-auto">
        {events.length === 0 ? (
          <div className="p-8 text-center text-pace-muted space-y-2">
            <Radio className="w-6 h-6 animate-spin mx-auto text-pace-accent" />
            <div>Listening for incoming telemetry events...</div>
          </div>
        ) : (
          events.map((ev) => (
            <div
              key={ev.id}
              className="bg-pace-bg border border-pace-border/60 p-3.5 rounded-lg flex flex-wrap items-center justify-between gap-3 animate-fade-in hover:border-pace-accent/50 transition"
            >
              <div className="flex items-center space-x-3">
                <span className="text-pace-muted">{new Date(ev.time).toLocaleTimeString()}</span>
                <span className="bg-pace-accent/10 border border-pace-accent/30 text-pace-accent px-2 py-0.5 rounded uppercase text-[10px] font-bold">
                  {ev.provider}
                </span>
                <span className="text-white font-bold">{ev.model}</span>
              </div>

              <div className="flex items-center space-x-4">
                <span>In: <strong className="text-white">{ev.input_tokens}</strong></span>
                <span>Out: <strong className="text-white">{ev.output_tokens}</strong></span>
                <span className="text-pace-success font-bold">
                  {ev.cost_usd !== null ? formatINR(ev.cost_usd, 4) : 'NULL'}
                </span>
                <span>{ev.latency_ms} ms</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  ev.status_code < 400 ? 'bg-pace-success/20 text-pace-success' : 'bg-pace-danger/20 text-pace-danger'
                }`}>
                  {ev.status_code}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
