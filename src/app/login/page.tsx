"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { ready, authenticated, login, logout } = usePrivy();
  const router = useRouter();

  // ✅ Redirect to main page if already logged in
  useEffect(() => {
    if (ready && authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  // ✅ Ensure `ready` is true before showing buttons
  if (!ready) {
    return <div className="flex min-h-screen items-center justify-center text-lg">Loading Privy...</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to ModerIA</h1>
        <p className="mb-4">Log in to access the platform</p>

        {!authenticated ? (
          <button
            onClick={login}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Log in with Privy
          </button>
        ) : (
          <>
            <p className="text-green-600 mb-2">✅ Logged in successfully! Redirecting...</p>
            <button
              onClick={logout}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Log Out
            </button>
          </>
        )}
      </div>
    </div>
  );
}