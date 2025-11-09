"use client";

import type { ComponentType } from "react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Search,
  BookOpen,
  Users,
  LayoutDashboard,
  Presentation,
  FilePlus2,
  UploadCloud,
  UserCircle,
} from "lucide-react";

import { UserButton, useAuth } from "@/shims/clerk";
import { Button } from "@/components/ui/button";
import DarkModeToggle from "@/components/custom/DarkModeToggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authHelpers } from "@/lib/api-client";
import type { UserRole } from "@/types";

interface NavRoute {
  label: string;
  path: string;
  icon: ComponentType<{ className?: string }>;
}

const Topbar = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const pathName = usePathname();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const syncRole = () => {
      const user = authHelpers.getUser();
      setUserRole((user?.role as UserRole) ?? null);
      setCurrentUser(user ?? null);
    };

    const handleFocus = () => syncRole();
    const handleStorage = () => syncRole();

    syncRole();
    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorage);
    };
  }, [isSignedIn]);

  const isAuthenticated = isSignedIn || !!currentUser?.id;
  const showLearnerLinks = isAuthenticated && ["STUDENT", "LEARNER", "ADMIN"].includes(userRole ?? "");
  const showInstructorLinks = isAuthenticated && ["EDUCATOR", "ADMIN"].includes(userRole ?? "");

  const topRoutes = useMemo<NavRoute[]>(() => {
    const routes: NavRoute[] = [
      { label: "Courses", path: "/", icon: BookOpen },
      { label: "Educators", path: "/educators", icon: Users },
    ];

    if (isAuthenticated) {
      routes.push({ label: "My Profile", path: "/profile", icon: UserCircle });
    }

    if (showLearnerLinks) {
      routes.push({ label: "Dashboard", path: "/dashboard", icon: LayoutDashboard });
    }

    if (showInstructorLinks) {
      routes.push({ label: "Instructor", path: "/instructor/courses", icon: Presentation });
      routes.push({ label: "Create Course", path: "/instructor/create-course", icon: FilePlus2 });

      if (currentUser?.id) {
        routes.push({
          label: "My Materials",
          path: `/educators/${currentUser.id}`,
          icon: UploadCloud,
        });
      }
    }

    return routes;
  }, [showLearnerLinks, showInstructorLinks, isAuthenticated, currentUser?.id]);

  const instructorSidebarRoutes = useMemo(
    () => [
      { label: "Courses", path: "/instructor/courses" },
      { label: "Performance", path: "/instructor/performance" },
    ],
    []
  );

  const [searchInput, setSearchInput] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/signout", { method: "POST" });
    } catch (error) {
      console.error("Failed to sign out:", error);
    } finally {
      authHelpers.clearTokens();
      router.push("/sign-in");
      router.refresh();
      setIsLoggingOut(false);
    }
  };

  const handleSearch = () => {
    if (searchInput.trim() !== "") {
      router.push(`/search?query=${searchInput}`);
    }
    setSearchInput("");
  };

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image src="/logo.png" height={40} width={40} alt="VNIT Logo" className="object-contain" />
          <span className="font-bold text-lg bg-gradient-to-r from-[#FDAB04] to-[#FD6A04] bg-clip-text text-transparent">
            VNIT E-Learning
          </span>
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <input
              className="w-full h-10 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pl-4 pr-12 text-sm outline-none focus:border-[#FDAB04] transition-colors"
              placeholder="Search for courses..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              className="absolute right-1 top-1 h-8 w-8 rounded-full bg-[#FDAB04] hover:bg-[#FD8A04] flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={searchInput.trim() === ""}
              onClick={handleSearch}
            >
              <Search className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
          {topRoutes.map((route) => {
            const Icon = route.icon;
            const isActive = pathName === route.path || pathName.startsWith(route.path + "/");
            return (
              <Link
                href={route.path}
                key={route.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-[#FDAB04]/10 hover:text-[#FDAB04] ${
                  isActive ? "bg-[#FDAB04]/10 text-[#FDAB04]" : ""
                }`}
              >
                <Icon className="h-4 w-4" />
                {route.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          <DarkModeToggle />

          {/* Auth Buttons */}
          {isSignedIn ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="font-semibold hover:bg-red-50 hover:text-red-600"
              >
                {isLoggingOut ? "Signing out…" : "Sign Out"}
              </Button>
              <UserButton />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                className="font-semibold hover:bg-[#FDAB04]/10 hover:text-[#FDAB04]"
                asChild
              >
                <Link href="/sign-in">
                  Sign In
                </Link>
              </Button>
              <Button 
                className="bg-gradient-to-r from-[#FDAB04] to-[#FD8A04] hover:from-[#FD8A04] hover:to-[#FD6A04] text-white font-semibold shadow-lg shadow-[#FDAB04]/30"
                asChild
              >
                <Link href="/sign-up">
                  Sign Up
                </Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Image src="/logo.png" height={32} width={32} alt="VNIT Logo" className="object-contain" />
                    <span className="bg-gradient-to-r from-[#FDAB04] to-[#FD6A04] bg-clip-text text-transparent">
                      VNIT E-Learning
                    </span>
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile Search */}
                <div className="mt-6 mb-4">
                  <div className="relative">
                    <input
                      className="w-full h-10 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pl-4 pr-12 text-sm outline-none focus:border-[#FDAB04] transition-colors"
                      placeholder="Search for courses..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <button
                      className="absolute right-1 top-1 h-8 w-8 rounded-full bg-[#FDAB04] hover:bg-[#FD8A04] flex items-center justify-center transition-colors disabled:opacity-50"
                      disabled={searchInput.trim() === ""}
                      onClick={handleSearch}
                    >
                      <Search className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Mobile Navigation */}
                <div className="flex flex-col gap-2 mt-6" aria-label="Mobile primary navigation">
                  {topRoutes.map((route) => {
                    const Icon = route.icon;
                    const isActive = pathName === route.path || pathName.startsWith(route.path + "/");
                    return (
                      <Link
                        href={route.path}
                        key={route.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all hover:bg-[#FDAB04]/10 hover:text-[#FDAB04] ${
                          isActive ? "bg-[#FDAB04]/10 text-[#FDAB04]" : ""
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {route.label}
                      </Link>
                    );
                  })}
                </div>

                {showInstructorLinks && (
                  <div className="flex flex-col gap-2 mt-6 pt-6 border-t">
                    <h3 className="text-sm font-semibold text-gray-500 px-4 mb-2">
                      Instructor
                    </h3>
                    {instructorSidebarRoutes.map((route) => (
                      <Link
                        href={route.path}
                        key={route.path}
                        className="flex items-center px-4 py-3 rounded-lg text-sm font-medium hover:bg-[#FDAB04]/10 hover:text-[#FDAB04] transition-all"
                      >
                        {route.label}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Mobile Auth Buttons */}
                {isSignedIn ? (
                  <div className="flex flex-col gap-2 mt-6 pt-6 border-t">
                    <Button
                      variant="outline"
                      className="w-full font-semibold border-2"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? "Signing out…" : "Sign Out"}
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 mt-6 pt-6 border-t">
                    <Button 
                      variant="outline" 
                      className="w-full font-semibold border-2"
                      asChild
                    >
                      <Link href="/sign-in">
                        Sign In
                      </Link>
                    </Button>
                    <Button 
                      className="w-full bg-gradient-to-r from-[#FDAB04] to-[#FD8A04] hover:from-[#FD8A04] hover:to-[#FD6A04] text-white font-semibold"
                      asChild
                    >
                      <Link href="/sign-up">
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
