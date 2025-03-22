"use client";
import { useState } from "react";

export default function StudentDashboard() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [usdcAmount, setUsdcAmount] = useState("");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>

        {/* Select Agent */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Select an Agent:</h2>
          <div className="flex space-x-2 mt-2">
            {["Agent 1", "Agent 2", "Agent 3"].map((agent) => (
              <button
                key={agent}
                className={`p-2 rounded-md ${selectedAgent === agent ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                onClick={() => setSelectedAgent(agent)}
              >
                {agent}
              </button>
            ))}
          </div>
        </div>

        {/* Deposit USDC */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Deposit USDC:</h2>
          <input
            type="number"
            className="border p-2 rounded-md w-full"
            placeholder="Amount"
            value={usdcAmount}
            onChange={(e) => setUsdcAmount(e.target.value)}
          />
          <button className="mt-2 p-2 w-full bg-green-500 text-white rounded-md">Deposit</button>
        </div>

        {/* Match Code */}
        <div className="mt-4 p-3 bg-yellow-100 text-center rounded-md">
          <p>🔑 Match Code: 1234ABCD</p>
        </div>
      </div>
    </main>
  );
}
