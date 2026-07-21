'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { Database, Plus, ExternalLink, RefreshCw, X } from 'lucide-react';

interface PricingRate {
  id: string;
  provider: string;
  model: string;
  input_cost_per_1k: number;
  output_cost_per_1k: number;
  cache_read_cost_per_1k: number;
  reasoning_cost_per_1k: number;
  currency: string;
  source_url: string;
  effective_from: string;
}

export default function PricingPage() {
  const [rates, setRates] = useState<PricingRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form state
  const [provider, setProvider] = useState('openai');
  const [model, setModel] = useState('');
  const [inputRate, setInputRate] = useState('0.0025');
  const [outputRate, setOutputRate] = useState('0.0100');

  useEffect(() => {
    loadRates();
  }, []);

  const loadRates = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<PricingRate[]>('/pricing');
      setRates(data);
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleAddRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!model.trim()) return;

    try {
      await apiFetch('/pricing', {
        method: 'POST',
        body: JSON.stringify({
          provider,
          model,
          input_cost_per_1k: parseFloat(inputRate),
          output_cost_per_1k: parseFloat(outputRate),
        }),
      });
      setIsAddOpen(false);
      setModel('');
      loadRates();
    } catch (err: any) {
      alert(err.message || 'Failed to add pricing rate');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Database className="w-6 h-6 text-pace-accent" />
            <span>Pricing Registry Catalog</span>
          </h2>
          <p className="text-sm text-pace-muted mt-0.5">Auditable versioned cost calculations for LLM provider models.</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-pace-accent hover:bg-pace-accentHover text-white text-sm font-semibold px-4 py-2 rounded-xl flex items-center space-x-2 transition shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Rate</span>
        </button>
      </div>

      {/* Pricing Table */}
      <div className="bg-pace-surface border border-pace-border rounded-xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 text-center text-pace-muted flex items-center justify-center space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin text-pace-accent" />
            <span>Loading pricing rates...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-pace-text">
              <thead className="bg-pace-bg/60 border-b border-pace-border text-pace-muted uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Provider</th>
                  <th className="py-3.5 px-4">Model</th>
                  <th className="py-3.5 px-4">Input / 1k Tokens</th>
                  <th className="py-3.5 px-4">Output / 1k Tokens</th>
                  <th className="py-3.5 px-4">Cache Read / 1k</th>
                  <th className="py-3.5 px-4">Reasoning / 1k</th>
                  <th className="py-3.5 px-4">Effective From</th>
                  <th className="py-3.5 px-4">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pace-border/50">
                {rates.map((r) => (
                  <tr key={r.id} className="hover:bg-pace-border/30 transition">
                    <td className="py-3.5 px-4 font-bold text-white uppercase">{r.provider}</td>
                    <td className="py-3.5 px-4 font-mono text-pace-accent font-semibold">{r.model}</td>
                    <td className="py-3.5 px-4 font-mono">${r.input_cost_per_1k.toFixed(6)}</td>
                    <td className="py-3.5 px-4 font-mono">${r.output_cost_per_1k.toFixed(6)}</td>
                    <td className="py-3.5 px-4 font-mono">${r.cache_read_cost_per_1k.toFixed(6)}</td>
                    <td className="py-3.5 px-4 font-mono">${r.reasoning_cost_per_1k.toFixed(6)}</td>
                    <td className="py-3.5 px-4 text-pace-muted">{new Date(r.effective_from).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4">
                      {r.source_url ? (
                        <a href={r.source_url} target="_blank" rel="noreferrer" className="text-pace-accent hover:underline flex items-center space-x-1">
                          <span>Official</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-pace-muted">Custom</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Rate Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-pace-surface border border-pace-border w-full max-w-md rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-white">Add Custom Pricing Rate</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-pace-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRate} className="space-y-4 text-xs">
              <div>
                <label className="block text-pace-muted mb-1 font-semibold">Provider</label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full bg-pace-bg border border-pace-border rounded-lg p-2.5 text-white focus:outline-none focus:border-pace-accent"
                >
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="azure">Azure</option>
                  <option value="custom">Custom Provider</option>
                </select>
              </div>

              <div>
                <label className="block text-pace-muted mb-1 font-semibold">Model Identifier</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. gpt-4o-custom"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-pace-bg border border-pace-border rounded-lg p-2.5 text-white focus:outline-none focus:border-pace-accent font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-pace-muted mb-1 font-semibold">Input / 1k Tokens ($)</label>
                  <input
                    type="number"
                    step="0.000001"
                    required
                    value={inputRate}
                    onChange={(e) => setInputRate(e.target.value)}
                    className="w-full bg-pace-bg border border-pace-border rounded-lg p-2.5 text-white focus:outline-none focus:border-pace-accent font-mono"
                  />
                </div>
                <div>
                  <label className="block text-pace-muted mb-1 font-semibold">Output / 1k Tokens ($)</label>
                  <input
                    type="number"
                    step="0.000001"
                    required
                    value={outputRate}
                    onChange={(e) => setOutputRate(e.target.value)}
                    className="w-full bg-pace-bg border border-pace-border rounded-lg p-2.5 text-white focus:outline-none focus:border-pace-accent font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 text-pace-muted hover:text-white">Cancel</button>
                <button type="submit" className="bg-pace-accent hover:bg-pace-accentHover text-white font-semibold px-4 py-2 rounded-lg">Save Rate</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
