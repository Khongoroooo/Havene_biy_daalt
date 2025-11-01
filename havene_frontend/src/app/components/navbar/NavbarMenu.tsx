import Image from "next/image";
import Link from "next/link";

interface Props {
  setOpen: (v: boolean) => void;
  setSidebarOpen: (v: boolean) => void;
  sidebarOpen: boolean;
  isLoggedIn: boolean;
  role: string;
}

const NavbarMenu = ({ setOpen, sidebarOpen, isLoggedIn, role }: Props) => {
  return (
    <nav
      className={`sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200
                  flex items-center justify-between px-4 md:px-10 py-2 shadow-sm transition-all duration-300`}
    >
      {/* ЛОГО */}
      <Link href="/" className="flex items-center gap-2">
        <Image src="/haveneLogo.png" alt="Лого" width={85} height={52} />
      </Link>

      {/* Цэс — desktop */}
      <div className="hidden md:flex gap-6 items-center">
        {["НҮҮР", "ОФИС", "АГЕНТУУД", "ТАНИЛЦУУЛГА", "ХОЛБОО БАРИХ"].map((item) => (
          <a
            key={item}
            href="#"
            className="text-gray-700 hover:text-[#ABA48D] font-medium text-sm transition-colors"
          >
            {item}
          </a>
        ))}
      </div>

      {/* Баруун тал */}
      <div className="flex items-center gap-3">
        {!isLoggedIn ? (
          <button
            onClick={() => setOpen(true)}
            className="bg-[#ABA48D] py-1.5 px-4 rounded-full text-white text-sm font-medium hover:bg-[#9b927b] transition"
          >
            НЭВТРЭХ
          </button>
        ) : (
          <>
            {role === "ADMIN" ? (
              <Link href="/admin/dashboard" className="text-[#ABA48D] text-sm font-medium">
                Админ самбар
              </Link>
            ) : (
              <Link href="/profile" className="text-[#ABA48D] text-sm font-medium">
                Миний профайл
              </Link>
            )}
            <button
              onClick={() => {
                localStorage.removeItem("havene_token");
                location.reload();
              }}
              className="border border-[#ABA48D] px-3 py-1 rounded-full text-[#ABA48D] text-sm hover:bg-[#ABA48D] hover:text-white transition"
            >
              Гарах
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavbarMenu;
