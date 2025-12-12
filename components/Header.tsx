"use client";

import { Button } from "./ui/button";
import { SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <header className="flex items-center justify-between px-4 h-15 sm:px-6">
      <Link
        href={"/dashboard"}
        className="font-medium uppercase tracking-widest"
      >
        Beam
      </Link>

      <div className="flex items-center gap-2">
        <Authenticated>
          {!isDashboard && (
            <Link href={"/dashboard"}>
              <Button variant="outline">Dashboard</Button>
              <SignOutButton>
                <Button variant="outline">Sign out</Button>
              </SignOutButton>
            </Link>
          )}
          <UserButton />
        </Authenticated>

        <Unauthenticated>
          <SignInButton
            mode="modal"
            forceRedirectUrl={"/dashboard"}
            signUpForceRedirectUrl={"/dashboard"}
          >
            <Button variant="outline">Sign in</Button>
          </SignInButton>
        </Unauthenticated>
      </div>
    </header>
  );
};

export default Header;
