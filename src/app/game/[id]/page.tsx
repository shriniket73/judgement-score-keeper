// src/app/game/[id]/page.tsx
import { Metadata } from 'next';
import GamePageClient from './GamePageClient';

interface PageProps {
  params: {
    id: string;
  };
}

export const metadata: Metadata = {
  title: 'Game - Judgment Score Keeper',
};

export default function GamePage({ params }: PageProps) {
  return <GamePageClient params={params} />;
}