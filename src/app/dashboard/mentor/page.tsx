"use client";
import { useState } from "react";

export default function MentorDashboard() {
  const [matchCode, setMatchCode] = useState("");
  const [usdcStake, setUsdcStake] = useState("");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Mentor Dashboard</h1>

        {/* Match Code Input */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Enter Match Code:</h2>
          <input
            type="text"
            className="border p-2 rounded-md w-full"
            placeholder="Match Code"
            value={matchCode}
            onChange={(e) => setMatchCode(e.target.value)}
          />
        </div>

        {/* Stake USDC */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Stake USDC:</h2>
          <input
            type="number"
            className="border p-2 rounded-md w-full"
            placeholder="Stake Amount"
            value={usdcStake}
            onChange={(e) => setUsdcStake(e.target.value)}
          />
          <button className="mt-2 p-2 w-full bg-green-500 text-white rounded-md">Stake</button>
        </div>

        {/* Meeting Link */}
        <div className="mt-4 p-3 bg-blue-100 text-center rounded-md">
          <p>📅 Meet Link: <a href="#">https://meet.google.com/example</a></p>
        </div>
      </div>
    </main>
  );
}
