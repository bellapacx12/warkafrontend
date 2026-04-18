"use client";

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 w-full bg-black border-t border-gray-700 flex justify-around p-2 text-sm">
      <span>🎮 Game</span>
      <span>🏆 Scores</span>
      <span>🕓 History</span>
      <span>💰 Wallet</span>
      <span>👤 Profile</span>
    </div>
  );
}
