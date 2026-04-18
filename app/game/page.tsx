"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/store/useGame";
import { useUserStore } from "@/store/useUser";
import { connectGameWS, sendWS, disconnectWS } from "@/lib/gameSocket";
import CardGrid from "@/components/CardGrid";
import TopStats from "@/components/TopStats";
import JackpotBar from "@/components/JackpotBar";

export default function GamePage() {
  const stake = useGameStore((s) => s.stake);
  const userId = useUserStore((s) => s.userId);

  const [available, setAvailable] = useState<number[]>([]);
  const [taken, setTaken] = useState<number[]>([]);
  const [jackpot, setJackpot] = useState(469.8);

  useEffect(() => {
    if (!stake) return;

    const handleMessage = (msg: any) => {
      if (msg.type === "cards") {
        setAvailable(msg.data.map((c: any) => c.card_id));
      }

      if (msg.type === "card_taken") {
        setTaken((prev) =>
          prev.includes(msg.data) ? prev : [...prev, msg.data],
        );
      }

      if (msg.type === "taken_cards") {
        setTaken(msg.data);
      }

      if (msg.type === "jackpot") {
        setJackpot(msg.data);
      }
    };

    connectGameWS(handleMessage);

    sendWS({
      type: "join",
      user_id: userId,
      stake: stake,
    });

    return () => {
      disconnectWS();
    };
  }, [stake, userId]);

  if (!stake) {
    return <p className="p-4">No game selected</p>;
  }

  return (
    <div className="p-4">
      <TopStats />
      <JackpotBar value={jackpot} />

      <CardGrid
        available={available}
        taken={taken}
        onSelect={(cardId) => {
          sendWS({
            type: "select_card",
            user_id: userId,
            card_id: cardId,
          });
        }}
      />
    </div>
  );
}
