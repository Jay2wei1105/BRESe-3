import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const syne = Syne({
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BERS2 Assessment | Delta Energy",
  description: "Advanced energy assessment tool utilizing sophisticated models to diagnose building efficiency.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${plusJakartaSans.variable} ${syne.variable} antialiased font-sans flex flex-col min-h-screen bg-background text-foreground tracking-tight`}
      >
        <Navbar />
        <main className="flex-1 pt-24 pb-12 flex flex-col relative z-0">
          {children}
        </main>
      </body>
    </html>
  );
}
