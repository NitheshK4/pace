'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Search, 
  Radio, 
  Wallet, 
  Database, 
  Code2, 
  Settings,
  ShieldCheck
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Overview', href: '/', icon: BarChart3 },
  { label: 'Project Explorer', href: '/explorer', icon: Search },
  { label: 'Live Tail', href: '/live-tail', icon: Radio },
  { label: 'Budgets & Alerts', href: '/budgets', icon: Wallet },
  { label: 'Pricing Catalog', href: '/pricing', icon: Database },
  { label: 'Quick Start', href: '/quickstart', icon: Code2 },
  { label: 'System & Security', href: '/settings/system', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-pace-surface border-r border-pace-border flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-pace-border flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-pace-accent flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
          P
        </div>
        <div>
          <h1 className="font-bold text-lg text-white tracking-wide">PACE</h1>
          <p className="text-xs text-pace-muted font-medium">LLM Observability</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-pace-accent text-white shadow-md shadow-blue-500/10'
                  : 'text-pace-muted hover:text-white hover:bg-pace-border/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Privacy Guard Notice */}
      <div className="p-4 border-t border-pace-border text-xs text-pace-muted bg-pace-bg/50">
        <div className="flex items-center space-x-2 text-pace-success mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span className="font-semibold">Zero-Content Protection</span>
        </div>
        Prompts, completions & keys are never stored.
      </div>
    </aside>
  );
}
