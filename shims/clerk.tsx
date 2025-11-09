"use client"

import React from "react";
import { authHelpers } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Minimal client-side shim for @clerk/nextjs used in this project.
// Uses our JWT authentication system

export const ClerkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const SignIn: React.FC<any> = () => {
  return <div style={{ padding: 16 }}>Please use /sign-in page</div>;
};

export const SignUp: React.FC<any> = () => {
  return <div style={{ padding: 16 }}>Please use /sign-up page</div>;
};

export const UserButton: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const userData = authHelpers.getUser();
    setUser(userData);
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
    } catch (error) {
      console.error("Failed to sign out:", error);
    } finally {
      authHelpers.clearTokens();
      router.push("/sign-in");
      router.refresh();
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="relative group">
      <div
        className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FDAB04] to-[#FD6A04] flex items-center justify-center text-white font-bold cursor-pointer hover:shadow-lg transition-all"
        title={user.email}
      >
        {user.imageUrl ? (
          <Image
            src={user.imageUrl}
            alt={user.firstName || "User"}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <span className="text-sm">
            {user.firstName?.[0]?.toUpperCase() || "U"}
            {user.lastName?.[0]?.toUpperCase() || ""}
          </span>
        )}
      </div>
      
      {/* Dropdown Menu */}
      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-3 border-b">
          <p className="font-semibold text-sm">{user.firstName} {user.lastName}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
          <p className="text-xs text-[#FDAB04] mt-1">{user.role}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-b-lg transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export const useAuth = () => {
  const [isSignedIn, setIsSignedIn] = React.useState(false);
  const [userId, setUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const user = authHelpers.getUser();
    if (user) {
      setIsSignedIn(true);
      setUserId(user.id);
    } else {
      setIsSignedIn(false);
      setUserId(null);
    }
  }, []);

  return { 
    userId, 
    isSignedIn 
  };
};

export const clerkClient = {
  users: {
    getUser: async () => null,
  },
};

export default ClerkProvider;
