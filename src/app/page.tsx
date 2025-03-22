"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const { authenticated, ready } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/login");
    }
  }, [ready, authenticated, router]);

  if (!ready) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="main-window">
      <div className="center-window">
        <h1>ModerIA</h1>
        <p>AI-driven mentor-student matching platform</p>
      </div>

      <div className="center-window">
        <h2>Who are you?</h2>
        <Link href="/dashboard/student">
          <button className="dashboard-button">I'm a Student</button>
        </Link>

        <Link href="/dashboard/mentor">
          <button className="dashboard-button">I'm a Mentor</button>
        </Link>

        <Link href="/dashboard/agent">
          <button className="dashboard-button">See Agent Metrics</button>
        </Link>

      </div>
    </div>
  );
}
