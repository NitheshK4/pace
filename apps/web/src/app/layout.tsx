import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pace — LLM Observability Platform',
  description: 'Self-hosted LLM cost tracking, real-time analytics, and budget alerts',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
