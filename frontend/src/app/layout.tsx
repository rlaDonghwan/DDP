import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ReactQueryProvider } from "@/lib/react-query-provider";
import "./globals.css";

// Pretendard 폰트를 위한 Inter 폰트 사용 (한국어 지원)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-pretendard",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={inter.variable}>
      <body className="flex flex-col min-h-screen font-Pretendard bg-gradient-to-br from-blue-50 to-indigo-100">
        <ReactQueryProvider>
          {children}
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
