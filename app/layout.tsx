import type { Metadata } from 'next';
import './globals.css';
import AICoachWrapper from './components/AICoachWrapper';
import { ThemeProvider } from './components/ThemeContext';

export const metadata: Metadata = {
  title: 'RunPlan',
  description: '横浜マラソンに向けたランニング管理アプリ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen" style={{ color: 'var(--text-primary)' }}>
        <ThemeProvider>
          {children}
          <AICoachWrapper />
        </ThemeProvider>
      </body>
    </html>
  );
}