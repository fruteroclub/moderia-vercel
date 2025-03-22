import { ReactNode } from "react";
import "./globals.css";
import Providers from "./providers/providers";


export const metadata = {
  title: "ModerIA Dashboard",
  description: "AI-driven mentor-student matching platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="main-window">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
