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
  const winner = useGameStore((s) => s.winner);
  const isConnected = useGameStore((s) => s.isConnected);

  useEffect(() => {
    if (!stake) return;

    connect(stake, true); // 🔥 always call once

    return () => {
      disconnect();
    };
  }, [stake]);

  const isCalled = (num: number | string) =>
    typeof num === "number" && calledNumbers.includes(num);

  return (
    <div className="p-2 max-w-5xl mx-auto text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-2">
        <p className="font-bold text-lg">🎯 Addis Bingo</p>
        <p className="text-sm text-gray-400">Stake: {stake} ETB</p>
      </div>

      <div className="flex gap-2">
        {/* ================= LEFT PANEL ================= */}
        <div className="w-1/2 bg-[#0b1a2b] p-2 rounded-xl">
          {/* BINGO HEADER */}
          <div className="grid grid-cols-5 mb-1 text-center font-bold">
            {["B", "I", "N", "G", "O"].map((l) => (
              <div key={l} className="text-yellow-400">
                {l}
              </div>
            ))}
          </div>

          {/* 1–75 GRID */}
          <div className="grid grid-cols-5 gap-1">
            {Array.from({ length: 75 }, (_, i) => i + 1).map((n) => (
              <div
                key={n}
                className={`text-xs text-center p-1 rounded ${
                  calledNumbers.includes(n)
                    ? "bg-green-500 text-white"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                {n}
              </div>
            ))}
          </div>
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="w-1/2 flex flex-col gap-2">
          {/* STATS */}
          <div className="bg-[#0b1a2b] p-2 rounded-xl">
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-gray-400 text-xs">Count Down</p>
                <p className="font-bold">{countdown}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Current Call</p>
                <p className="font-bold text-yellow-400">
                  {currentNumber ?? "-"}
                </p>
              </div>
            </div>
          </div>

          {/* PLAYER CARD */}
          <div className="bg-[#0b1a2b] p-2 rounded-xl">
            {/* HEADER */}
            <div className="grid grid-cols-5 text-center font-bold mb-1">
              {["B", "I", "N", "G", "O"].map((l, i) => (
                <div
                  key={i}
                  className={`${
                    [
                      "text-yellow-400",
                      "text-green-400",
                      "text-blue-400",
                      "text-red-400",
                      "text-purple-400",
                    ][i]
                  }`}
                >
                  {l}
                </div>
              ))}
            </div>

            {!card ? (
              <p className="text-center text-gray-400 py-6">
                Waiting for card...
              </p>
            ) : (
              <div className="grid grid-cols-5 gap-1">
                {card.flat().map((cell, i) => {
                  const called = isCalled(cell);

                  return (
                    <div
                      key={i}
                      className={`aspect-square flex items-center justify-center rounded text-sm font-bold ${
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
          </div>
        </div>
      </div>

      {/* ================= BINGO BUTTON ================= */}
      <button
        onClick={sendBingo}
        className="w-full mt-3 bg-orange-500 py-3 rounded-xl font-bold text-lg active:scale-95"
      >
        BINGO!
      </button>

      {/* ACTIONS */}
      <div className="flex gap-2 mt-2">
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
      {winner && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#0b1a2b] p-4 rounded-xl w-[90%] max-w-sm text-center">
            {/* TITLE */}
            <h2 className="text-xl font-bold text-yellow-400 mb-2">
              🎉 WINNER!
            </h2>

            {/* NAME */}
            <p className="text-lg font-bold mb-3">{winner.name}</p>

            {/* CARD */}
            <div className="grid grid-cols-5 gap-1 mb-3">
              {winner.card.flat().map((cell: any, i: number) => (
                <div
                  key={i}
                  className={`aspect-square flex items-center justify-center rounded text-xs font-bold ${
                    cell === "FREE" ? "bg-purple-500" : "bg-green-500"
                  }`}
                >
                  {cell === "FREE" ? "*" : cell}
                </div>
              ))}
            </div>

            {/* CLOSE BUTTON */}
            <button
              onClick={() => useGameStore.setState({ winner: null })}
              className="bg-blue-500 px-4 py-2 rounded w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
