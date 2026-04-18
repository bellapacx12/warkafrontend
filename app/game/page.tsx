"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/store/useGame";
import { connectGameWS, sendWS, disconnectWS } from "@/lib/gameSocket";
import CardGrid from "@/components/CardGrid";
import TopStats from "@/components/TopStats";
import JackpotBar from "@/components/JackpotBar";

export default function GamePage() {
  const stake = useGameStore((s) => s.stake);

  const [available, setAvailable] = useState<number[]>([]);
  const [taken, setTaken] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [jackpot, setJackpot] = useState(0);

  useEffect(() => {
    if (!stake) return;

    setAvailable([]);
    setTaken([]);
    setSelected(null);

    const handleMessage = (msg: any) => {
      console.log("📩 WS:", msg);

      switch (msg.type) {
        case "cards":
          setAvailable(msg.data.map((c: any) => c.card_id));
          break;

        case "taken_cards":
          setTaken(msg.data);
          break;

        case "card_taken":
          setTaken((prev) =>
            prev.includes(msg.data) ? prev : [...prev, msg.data],
          );
          break;

        case "card_selected":
          setSelected(msg.data.card_id);
          break;

        case "jackpot":
          setJackpot(msg.data);
          break;
      }
    };

    connectGameWS(handleMessage, () => {
      sendWS({
        type: "join",
        stake: stake,
      });
    });

    return () => disconnectWS();
  }, [stake]);

  if (!stake) {
    return <p className="p-4 text-center text-gray-400">No game selected</p>;
  }

  // ✅ SHOW ALL CARDS (not only available)
  const visibleCards = Array.from({ length: 100 }, (_, i) => i + 1);

  return (
    <div className="p-3 sm:p-4 max-w-md mx-auto">
      <TopStats />

      <div className="my-3">
        <JackpotBar value={jackpot} />
      </div>

      <CardGrid
        // ✅ pass all cards
        available={available}
        taken={taken}
        selected={selected}
        onSelect={(cardId) => {
          if (taken.includes(cardId)) return;
          if (selected) return;

          sendWS({
            type: "select_card",
            card_id: cardId,
          });
        }}
      />
    </div>
  );
}
