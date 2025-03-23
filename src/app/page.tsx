"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Home() {
  const { authenticated, ready } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/login");
    }
  }, [ready, authenticated, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Left Column - Copy */}
          <div className="flex flex-col justify-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Learn from hundreds of verified mentors
            </h1>
            <p className="text-muted-foreground max-w-[600px] text-lg sm:text-xl">
              Book unlimited 1:1 video calls with 750+ mentors across dozens of
              industries. Get tailored advice to solve your toughest challenges
              and accelerate your growth.
            </p>
            <div className="flex flex-col gap-4 min-[400px]:flex-row">
              <Button size="lg" className="bg-primary text-primary-foreground">
                Start Growing!
              </Button>
              <Button size="lg" variant="outline">
                How it Works
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-3 pt-8">
              <div className="flex flex-col">
                <span className="text-3xl font-bold">50,000+</span>
                <span className="text-muted-foreground">Sessions booked</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold">750+</span>
                <span className="text-muted-foreground">Vetted mentors</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold">4.8/5</span>
                <span className="text-muted-foreground">Average rating</span>
              </div>
            </div>
          </div>

          {/* Right Column - Leaderboard Card */}
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Leaderboard content will be added later */}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
