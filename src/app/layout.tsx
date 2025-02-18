/* eslint-disable @typescript-eslint/no-unused-vars */
// app/layout.tsx
import { Inter, Instrument_Serif } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { NavigationProvider } from '@/components/layout/NavigationProvider';
import './globals.css';

const instrumentSerif = Instrument_Serif({ 
  subsets: ['latin'],
  weight: '400',
  variable: '--font-instrument-serif',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${instrumentSerif.variable} font-serif bg-white text-black min-h-screen flex flex-col`}>
        <NavigationProvider>
          <Header />
          {children}
          <Footer />
        </NavigationProvider>
      </body>
    </html>
  );
}