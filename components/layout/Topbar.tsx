"use client";

import { UserButton, useAuth } from "@/shims/clerk";
import { Menu, Search, GraduationCap, BookOpen, Users, LayoutDashboard, Presentation } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import DarkModeToggle from "@/components/custom/DarkModeToggle";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Topbar = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const pathName = usePathname();

  const topRoutes = [
    { label: "Courses", path: "/", icon: BookOpen },
    { label: "Educators", path: "/educators", icon: Users },
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Instructor", path: "/instructor/courses", icon: Presentation },
  ];

  const sidebarRoutes = [
    { label: "Courses", path: "/instructor/courses" },
    {
      label: "Performance",
      path: "/instructor/performance",
    },
  ];

  const [searchInput, setSearchInput] = useState("");

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
        <nav className="hidden lg:flex items-center gap-1">
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
            <UserButton />
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
                <div className="flex flex-col gap-2 mt-6">
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

                {pathName.startsWith("/instructor") && (
                  <div className="flex flex-col gap-2 mt-6 pt-6 border-t">
                    <h3 className="text-sm font-semibold text-gray-500 px-4 mb-2">
                      Instructor
                    </h3>
                    {sidebarRoutes.map((route) => (
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
                {!isSignedIn && (
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
