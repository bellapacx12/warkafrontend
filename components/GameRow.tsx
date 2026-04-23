"use client";

import { useRouter } from "next/navigation";
import JackpotBar from "./JackpotBar";
import { useGameStores } from "@/store/useGames";

interface Props {
  stake: number;
  players: number;
  win: number;
  status: string;
  countdown?: number;
  jackpot: number;
}

export default function GameRow({
  stake,
  players,
  win,
  status,
  countdown,
  jackpot,
}: Props) {
  const router = useRouter();
  const setStake = useGameStores((s) => s.setStake);

  return (
    <div className="bg-[#0b1a2b] p-4 rounded-2xl mb-4 shadow-md">
      {/* 🔥 Top Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* 💰 Stake */}
        <div>
          <p className="text-xl font-bold">{stake} ETB</p>
        </div>

        {/* 🏆 Win + players */}
        <div className="flex justify-between sm:block text-center">
          <div>
            <p className="text-yellow-400 font-bold text-lg">🏆 {win}</p>
            <p className="text-xs text-gray-400">{players} players</p>
          </div>
        </div>

        {/* 🎮 Status + Button */}
        <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
          <div className="text-right">
            <p className="text-xs text-blue-400">{status}</p>

            {status === "countdown" && (
              <p className="text-sm font-semibold">{countdown}s</p>
            )}
          </div>

          <button
            className="bg-green-500 w-full sm:w-auto px-4 py-2 rounded-lg font-semibold text-sm hover:bg-green-600 active:scale-95 transition"
            onClick={() => {
              setStake(stake);
              router.push("/game");
            }}
          >
            JOIN
          </button>
        </div>
      </div>

      {/* 🎰 Jackpot */}
      <div className="mt-3">
        <JackpotBar value={jackpot} />
      </div>
    </div>
  );
}
