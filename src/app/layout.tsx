import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wycliffe Mwanganda | Full-Stack & Systems Engineer",
  description: "Systems Architect & Full-Stack Engineer building high-impact community platforms, edge infrastructure, and autonomous AI systems.",
  icons: {
    icon: "/ReportGenICO.png"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
