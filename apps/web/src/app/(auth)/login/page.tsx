'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await apiFetch<{ access_token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('pace_token', res.access_token);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pace-bg flex items-center justify-center p-4">
      <div className="bg-pace-surface border border-pace-border w-full max-w-md rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-pace-accent mx-auto flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-blue-500/30">
            P
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Sign in to Pace</h2>
          <p className="text-sm text-pace-muted">Self-Hosted LLM Observability & Cost Control</p>
        </div>

        {error && <div className="bg-pace-danger/10 border border-pace-danger/20 text-pace-danger text-sm p-3.5 rounded-xl text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-pace-muted mb-1 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              required
              placeholder="developer@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-pace-bg border border-pace-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-pace-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-pace-muted mb-1 uppercase tracking-wider">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-pace-bg border border-pace-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-pace-accent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pace-accent hover:bg-pace-accentHover text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-blue-500/20"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-xs text-pace-muted">
          Don't have an account?{' '}
          <Link href="/register" className="text-pace-accent hover:underline font-semibold">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
