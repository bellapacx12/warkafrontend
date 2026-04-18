"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/store/useGame";
import { connectGameWS, sendWS, disconnectWS } from "@/lib/gameSocket";
import CardGrid from "@/components/CardGrid";
import TopStats from "@/components/TopStats";
import JackpotBar from "@/components/JackpotBar";
import { useRouter } from "next/navigation";

export default function GamePage() {
  const stake = useGameStore((s) => s.stake);

  const [available, setAvailable] = useState<number[]>([]);
  const [taken, setTaken] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [jackpot, setJackpot] = useState(0);
  const router = useRouter();
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

  return (
    <div className="p-3 sm:p-4 max-w-md mx-auto pb-24">
      <TopStats />

      <div className="my-3">
        <JackpotBar value={jackpot} />
      </div>

      <CardGrid
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

      {/* 🔥 START GAME BUTTON (STICKY) */}
      <div className="fixed bottom-0 left-0 w-full bg-[#0b1a2b] p-3 border-t border-gray-800">
        <div className="max-w-md mx-auto">
          <button
            disabled={!selected}
            onClick={() => {
              // 🚀 trigger start (you can adjust backend later)
              router.push("/play");
            }}
            className={`w-full py-3 rounded-xl font-bold text-lg transition ${
              selected
                ? "bg-green-500 hover:bg-green-600 active:scale-95 text-white"
                : "bg-gray-600 text-gray-300 cursor-not-allowed"
            }`}
          >
            {selected ? "🚀 Start Game" : "Select a Card"}
          </button>
        </div>
      </div>
    </div>
  );
}
