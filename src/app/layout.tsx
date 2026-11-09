import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wycliffe Mwanganda | Systems Engineer & Multi-Cloud Architect",
  description: "Systems Engineer and Multi-Cloud Architect building high-speed production systems, automated workflows, and edge platforms across Cloudflare, Render, and Vercel with zero cloud waste.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/profile.png", sizes: "192x192", type: "image/png" }
    ],
    apple: "/profile.png"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
