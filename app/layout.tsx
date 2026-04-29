import type { Metadata } from 'next';
import './globals.css';
import AICoachWrapper from './components/AICoachWrapper';

export const metadata: Metadata = {
  title: 'RunPlan',
  description: '東京マラソンに向けたランニング管理アプリ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-[#08080F] text-[#EEEEF8] min-h-screen">
        {children}
        <AICoachWrapper />
      </body>
    </html>
  );
}