import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InfoPulse — AI 資訊精華",
  description: "AI 驅動的科技與 AI 領域最新資訊聚合，從 RSS、Reddit、YouTube 精選重點",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-TW" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
