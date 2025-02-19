/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/game/[id]/round/page.tsx
import { Metadata } from 'next';
import { RoundInfo } from '@/components/game/RoundInfo';

export const metadata: Metadata = {
  title: 'Round - Judgment Score Keeper',
};

interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function RoundPage({ params }: PageProps) {
  return <RoundInfo />;
}