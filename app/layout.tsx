import type { Metadata } from "next";
import { Inter } from "next/font/google";
// Clerk is imported dynamically below only when a publishable key is present.

import "./globals.css";
import ToasterProvider from "@/components/providers/ToasterProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VNIT E-Learning Platform",
  description: "Empowering minds, shaping future",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  // Default to a passthrough provider (renders children directly)
  let ClerkProvider: React.ComponentType<{
    children: React.ReactNode;
  }> = ({ children }) => <>{children}</>;

  if (hasClerk) {
    // Dynamically import Clerk on the server only when configured to avoid
    // initialization errors during local development without Clerk keys.
    const mod = await import("@clerk/nextjs");
    ClerkProvider = mod.ClerkProvider;
  }

  return (
    // @ts-expect-error - dynamic provider type
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ToasterProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
