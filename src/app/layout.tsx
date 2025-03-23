import { ReactNode } from "react";
import "./globals.css";
import Providers from "./providers/providers";
import { Navbar } from "./components/layout/navbar";

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
            <div className="flex-1">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
