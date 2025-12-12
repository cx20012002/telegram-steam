"use client";

import { Button } from "./ui/button";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <header>
      <Link
        href={"/dashboard"}
        className="font-medium uppercase tracking-widest"
      >
        Beam
      </Link>
      <div>
        <Authenticated>
          {!isDashboard && (
            <Link href={"/dashboard"}>
              <Button variant="outline">Dashboard</Button>
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
