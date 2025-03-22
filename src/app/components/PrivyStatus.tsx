"use client";

import { usePrivy } from "@privy-io/react-auth";

export default function PrivyStatus() {
  const { ready } = usePrivy();

  if (!ready) {
    return <div className="text-center p-4">Loading Privy...</div>;
  }

  return <div className="text-center p-4 text-green-600">✅ Privy is ready!</div>;
}
