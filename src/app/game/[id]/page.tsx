// app/game/[id]/page.tsx
import { use } from 'react';
import GamePageClient from './GamePageClient';

export default function GamePage({ params }: { params: { id: string } }) {
  // Unwrap the params using React.use()
  const unwrappedParams = use(Promise.resolve(params));
  
  return <GamePageClient params={unwrappedParams} />;
}