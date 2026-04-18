"use client";

export default function JackpotBar({ value }: { value: number }) {
  return (
    <div className="mt-2">
      <div className="h-2 bg-gray-700 rounded">
        <div
          className="h-2 bg-yellow-400 rounded"
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">JACKPOT {value} / 1000</p>
    </div>
  );
}
