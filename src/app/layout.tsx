import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#07070a",
};

export const metadata: Metadata = {
  title: "InvestorIQ — AI Investment Intelligence Platform",
  description: "Research any company using autonomous AI analysts. Get institutional-grade investment recommendations powered by a multi-agent AI system.",
  keywords: ["AI", "investment", "research", "stock analysis", "financial intelligence", "multi-agent", "Gemini"],
  openGraph: {
    title: "InvestorIQ — AI Investment Intelligence Platform",
    description: "Autonomous AI analysts deliver institutional-grade investment recommendations in seconds.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "InvestorIQ — AI Investment Intelligence Platform",
    description: "Autonomous AI analysts deliver institutional-grade investment recommendations in seconds.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#07070a] text-zinc-100`}>
        {children}
      </body>
    </html>
  );
}
