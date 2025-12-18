"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import NavbarMenu from "./NavbarMenu";
import NavbarSidebar from "./NavbarSidebar";
import NavbarModal from "./NavbarModal";
import { TokenPayload, ViewMode } from "./types";

const Navbar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState<ViewMode>("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string>("GUEST");

  // JWT decode → хэрэглэгчийн role тодорхойлох
  useEffect(() => {
    const token = localStorage.getItem("havene_token");
    if (token) {
      try {
        const decoded: TokenPayload = jwtDecode(token);
        setRole(decoded.role_name);
        setIsLoggedIn(true);
      } catch {
        localStorage.removeItem("havene_token");
      }
    }
  }, []);

  return (
    <>
      <h1>{role}</h1>
      <NavbarMenu
        setOpen={setOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
        isLoggedIn={isLoggedIn}
        role={role}
      />
      <NavbarSidebar
        open={sidebarOpen}
        setOpen={setOpen}
        setSidebarOpen={setSidebarOpen}
        isLoggedIn={isLoggedIn}
        role={role}
      />
      <NavbarModal
        open={open}
        setOpen={setOpen}
        setSidebarOpen={setSidebarOpen}
        view={view}
        setView={setView}
      />
    </>
  );
};

export default Navbar;
