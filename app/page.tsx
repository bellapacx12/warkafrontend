"use client";

import { useEffect } from "react";
import Header from "@/components/Header";
import GameRow from "@/components/GameRow";
import BottomNav from "@/components/BottomNav";
import { useLobby } from "@/lib/useLobby";
import { useAuthStore } from "@/store/useAuthStore";

export default function Home() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isLoaded = useAuthStore((s) => s.isLoaded);

  const games = useLobby(token); // 🔥 pass token

  useEffect(() => {
    if (isLoaded && !user) {
      window.location.href = "https://t.me/warkabingo1_bot";
    }
  }, [isLoaded, user]);

  if (!isLoaded) {
    return <div className="p-4">Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="pb-16">
      <Header />

      <div className="p-4">
        <h2 className="text-lg font-bold mb-2">
          🎯 BINGO GAMES (Hi {user.name})
        </h2>

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
