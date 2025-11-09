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

const themeInitializer = `(() => {
  try {
    const storedTheme = localStorage.getItem('theme');
    const legacyFlag = localStorage.getItem('darkMode');
    if (legacyFlag && !storedTheme) {
      localStorage.setItem('theme', legacyFlag === 'true' ? 'dark' : 'light');
      localStorage.removeItem('darkMode');
    }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const finalTheme = localStorage.getItem('theme');
    const enableDark = finalTheme ? finalTheme === 'dark' : prefersDark;
    document.documentElement.classList.toggle('dark', enableDark);
  } catch (error) {
    console.warn('Theme initialization failed', error);
  }
})();`;

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

  const Provider = ClerkProvider;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializer }} />
      </head>
      <body className={inter.className}>
        <Provider>
          <ToasterProvider />
          {children}
        </Provider>
      </body>
    </html>
  );
}
