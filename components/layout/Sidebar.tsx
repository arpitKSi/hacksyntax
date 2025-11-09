"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart4,
  MonitorPlay,
  LayoutDashboard,
  BookOpen,
  FilePlus2,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { authHelpers } from "@/lib/api-client";
import type { UserRole } from "@/types";

const Sidebar = () => {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const syncRole = () => {
      const user = authHelpers.getUser();
      setUserRole((user?.role as UserRole) ?? null);
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
  }, []);

  const isInstructorRole = useMemo(
    () => ["EDUCATOR", "ADMIN"].includes(userRole ?? ""),
    [userRole]
  );

  const instructorRoutes = useMemo(
    () => [
      { icon: <UserCircle className="h-5 w-5" />, label: "My Profile", path: "/profile" },
      { icon: <MonitorPlay className="h-5 w-5" />, label: "Courses", path: "/instructor/courses" },
      { icon: <FilePlus2 className="h-5 w-5" />, label: "Create Course", path: "/instructor/create-course" },
      { icon: <BarChart4 className="h-5 w-5" />, label: "Performance", path: "/instructor/performance" },
    ],
    []
  );

  const learnerRoutes = useMemo(
    () => [
      { icon: <UserCircle className="h-5 w-5" />, label: "My Profile", path: "/profile" },
      { icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard", path: "/dashboard" },
      { icon: <BookOpen className="h-5 w-5" />, label: "My Learning", path: "/learning" },
    ],
    []
  );

  const isInstructorSection = pathname.startsWith("/instructor");

  const sidebarRoutes = useMemo(() => {
    if (isInstructorRole && isInstructorSection) {
      return instructorRoutes;
    }

    return learnerRoutes;
  }, [instructorRoutes, learnerRoutes, isInstructorRole, isInstructorSection]);

  if (sidebarRoutes.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Secondary"
      className="hidden md:flex md:w-60 lg:w-64 flex-shrink-0 flex-col gap-2 border-r bg-background px-3 py-6 shadow-sm"
    >
      {sidebarRoutes.map((route) => {
        const isActive = pathname === route.path || pathname.startsWith(`${route.path}/`);
        return (
          <Link
            href={route.path}
            key={route.path}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[#FFF8EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FDAB04] ${
              isActive ? "bg-[#FDAB04] text-white hover:bg-[#FDAB04]/90" : "text-foreground/80"
            }`}
          >
            {route.icon}
            <span className="truncate">{route.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Sidebar;
