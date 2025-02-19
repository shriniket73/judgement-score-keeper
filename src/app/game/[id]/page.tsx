/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/game/[id]/page.tsx
import GamePageClient from './GamePageClient';

type Props = {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function GamePage({ params, searchParams }: Props) {
  return <GamePageClient params={params} />;
}