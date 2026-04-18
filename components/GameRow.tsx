"use client";

import { useRouter } from "next/navigation";
import JackpotBar from "./JackpotBar";
import { useGameStore } from "@/store/useGame";

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
  const setStake = useGameStore((s) => s.setStake);

  return (
    <div className="bg-[#0b1a2b] p-4 rounded-xl mb-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-lg font-bold">{stake} ETB</p>
        </div>

        <div className="text-center">
          <p className="text-yellow-400 font-bold">🏆 {win}</p>
          <p className="text-xs text-gray-400">{players} players</p>
        </div>

        <div className="text-right">
          <p className="text-xs text-blue-400">{status}</p>

          {status === "countdown" && <p className="text-sm">{countdown}s</p>}

          <button
            className="bg-green-500 px-3 py-1 rounded mt-1 hover:bg-green-600 transition"
            onClick={() => {
              setStake(stake); // ✅ save stake
              router.push("/game"); // ✅ no params
            }}
          >
            JOIN
          </button>
        </div>
      </div>

      <JackpotBar value={jackpot} />
    </div>
  );
}
