"use client";

export default function Header() {
  return (
    <div className="p-4 border-b border-gray-700">
      <h1 className="text-xl font-bold">Addis Bingo</h1>

      <div className="flex justify-between mt-2 text-sm text-gray-300">
        <span>🟢 Live</span>
        <span>🏅 Bonus: 4.00</span>
        <span>💰 Balance: 203.72</span>
      </div>
    </div>
  );
}
