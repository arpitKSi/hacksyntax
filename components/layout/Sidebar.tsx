"use client";

import { BarChart4, MonitorPlay, LayoutDashboard, BookOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  const isInstructorPath = pathname.startsWith("/instructor");

  const instructorRoutes = [
    { icon: <MonitorPlay />, label: "Courses", path: "/instructor/courses" },
    {
      icon: <BarChart4 />,
      label: "Performance",
      path: "/instructor/performance",
    },
  ];

  const learnerRoutes = [
    { icon: <LayoutDashboard />, label: "Dashboard", path: "/dashboard" },
    { icon: <BookOpen />, label: "My Learning", path: "/learning" },
  ];

  const sidebarRoutes = isInstructorPath ? instructorRoutes : learnerRoutes;

  return (
    <div className="max-sm:hidden flex flex-col w-64 border-r shadow-md px-3 my-4 gap-4 text-sm font-medium">
      {sidebarRoutes.map((route) => (
        <Link
          href={route.path}
          key={route.path}
          className={`flex items-center gap-4 p-3 rounded-lg hover:bg-[#FFF8EB]
          ${pathname.startsWith(route.path) && "bg-[#FDAB04] hover:bg-[#FDAB04]/80"}
          `}
        >
          {route.icon} {route.label}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
