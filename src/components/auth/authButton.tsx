"use client";

import { type Dispatch, type SetStateAction } from "react";
import { usePrivy, useLogin, useLogout } from "@privy-io/react-auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type AuthButtonProps = {
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
  setIsMenuOpen?: Dispatch<SetStateAction<boolean>>;
};

export default function AuthButton({
  size = "default",
  setIsMenuOpen,
}: AuthButtonProps) {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();
  const { login } = useLogin({
    onComplete: () => {
      toast.success("Welcome back! 🌟");
      return router.push("/dashboard");
    },
    onError: (error) => {
      return toast.error("Login failed: " + error);
    },
  });

  const { logout } = useLogout({
    onSuccess: () => {
      setIsMenuOpen?.(false);
      toast.info("Logged out, come back soon! 🍄");
    },
  });

  function handleLogin() {
    if (!authenticated) {
      login();
    } else {
      toast.warning("You are already logged in");
    }
  }

  if (!ready) {
    return null;
  }

  return (
    <Button
      onClick={authenticated ? logout : handleLogin}
      size={size}
      className="font-medium"
    >
      {authenticated ? "Sign Out" : "Sign In"}
    </Button>
  );
}
