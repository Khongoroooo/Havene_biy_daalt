"use client";
import { useState } from "react";
import Image from "next/image";
import { Mail, Lock } from "lucide-react";
import InputField from "../inputField";
import Button from "../button";
import { useRouter } from "next/navigation";
import { ViewMode } from "./types";
import { API_URL } from "../services/api"; 

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  setSidebarOpen: (v: boolean) => void;
  view: ViewMode;
  setView: (v: ViewMode) => void;
}

const NavbarModal = ({ open, setOpen, setSidebarOpen, view, setView }: Props) => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  const closeAll = () => {
    setOpen(false);
    setSidebarOpen(false);
    setMessage("");
    setLoginMessage("");
    setForgotMessage("");
  };

  // 🟩 LOGIN
  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      setLoginMessage("Имэйл болон нууц үг бөглөнө үү.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/users/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("havene_token", data.token);
        setLoginMessage("Амжилттай нэвтэрлээ!");
        closeAll();
        router.push("/");
        window.location.reload();
      } else {
        setLoginMessage(data.error || "Нэвтрэхэд алдаа гарлаа.");
      }
    } catch {
      setLoginMessage("Сервертэй холбогдож чадсангүй.");
    }
  };

  // 🟦 REGISTER
  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setMessage("Бүх талбарыг бөглөнө үү.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Нууц үг таарахгүй байна.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      setMessage(data.message || data.error);
    } catch {
      setMessage("Сервертэй холбогдож чадсангүй.");
    } finally {
      setLoading(false);
    }
  };

  // 🟨 FORGOT
  const handleForgot = async () => {
    if (!forgotEmail) {
      setForgotMessage("Имэйлээ оруулна уу.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/users/reset_password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      setForgotMessage(data.message || data.error);
    } catch {
      setForgotMessage("Сервертэй холбогдож чадсангүй.");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row w-full max-w-3xl">
        <div className="hidden md:block md:w-1/2">
          <Image src="/haveneLogo.png" alt="Лого" width={600} height={600} className="h-full w-full object-cover" />
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-8">
          {/* LOGIN */}
          {view === "login" && (
            <>
              <h2 className="text-center text-xl font-semibold mb-6">НЭВТРЭХ</h2>
              <InputField type="email" placeholder="Имэйл" icon={Mail} value={loginEmail} onChange={(e: any) => setLoginEmail(e.target.value)} />
              <InputField type="password" placeholder="Нууц үг" icon={Lock} value={loginPassword} onChange={(e: any) => setLoginPassword(e.target.value)} />
              <div className="text-right text-sm text-gray-500 mb-4 cursor-pointer hover:underline" onClick={() => setView("forgot")}>
                Нууц үг мартсан уу?
              </div>
              <Button label="НЭВТРЭХ" onClick={handleLogin} />
              {loginMessage && <p className="mt-2 text-center text-gray-600">{loginMessage}</p>}
              <div className="mt-3">
                <Button label="БҮРТГҮҮЛЭХ" variant="secondary" onClick={() => setView("signup")} />
              </div>
            </>
          )}

          {/* SIGNUP */}
          {view === "signup" && (
            <>
              <h2 className="text-center text-xl font-semibold mb-6">БҮРТГҮҮЛЭХ</h2>
              <InputField type="email" placeholder="Имэйл" icon={Mail} value={email} onChange={(e: any) => setEmail(e.target.value)} />
              <InputField type="password" placeholder="Нууц үг" icon={Lock} value={password} onChange={(e: any) => setPassword(e.target.value)} />
              <InputField type="password" placeholder="Нууц үг давтах" icon={Lock} value={confirmPassword} onChange={(e: any) => setConfirmPassword(e.target.value)} />
              <Button label={loading ? "Хүлээж байна..." : "БҮРТГҮҮЛЭХ"} onClick={handleRegister} disabled={loading} />
              {message && <p className="mt-2 text-center text-green-600">{message}</p>}
              <div className="mt-4 text-sm text-gray-500 w-full text-center cursor-pointer hover:underline" onClick={() => setView("login")}>
                Аль хэдийн бүртгэлтэй юу? Нэвтрэх
              </div>
            </>
          )}

          {/* FORGOT */}
          {view === "forgot" && (
            <>
              <h2 className="text-center text-xl font-semibold mb-6">НУУЦ ҮГ СЭРГЭЭХ</h2>
              <InputField type="email" placeholder="Имэйлээ оруулна уу" icon={Mail} value={forgotEmail} onChange={(e: any) => setForgotEmail(e.target.value)} />
              <Button label="ИЛГЭЭХ" onClick={handleForgot} />
              {forgotMessage && <p className="mt-2 text-center text-gray-600">{forgotMessage}</p>}
              <div className="mt-4 text-sm text-gray-500 w-full text-center cursor-pointer hover:underline" onClick={() => setView("login")}>
                Буцах
              </div>
            </>
          )}

          <button onClick={closeAll} className="mt-6 text-sm text-gray-500 w-full hover:underline">
            Хаах
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavbarModal;
