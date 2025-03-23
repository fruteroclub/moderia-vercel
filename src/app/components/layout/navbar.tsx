"use client";

import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import AuthButton from "@/components/auth/authButton";

const navItems = [
  {
    name: "Home",
    link: "/dashboard",
  },
  {
    name: "Student",
    link: "/dashboard/student",
  },
  {
    name: "Mentor",
    link: "/dashboard/mentor",
  },
  {
    name: "Agent",
    link: "/dashboard/agent",
  },
];

export function Navbar() {
  return (
    <div className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <DesktopNav navItems={navItems} />
      <MobileNav navItems={navItems} />
    </div>
  );
}

const DesktopNav = ({
  navItems,
}: {
  navItems: Array<{ name: string; link: string }>;
}) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "hidden lg:flex flex-row items-center justify-between py-2 px-4 max-w-7xl mx-auto relative z-[60] w-full"
      )}
    >
      <Logo />
      <div className="lg:flex flex-row flex-1 hidden items-center justify-center space-x-2 lg:space-x-2">
        {navItems.map((navItem, idx) => (
          <Link
            onMouseEnter={() => setHovered(idx)}
            className="text-foreground/60 hover:text-foreground relative px-4 py-2"
            key={`link-${idx}`}
            href={navItem.link}
          >
            {hovered === idx && (
              <motion.div
                layoutId="hovered"
                className="absolute inset-0 bg-muted rounded-full"
              />
            )}
            <span className="relative z-20">{navItem.name}</span>
          </Link>
        ))}
      </div>
      <div className="hidden md:block">
        <AuthButton />
      </div>
    </motion.div>
  );
};

const MobileNav = ({
  navItems,
}: {
  navItems: Array<{ name: string; link: string }>;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      animate={{
        borderRadius: open ? "4px" : "2rem",
      }}
      className="flex lg:hidden relative flex-col w-full justify-between items-center bg-background px-4 py-2"
    >
      <div className="flex flex-row justify-between items-center w-full">
        <Logo />
        <button onClick={() => setOpen(!open)} className="text-foreground">
          {open ? <IconX /> : <IconMenu2 />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex absolute top-16 bg-background border rounded-lg inset-x-4 z-20 flex-col items-start justify-start gap-4 p-6"
          >
            {navItems.map((navItem, idx) => (
              <Link
                key={`link-${idx}`}
                href={navItem.link}
                className="text-foreground/60 hover:text-foreground w-full"
                onClick={() => setOpen(false)}
              >
                {navItem.name}
              </Link>
            ))}
            <AuthButton setIsMenuOpen={setOpen} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex items-center gap-2 text-sm text-foreground"
    >
      <Image
        src="https://assets.aceternity.com/logo-dark.png"
        alt="ModerIA Logo"
        width={30}
        height={30}
      />
      <span className="font-medium">ModerIA</span>
    </Link>
  );
};
