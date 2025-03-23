import { ReactNode } from "react";
import "./globals.css";
import Providers from "./providers/providers";
import { Navbar } from "./components/layout/navbar";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "ModerIA Dashboard",
  description: "AI-driven mentor-student matching platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="min-h-screen bg-background antialiased">
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="px-4 md:px-8 lg:px-12 xl:px-16 flex-1 flex flex-col items-center justify-center">
              {children}
            </main>
          </div>
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
