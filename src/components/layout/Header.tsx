// components/layout/Header.tsx
import Image from 'next/image';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 border-b bg-white z-50">
      <div className="container mx-auto px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/judgement-logo.png"
            alt="Judgment Scorekeeper Logo"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <h1 className="text-2xl font-serif">Judgement Scorekeeper</h1>
        </Link>
      </div>
    </header>
  );
}