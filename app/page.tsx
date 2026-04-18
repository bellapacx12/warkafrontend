"use client";

import Header from "@/components/Header";
import GameRow from "@/components/GameRow";
import BottomNav from "@/components/BottomNav";
import { useLobby } from "@/lib/useLobby";

export default function Home() {
  const games = useLobby(); // ✅ realtime + reconnect built-in

  return (
    <div className="pb-16">
      <Header />

      <div className="p-4">
        <h2 className="text-lg font-bold mb-2">🎯 BINGO GAMES</h2>

        {games.length === 0 ? (
          <p className="text-gray-400">Loading games...</p>
        ) : (
          games.map((g: any) => <GameRow key={g.stake} {...g} />)
        )}
      </div>

      <BottomNav />
    </div>
  );
}
