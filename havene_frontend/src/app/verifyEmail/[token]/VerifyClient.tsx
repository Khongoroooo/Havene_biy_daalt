// src/app/verifyEmail/[token]/VerifyClient.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyClient({ token }: { token: string }) {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token олдсонгүй");
      return;
    }

    const verify = async () => {
      try {
        const API = process.env.API_URL;
        if (!API) throw new Error("API URL тохируулагдаагүй байна");

        // GET эсвэл POST гэж тохируулах -> доор GET ашиглав
        const res = await fetch(`${API}/users/verify_email/?token=${encodeURIComponent(token)}`, {
          method: "GET",
          credentials: "include", // хэрэв бекэнд httpOnly cookie тавих бол хэрэгтэй
          headers: {
            "Accept": "application/json",
          },
        });

        const text = await res.text();
        // Заримдаа HTML (Unexpected token '<') буцаж болно — тийм тохиолдолд text-г харуул
        let data;
        try { data = text ? JSON.parse(text) : {}; } catch { data = null; }

        if (!res.ok) {
          const errMsg = (data && data.error) ? data.error : `Алдаа: ${res.status}`;
          setStatus("error");
          setMessage(errMsg);
          return;
        }

        // Амжилттай: бекэндээс буцах JSON-д токен эсвэл user мэдээлэл байна гэж та тохируулна
        // Жишээ: { success: true, message: "...", token: "<JWT>", user: {...} }

        if (data && data.token) {
          // Хэрэв бекэнд JWT буцаавал (товч: localStorage-д хадгалах)
          // **Аюулгүй арга:** илүү зөв нь бекэнд httpOnly cookie-г Set-Cookie ашиглаж тавих
          localStorage.setItem("havene_token", data.token);
        }

        setStatus("success");
        setMessage((data && data.message) ? data.message : "Имэйл баталгаажлаа");

        // 2 секундын дараа нэвтрэх хуудсанд (эсвэл dashboard) илгээх
        setTimeout(() => router.push("/"), 2000);
      } catch (e: any) {
        setStatus("error");
        setMessage(e?.message || "Сервертэй холбогдохад алдаа гарлаа");
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      {status === "loading" && <div>Баталгаажуулж байна...</div>}
      {status === "success" && <div className="text-green-600">{message}</div>}
      {status === "error" && <div className="text-red-600">{message}</div>}
    </div>
  );
}
