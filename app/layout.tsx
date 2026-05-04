import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "사계리 농장",
    template: "%s · 사계리 농장",
  },
  description:
    "사계리 농장 — 센서·관수·환경을 모바일 우선 PWA로 모니터링합니다.",
  applicationName: "사계리 농장",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "사계리 농장",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#1a2230",
  width: "device-width",
  initialScale: 1,
};

/** Dark-only UI — keep class in sync before paint (no light theme). */
const themeInitScript = `(function(){try{document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark" suppressHydrationWarning>
      <body className={`${geistMono.variable} min-h-dvh bg-background font-sans antialiased`}>
        <Script
          id="smart-farm-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        {children}
      </body>
    </html>
  );
}
