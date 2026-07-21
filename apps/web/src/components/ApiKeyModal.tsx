'use client';

import { useState } from 'react';
import { Copy, Check, ShieldAlert, Key } from 'lucide-react';

interface ApiKeyModalProps {
  apiKeyData: { name: string; key_prefix: string; raw_key: string } | null;
  onClose: () => void;
}

export function ApiKeyModal({ apiKeyData, onClose }: ApiKeyModalProps) {
  const [copied, setCopied] = useState(false);

  if (!apiKeyData) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKeyData.raw_key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-pace-surface border border-pace-border w-full max-w-lg rounded-xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center space-x-3 text-pace-warning">
          <ShieldAlert className="w-6 h-6" />
          <h3 className="font-bold text-lg text-white">Save Ingestion Key</h3>
        </div>

        <p className="text-sm text-pace-muted leading-relaxed">
          Here is your new project ingestion key. <strong className="text-white">This key will only be shown once.</strong> Store it securely in your environment variables or secret manager.
        </p>

        <div className="bg-pace-bg border border-pace-border rounded-lg p-3.5 flex items-center justify-between font-mono text-sm">
          <span className="text-pace-accent select-all overflow-x-auto whitespace-nowrap mr-3">{apiKeyData.raw_key}</span>
          <button
            onClick={handleCopy}
            className="bg-pace-border hover:bg-pace-border/80 text-white px-3 py-1.5 rounded-md flex items-center space-x-1 text-xs transition font-sans"
          >
            {copied ? <Check className="w-4 h-4 text-pace-success" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="bg-pace-warning/10 border border-pace-warning/20 p-3 rounded-lg text-xs text-pace-warning leading-normal">
          🔒 Pace stores only a cryptographic salted hash of this key. If lost, you will need to generate a new key.
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="bg-pace-accent hover:bg-pace-accentHover text-white text-sm font-semibold px-5 py-2 rounded-lg transition"
          >
            Done & Saved Key
          </button>
        </div>
      </div>
    </div>
  );
}
