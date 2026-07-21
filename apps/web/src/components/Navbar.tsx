'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { Plus, Folder, LogOut, Key } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  slug: string;
  role: string;
}

interface NavbarProps {
  selectedProjectId: string | null;
  onSelectProject: (id: string) => void;
  onOpenCreateProject: () => void;
}

export function Navbar({ selectedProjectId, onSelectProject, onOpenCreateProject }: NavbarProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    fetchProjects();
    fetchUser();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await apiFetch<Project[]>('/projects');
      setProjects(data);
      if (data.length > 0 && !selectedProjectId) {
        onSelectProject(data[0].id);
      }
    } catch {
      // fallback
    }
  };

  const fetchUser = async () => {
    try {
      const user = await apiFetch<{ email: string }>('/auth/me');
      setUserEmail(user.email);
    } catch {
      // fallback
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('pace_token');
    window.location.href = '/login';
  };

  return (
    <header className="h-16 bg-pace-surface border-b border-pace-border px-6 flex items-center justify-between">
      {/* Project Picker */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm text-pace-muted">
          <Folder className="w-4 h-4 text-pace-accent" />
          <span>Project:</span>
        </div>
        <select
          value={selectedProjectId || ''}
          onChange={(e) => onSelectProject(e.target.value)}
          className="bg-pace-bg border border-pace-border text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-pace-accent"
        >
          {projects.length === 0 && <option value="">No projects available</option>}
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.role})
            </option>
          ))}
        </select>
        <button
          onClick={onOpenCreateProject}
          className="bg-pace-border/60 hover:bg-pace-border text-white text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1 font-medium transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </button>
      </div>

      {/* User Actions */}
      <div className="flex items-center space-x-4 text-sm">
        <span className="text-pace-muted">{userEmail}</span>
        <button
          onClick={handleLogout}
          className="text-pace-muted hover:text-pace-danger transition flex items-center space-x-1"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
