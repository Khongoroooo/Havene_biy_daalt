// app/auth/token/[token]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VerifyEmailClient from "../VerifyEmail";
import ResetPasswordClient from "../ResetPassword";

type Props = {
  params: { token: string };
};

export default function TokenPage({ params }: Props) {
  const router = useRouter();
  const token = params?.token ?? "";
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push("/");
      return;
    }
    setIsLoading(false);
  }, [token, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ABA48D]" />
      </div>
    );
  }

  // Токен уртаар нөхцөл шалгах
  if (token.length === 30) {
    return <VerifyEmailClient token={token} />;
  } else if (token.length === 25) {
    return <ResetPasswordClient token={token} />;
  } else {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
          <div className="text-red-600 text-4xl mb-2">✖</div>
          <h2 className="text-xl font-semibold mb-2">Алдаа!</h2>
          <p className="text-gray-600">Токен буруу байгаа байна. Нүүр хуудас руу буцаж өөрийн имэйлийг шалгана уу.</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-[#ABA48D] text-white rounded-md hover:bg-[#958d76]"
          >
            Нүүр хуудас
          </button>
        </div>
      </div>
    );
  }
}
