import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from './components/ThemeContext';

export const metadata: Metadata = {
  title: 'RunPlan',
  description: '横浜マラソンに向けたランニング管理アプリ',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
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
        </ThemeProvider>
      </body>
    </html>
  );
}