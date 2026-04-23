"use client";

import { useEffect } from "react";
import { useGameStore } from "@/store/useGame";

export default function GamePlayScreen() {
  const calledNumbers = useGameStore((s) => s.calledNumbers);
  const currentNumber = useGameStore((s) => s.currentNumber);
  const countdown = useGameStore((s) => s.countdown);
  const card = useGameStore((s) => s.card);
  const stake = useGameStore((s) => s.stake);
  const connect = useGameStore((s) => s.connect);
  const disconnect = useGameStore((s) => s.disconnect);
  const sendBingo = useGameStore((s) => s.sendBingo);
  const isConnected = useGameStore((s) => s.isConnected);

  // 🔌 CONNECT ONLY IF NOT CONNECTED
  useEffect(() => {
    if (!stake) return;

    if (!isConnected) {
      connect(stake); // ✅ USE REAL STAKE
    }

    return () => {
      disconnect();
    };
  }, [stake, isConnected, connect, disconnect]);

  const isCalled = (num: number | string) =>
    typeof num === "number" && calledNumbers.includes(num);

  return (
    <div className="p-3 max-w-md mx-auto text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <p className="font-bold text-lg">🎯 Bingo Room</p>
        <p className="text-sm text-gray-400">Stake: {stake ?? "-"} ETB</p>
      </div>

      {/* TOP STATS */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-gray-800 p-2 rounded">
          <p className="text-xs text-gray-400">Countdown</p>
          <p className="font-bold">{countdown}s</p>
        </div>

        <div className="bg-gray-800 p-2 rounded">
          <p className="text-xs text-gray-400">Current Call</p>
          <p className="font-bold text-yellow-400">{currentNumber ?? "-"}</p>
        </div>
      </div>

      {/* CALLED NUMBERS */}
      <div className="mb-3">
        <p className="text-sm text-gray-400 mb-1">Called Numbers</p>
        <div className="grid grid-cols-10 gap-1">
          {Array.from({ length: 75 }, (_, i) => i + 1).map((n) => (
            <div
              key={n}
              className={`text-xs text-center p-1 rounded ${
                calledNumbers.includes(n)
                  ? "bg-green-500 text-white"
                  : "bg-gray-800 text-gray-500"
              }`}
            >
              {n}
            </div>
          ))}
        </div>
      </div>

      {/* PLAYER CARD */}
      <div className="bg-gray-900 p-3 rounded-xl mb-4">
        {!card ? (
          <p className="text-center text-gray-400">Waiting for card...</p>
        ) : (
          <div className="grid grid-cols-5 gap-2">
            {card.flat().map((cell, i) => {
              const called = isCalled(cell);

              return (
                <div
                  key={i}
                  className={`aspect-square flex items-center justify-center rounded-lg text-sm font-bold ${
                    cell === "FREE"
                      ? "bg-purple-500"
                      : called
                        ? "bg-green-500"
                        : "bg-gray-800"
                  }`}
                >
                  {cell === "FREE" ? "*" : cell}
                </div>
              );
            })}
          </div>
        )}

        <p className="text-xs text-gray-400 text-center mt-2">Your Card</p>
      </div>

      {/* BINGO BUTTON */}
      <button
        onClick={sendBingo}
        className="w-full bg-orange-500 py-3 rounded-xl font-bold text-lg mb-3 active:scale-95"
      >
        BINGO!
      </button>

      {/* ACTION BUTTONS */}
      <div className="flex gap-2">
        <button
          onClick={() => window.location.reload()}
          className="flex-1 bg-blue-500 py-2 rounded"
        >
          Refresh
        </button>

        <button onClick={disconnect} className="flex-1 bg-red-500 py-2 rounded">
          Leave
        </button>
      </div>
    </div>
  );
}
