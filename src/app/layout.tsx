// src/app/layout.tsx
import { Instrument_Serif } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { NavigationProvider } from '@/components/layout/NavigationProvider';
import { Analytics } from '@vercel/analytics/react';
import {PosthogScript} from "@/components/PosthogScript"
import './globals.css';

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument-serif',
});

export const metadata = {
  title: 'Judgment Scorekeeper',
  description: 'A score keeping app for the card game Judgment',
  icons: {
    icon: '/judgement-logo.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={instrumentSerif.variable}>
      <head>
        <PosthogScript/>
      </head>
      <body className="bg-white text-black min-h-screen flex flex-col font-serif">
        <NavigationProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 overflow-auto container mx-auto p-4">
              {children}
            </main>
            <Footer />
          </div>
        </NavigationProvider>
        <Analytics />
      </body>
    </html>
  );
}