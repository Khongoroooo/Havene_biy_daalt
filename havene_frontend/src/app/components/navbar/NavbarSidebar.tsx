import Image from "next/image";
import Link from "next/link";
import { menuItems } from "@/constrant/menuItems";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  setSidebarOpen: (v: boolean) => void;
  isLoggedIn: boolean;
  role: string;
}

const NavbarSidebar = ({ open, setOpen, setSidebarOpen, isLoggedIn, role }: Props) => {
  const handleLogout = () => {
    localStorage.removeItem("havene_token");
    location.reload();
  };

  const currentMenu = !isLoggedIn ? menuItems["guest"] : menuItems[role.toLowerCase()] || [];

  return (
    <div
      className={`fixed inset-0 z-40 transition-opacity duration-300 ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      {/* overlay */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* slide-in panel */}
      <aside
        className={`absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b">
          <div className="flex items-center gap-3">
            <Image src="/haveneLogo.png" alt="Лого" width={56} height={48} />
            <span className="font-semibold">Havene</span>
          </div>
          <button
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="text-gray-600"
          >
            ✕
          </button>
        </div>

        <nav className="p-4 flex flex-col gap-2">
          {currentMenu.map((item) => (
            <Link
              key={item.label}
              href={item.url}
              className="py-2 px-3 rounded hover:bg-gray-100 font-medium"
              onClick={() => setSidebarOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <div className="border-t mt-3 pt-3">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    setOpen(true);
                    setSidebarOpen(false);
                  }}
                  className="w-full py-2 rounded-md bg-[#ABA48D] text-white mb-2"
                >
                  НЭВТРЭХ
                </button>
                <button
                  onClick={() => {
                    setOpen(true);
                    setSidebarOpen(false);
                  }}
                  className="w-full py-2 rounded-md border border-[#ABA48D] text-[#222]"
                >
                  БҮРТГҮҮЛЭХ
                </button>
              </>
            ) : (
              <>
                {role.toUpperCase() === "ADMIN" ? (
                  <Link
                    href="/admin/dashboard"
                    className="block py-2 px-3 text-[#ABA48D]"
                    onClick={() => setSidebarOpen(false)}
                  >
                    Админ самбар
                  </Link>
                ) : (
                  <Link
                    href="/profile"
                    className="block py-2 px-3 text-[#ABA48D]"
                    onClick={() => setSidebarOpen(false)}
                  >
                    Миний профайл
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full py-2 mt-2 rounded-md border border-[#ABA48D] text-[#ABA48D] hover:bg-[#ABA48D] hover:text-white"
                >
                  Гарах
                </button>
              </>
            )}
          </div>
        </nav>
      </aside>
    </div>
  );
};

export default NavbarSidebar;
