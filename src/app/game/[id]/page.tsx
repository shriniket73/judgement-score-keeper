// src/app/game/[id]/page.tsx
import { Metadata } from 'next';
import GamePageClient from './GamePageClient';

interface PageProps {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
}

export const metadata: Metadata = {
  title: 'Game - Judgment Score Keeper',
};

export default function GamePage(props: PageProps) {
  return <GamePageClient params={props.params} />;
}