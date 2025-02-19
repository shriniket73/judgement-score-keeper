// app/layout.tsx
import { Instrument_Serif } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { NavigationProvider } from '@/components/layout/NavigationProvider';
import './globals.css';

const instrumentSerif = Instrument_Serif({ 
  subsets: ['latin'],
  weight: '400',
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
    <html lang="en">
      <head>
        <link rel="icon" href="/judgement-logo.ico" />
      </head>
      <body className={`${instrumentSerif.variable} font-serif bg-white text-black min-h-screen flex flex-col`}>
        <NavigationProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 overflow-auto container mx-auto p-4">
              {children}
            </main>
            <Footer />
          </div>
        </NavigationProvider>
      </body>
    </html>
  );
}