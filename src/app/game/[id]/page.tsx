// app/game/[id]/page.tsx
import GamePageClient from './GamePageClient';

interface GamePageProps {
  params: {
    id: string;
  };
}

export default function GamePage({ params }: GamePageProps) {
  return <GamePageClient params={params} />;
}