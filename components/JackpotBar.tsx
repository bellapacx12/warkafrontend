"use client";

export default function JackpotBar({ value }: { value: number }) {
  const percent = Math.min((value / 1000) * 100, 100);

  return (
    <div className="mt-3">
      {/* 🔥 Label Row */}
      <div className="flex justify-between items-center mb-1">
        <p className="text-xs text-gray-400">🎰 JACKPOT</p>
        <p className="text-xs font-semibold text-yellow-400">{value} / 1000</p>
      </div>

      {/* 🔥 Bar */}
      <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* 🔥 Optional hint */}
      <p className="text-[10px] text-gray-500 mt-1">
        Fill the bar to win the jackpot
      </p>
    </div>
  );
}
