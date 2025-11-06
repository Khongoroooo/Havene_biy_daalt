"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "../components/services/api"; 

type Props = {
  token: string;
};

export default function ResetPasswordClient({ token }: Props) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"loading" | "form" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Токен олдсонгүй.");
      const t = setTimeout(() => router.push("/"), 2000);
      return () => clearTimeout(t);
    }
    setStatus("form");
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setMessage("Бүх талбарыг бөглөнө үү.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Нууц үг таарахгүй байна.");
      return;
    }

    if (password.length < 6) {
      setMessage("Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/users/confirm_reset_password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json"
      },
        body: JSON.stringify({
          token: token,
          new_password: password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Нууц үг амжилттай сэргээгдлээ!");
        setTimeout(() => router.push("/"), 2000);
      } else {
        setStatus("error");
        setMessage(data.error || "Нууц үг сэргээхэд алдаа гарлаа.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Сервертэй холбогдож чадсангүй.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
        {status === "loading" && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ABA48D] mx-auto mb-4" />
            <p className="text-gray-600">Хүлээж байна...</p>
          </div>
        )}

        {status === "form" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-semibold text-center mb-6">Нууц үг сэргээх</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Шинэ нууц үг
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Шинэ нууц үгээ оруулна уу"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ABA48D]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Нууц үг давтах
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Нууц үгээ дахин оруулна уу"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ABA48D]"
              />
            </div>

            {message && <p className="text-center text-red-600 text-sm">{message}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#ABA48D] text-white py-2 rounded-md font-semibold hover:bg-[#958d76] disabled:opacity-50"
            >
              {isSubmitting ? "Хүлээж байна..." : "Сэргээх"}
            </button>

            <p className="text-center text-sm text-gray-500">
              Аль хэдийн нэвтэрсэн үү?{" "}
              <a href="/auth/login" className="text-[#ABA48D] hover:underline">
                Нэвтрэх
              </a>
            </p>
          </form>
        )}

        {status === "success" && (
          <div className="text-center">
            <div className="text-green-600 text-4xl mb-2">✔</div>
            <h2 className="text-xl font-semibold mb-2">Амжилттай!</h2>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-400 mt-2">
              2 секундын дараа нэвтрэх хуудас руу шилжинэ...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <div className="text-red-600 text-4xl mb-2">✖</div>
            <h2 className="text-xl font-semibold mb-2">Алдаа!</h2>
            <p className="text-gray-600">{message}</p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 text-[#ABA48D] hover:underline"
            >
              Нүүр хуудас руу буцах
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
