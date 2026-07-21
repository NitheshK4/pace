'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { CreateProjectModal } from '@/components/CreateProjectModal';
import { ApiKeyModal } from '@/components/ApiKeyModal';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newApiKeyData, setNewApiKeyData] = useState<any>(null);

  const handleProjectCreated = (project: any, initialKey: any) => {
    setIsCreateOpen(false);
    setSelectedProjectId(project.id);
    if (initialKey && initialKey.raw_key) {
      setNewApiKeyData(initialKey);
    }
  };

  return (
    <div className="flex min-h-screen bg-pace-bg text-pace-text">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          selectedProjectId={selectedProjectId}
          onSelectProject={(id) => setSelectedProjectId(id)}
          onOpenCreateProject={() => setIsCreateOpen(true)}
        />
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Inject selectedProjectId to child pages via React cloneElement or context */}
          {typeof children === 'object' && children !== null
            ? (children as any)
            : children}
        </main>
      </div>

      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleProjectCreated}
      />

      <ApiKeyModal
        apiKeyData={newApiKeyData}
        onClose={() => setNewApiKeyData(null)}
      />
    </div>
  );
}
