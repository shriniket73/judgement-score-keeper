// src/app/game/[id]/page.tsx
import { Metadata } from 'next';
import GamePageClient from './GamePageClient';

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export const metadata: Metadata = {
  title: 'Game - Judgment Score Keeper',
};

export default async function GamePage({ params }: Props) {
  return <GamePageClient params={params} />;
}