"use client";
import GamePlayScreen from "@/components/GamePlayScreen";
import { useGameStore } from "@/store/useGame";
import { useEffect } from "react";

export default function Page() {
  const stake = useGameStore((s) => s.stake);
  const connect = useGameStore((s) => s.connect);

  useEffect(() => {
    if (!stake) return;

    connect(stake, true); // 🔥 REJOIN MODE
  }, [stake]);

  return <GamePlayScreen />;
}
