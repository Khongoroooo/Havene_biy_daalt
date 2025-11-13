// src/app/components/navbar/NavbarMenu.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { menuItems } from "@/constrant/menuItems";

interface Props {
  setOpen: (v: boolean) => void;
  setSidebarOpen: (v: boolean) => void;
  sidebarOpen: boolean;
  isLoggedIn: boolean;
  role: string;
}

interface MenuItem {
  label: string;
  url: string;
}

const NavbarMenu = ({ setOpen, setSidebarOpen, sidebarOpen, isLoggedIn, role }: Props) => {
  // Role-based menu selection
  const currentMenuItems: MenuItem[] = isLoggedIn
    ? role.toLowerCase() === "admin"
      ? menuItems.admin
      : menuItems.agent
    : menuItems.guest;

  const handleLogout = () => {
    localStorage.removeItem("havene_token");
    location.reload();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 md:px-10 py-2 shadow-sm">
      
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Image src="/haveneLogo.png" alt="Лого" width={85} height={52} />
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-6 items-center">
        {currentMenuItems.map((item: MenuItem) => (
          <Link
            key={item.label}
            href={item.url}
            className="text-gray-700 hover:text-[#ABA48D] font-medium text-sm transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Right side buttons */}
      <div className="flex items-center gap-3">
        {!isLoggedIn ? (
          <button
            onClick={() => setOpen(true)}
            className="hidden md:inline-block bg-[#ABA48D] py-1.5 px-4 rounded-full text-white text-sm font-medium hover:bg-[#9b927b] transition"
          >
            НЭВТРЭХ
          </button>
        ) : (
          <div className="hidden md:flex items-center gap-3">
            {role.toLowerCase() === "admin" && (
              <Link
                href="/admin/dashboard"
                className="text-[#ABA48D] text-sm font-medium"
              >
                Админ самбар
              </Link>
            )}
            <Link
              onClick={handleLogout}
               href="/profile" className="text-[#ABA48D] text-sm font-medium">
              Гарах
            </Link>
          </div>
        )}

        {/* Mobile: hamburger */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          aria-expanded={sidebarOpen}
          className="md:hidden flex flex-col justify-between w-8 h-6 ml-2"
        >
          <span
            className={`block h-0.5 w-full bg-black transition-transform duration-200 ${
              sidebarOpen ? "translate-y-2 rotate-45 origin-center" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-full bg-black transition-opacity duration-200 ${
              sidebarOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block h-0.5 w-full bg-black transition-transform duration-200 ${
              sidebarOpen ? "-translate-y-2 -rotate-45 origin-center" : ""
            }`}
          />
        </button>
      </div>
    </nav>
  );
};

export default NavbarMenu;
