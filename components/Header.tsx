"use client";

import { useGameStore } from "@/store/useGame";

export default function Header() {
  const balance = useGameStore((s) => s.balance);

  return (
    <div className="p-4 border-b border-gray-700">
      <h1 className="text-xl font-bold">Addis Bingo</h1>

      <div className="flex justify-between mt-2 text-sm text-gray-300">
        <span>🟢 Live</span>
        <span>🏅 Bonus: 4.00</span>

        {/* ✅ LIVE BALANCE */}
        <span>💰 Balance: {balance.toFixed(2)}</span>
      </div>
    </div>
  );
}
