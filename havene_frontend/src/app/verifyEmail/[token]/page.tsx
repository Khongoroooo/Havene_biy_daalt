"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyEmailClient({ token }: { token: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let redirectTimeout: ReturnType<typeof setTimeout> | null = null;

    const verifyEmail = async () => {
      try {
        const res = await fetch(
          `${process.env.API_URL}/users/verify_email/?token=${token}`,
          { signal: controller.signal }
        );

        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "Имэйл амжилттай баталгаажлаа!");
        } else {
          setStatus("error");
          setMessage(data.error || "Баталгаажуулах токен буруу эсвэл хугацаа дууссан байна.");
        }

        // Амжилттай эсвэл алдаа байсан ч 3 сек дараа буцаах
        redirectTimeout = setTimeout(() => router.push("/"), 3000);
      } catch (err) {
        if ((err as any)?.name === "AbortError") return;
        setStatus("error");
        setMessage("Сервертэй холбогдож чадсангүй.");
        redirectTimeout = setTimeout(() => router.push("/"), 3000);
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ABA48D] mx-auto mb-4"></div>
            <p className="text-gray-600">Имэйл баталгаажуулж байна...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-green-600 text-4xl mb-2">✔</div>
            <h2 className="text-xl font-semibold mb-2">Амжилттай!</h2>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-400 mt-2">3 секундын дараа нүүр хуудас руу шилжинэ...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-red-600 text-4xl mb-2">✖</div>
            <h2 className="text-xl font-semibold mb-2">Алдаа!</h2>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-400 mt-2">3 секундын дараа нүүр хуудас руу шилжинэ...</p>
          </>
        )}
      </div>
    </div>
  );
}
