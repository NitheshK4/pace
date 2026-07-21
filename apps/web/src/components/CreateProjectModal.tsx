'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { X, Sparkles } from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (project: any, initialKey: any) => void;
}

export function CreateProjectModal({ isOpen, onClose, onSuccess }: CreateProjectModalProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await apiFetch<{ project: any; initial_api_key: any }>('/projects', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });
      setName('');
      onSuccess(res.project, res.initial_api_key);
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-pace-surface border border-pace-border w-full max-w-md rounded-xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-pace-accent" />
            <h3 className="font-bold text-lg text-white">Create New Project</h3>
          </div>
          <button onClick={onClose} className="text-pace-muted hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && <div className="text-sm text-pace-danger bg-pace-danger/10 p-3 rounded-lg border border-pace-danger/20">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-pace-muted mb-1 uppercase tracking-wider">Project Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Customer Support AI Agent"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-pace-bg border border-pace-border rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-pace-accent"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-pace-muted hover:text-white font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-pace-accent hover:bg-pace-accentHover text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
