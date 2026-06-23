import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "InvestorIQ — AI Investment Intelligence Platform",
  description: "Research any company using autonomous AI analysts. Get institutional-grade investment recommendations powered by a multi-agent AI system.",
  keywords: ["AI", "investment", "research", "stock analysis", "financial intelligence"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#09090b] text-zinc-100`}>
        {children}
      </body>
    </html>
  );
}
