"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "../components/services/api"; 

type Props = {
  token: string;
};

export default function VerifyEmail({ token }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Токен олдсонгүй.");
      const t = setTimeout(() => router.push("/"), 2000);
      return () => clearTimeout(t);
    }
    const controller = new AbortController();
    let redirectTimeout: ReturnType<typeof setTimeout> | null = null;

    const verifyEmail = async () => {
      try {
        const res = await fetch(`${API_URL}/users/verify_email/?token=${encodeURIComponent(token)}`, {
          method: "GET",
          signal: controller.signal,
          headers: {
            "Accept": "application/json",
          },
        });

        const data = await res.json().catch(() => ({}));

        if (res.ok) {
          setStatus("success");
          setMessage(data.message ?? "Имэйл амжилттай баталгаажлаа!");
        } else {
          setStatus("error");
          setMessage(data.error ?? "Баталгаажуулах токен буруу эсвэл хугацаа дууссан байна.");
        }

        redirectTimeout = setTimeout(() => {
          router.push("/");
        }, 2000);
      } catch (err) {
        if ((err as any)?.name === "AbortError") return;
        setStatus("error");
        setMessage("Сервертэй холбогдож чадсангүй.");
        redirectTimeout = setTimeout(() => router.push("/"), 2000);
      }
    };

    verifyEmail();

    return () => {
      controller.abort();
      if (redirectTimeout) clearTimeout(redirectTimeout);
    };
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ABA48D] mx-auto mb-4" />
            <p className="text-gray-600">Имэйл баталгаажуулж байна...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-green-600 text-4xl mb-2">✔</div>
            <h2 className="text-xl font-semibold mb-2">Амжилттай!</h2>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-400 mt-2">2 секундын дараа нүүр хуудас руу шилжинэ...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-red-600 text-4xl mb-2">✖</div>
            <h2 className="text-xl font-semibold mb-2">Алдаа!</h2>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-400 mt-2">2 секундын дараа нүүр хуудас руу шилжинэ...</p>
          </>
        )}
      </div>
    </div>
  );
}
