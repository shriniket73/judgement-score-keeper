// app/page.tsx

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-4xl text-center">Judgement Scorekeeper</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <p className="text-center text-lg mb-6">
            Keep track of your Judgement card game scores with ease.
          </p>
          <Link href="/game/setup">
            <Button size="lg">
              Start New Game
            </Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}