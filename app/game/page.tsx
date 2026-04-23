"use client";

import { useEffect } from "react";
import { useGameStore } from "@/store/useGame"; // ✅ ONLY THIS STORE
import CardGrid from "@/components/CardGrid";
import TopStats from "@/components/TopStats";
import JackpotBar from "@/components/JackpotBar";
import { useRouter } from "next/navigation";

export default function GamePage() {
  // ✅ ALL FROM SAME STORE
  const stake = useGameStore((s) => s.stake);
  const available = useGameStore((s) => s.available);
  const taken = useGameStore((s) => s.taken);
  const selected = useGameStore((s) => s.selected);
  const jackpot = useGameStore((s) => s.jackpot);
  const countdown = useGameStore((s) => s.countdown);
  const connect = useGameStore((s) => s.connect); // ✅ FIXED
  const selectCard = useGameStore((s) => s.selectCard);

  const router = useRouter();

  // 🔌 CONNECT ON LOAD
  useEffect(() => {
    if (!stake) return;

    connect(stake);
  }, [stake]);

  if (!stake) {
    return <p className="p-4 text-center text-gray-400">No game selected</p>;
  }

  return (
    <div className="p-3 sm:p-4 max-w-md mx-auto">
      <TopStats />

      <div className="my-3">
        <JackpotBar value={jackpot} />
      </div>

      {/* 🔥 COUNTDOWN UI */}
      {countdown > 0 && (
        <div className="text-center text-2xl font-bold text-yellow-400 mb-3">
          Game starting in {countdown}...
        </div>
      )}

      <CardGrid
        available={available}
        taken={taken}
        selected={selected}
        onSelect={(cardId) => {
          if (taken.includes(cardId)) return;
          if (selected) return;

          selectCard(cardId);
        }}
      />

      {/* ENTER GAME */}
      {selected && (
        <div className="fixed bottom-0 left-0 w-full p-3 bg-black border-t border-gray-800">
          <button
            onClick={() => router.push("/play")}
            className="w-full py-3 rounded-xl bg-green-500 text-white font-bold active:scale-95"
          >
            Enter Game
          </button>
        </div>
      )}
    </div>
  );
}
