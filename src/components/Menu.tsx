"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface MenuItem {
  icon: string;
  label: string;
  href: string;
  visible: string[];
  action?: string; // Make action optional
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const menuItems: MenuSection[] = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Dashboard",
        href: "/admin",
       visible: ["Admin"],
      },
      {
        icon: "/home.png",
        label: "Dashboard",
        href: "/team",
       visible: ["Team member"],
      },
      {
        icon: "/team.png",
        label: "Team",
        href: "/list/team",
        visible: ["Admin"],
      },
      {
        icon: "/users.png",
        label: "Users",
        href: "/list/users",
       visible: ["Admin", "Team member"],
      },
      {
        icon: "/finance.png",
        label: "Custom Offers",
        href: "/list/customOffers",
       visible: ["Admin", "Team member"],
      },
      {
        icon: "/class.png",
        label: "Bookings",
        href: "/list/bookings",
       visible: ["Admin", "Team member"],
      },
      {
        icon: "/lesson.png",
        label: "Listings",
        href: "/list/listings",
       visible: ["Admin", "Team member"],
      },
      {
        icon: "/exam.png",
        label: "Transactions",
        href: "/list/transactions",
        visible: ["Admin"],
      },
      {
        icon: "/assignment.png",
        label: "Owners Documents",
        href: "/list/documents",
       visible: ["Admin", "Team member"],
      },
      {
        icon: "/message.png",
        label: "Support Chat",
        href: "/list/messages",
       visible: ["Admin", "Team member"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/logout.png",
        label: "Logout",
        href: "#", // Using '#' because we're handling this in onClick
       visible: ["Admin", "Team member"],
        action: "logout", // Add an action to identify the logout
      },
    ],
  },
];

const Menu = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (!savedRole) {
      router.push("/login");
    } else {
      setUserRole(savedRole);
    }
    return () => {
      setUserRole(null); 
    };
  }, [router]);

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      router.push("/login");
    }
  };
  if (!userRole) {
    return null; 
  }
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            if (item.visible.includes(userRole)) {
              return item.action === "logout" ? (
                // Handle logout onClick directly
                <button
                  key={item.label}
                  onClick={handleLogout}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
                >
                  <Image src={item.icon} alt="OfferBoat Admin Panel" width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </button>
              ) : (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
                >
                  <Image src={item.icon} alt="OfferBoat Admin Panel" width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
            return null;
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
