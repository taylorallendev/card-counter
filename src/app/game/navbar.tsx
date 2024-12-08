"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export const Navbar = () => {
  return (
    <div className="fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-white flex items-center">
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <Link href="/" className="font-semibold text-xl">
          Card Counter
        </Link>
        <div className="ml-auto">
          <UserButton />
        </div>
      </div>
    </div>
  );
};
