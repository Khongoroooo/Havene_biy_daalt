"use client";
import { useEffect, useState } from "react";
import { getProfile } from "./services/api";

interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  created_at?: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getProfile();
        setUser(data.user);
        setRole(data.role);
      } catch (err: any) {
        setError(err.message || "Алдаа гарлаа");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
        Уншиж байна...
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-500">
        <p>{error}</p>
        <button
          onClick={() => (window.location.href = "/")}
          className="mt-4 px-4 py-2 bg-[#ABA48D] text-white rounded-xl"
        >
          Буцах
        </button>
      </div>
    );

  if (!user) return null;

  return (
    <div className="flex justify-center items-center py-10 px-4">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-xl p-8 dark:bg-gray-900 dark:text-white">
        <h1 className="text-2xl font-bold mb-6 text-center">Хэрэглэгчийн мэдээлэл</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
          <div>
            <span className="font-medium">ID:</span> {user.id}
          </div>
          <div>
            <span className="font-medium">Имэйл:</span> {user.email}
          </div>
          {user.first_name && (
            <div>
              <span className="font-medium">Овог:</span> {user.first_name}
            </div>
          )}
          {user.last_name && (
            <div>
              <span className="font-medium">Нэр:</span> {user.last_name}
            </div>
          )}
          {user.phone && (
            <div>
              <span className="font-medium">Утас:</span> {user.phone}
            </div>
          )}
          <div>
            <span className="font-medium">Эрх:</span> {role}
          </div>
          {user.created_at && (
            <div>
              <span className="font-medium">Бүртгүүлсэн огноо:</span>{" "}
              {new Date(user.created_at).toLocaleDateString()}
            </div>
          )}
        </div>
{/* 
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => {
              localStorage.removeItem("havene_token");
              window.location.href = "/";
            }}
            className="bg-[#ABA48D] text-white px-5 py-2 rounded-xl hover:opacity-90"
          >
            Гарах
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ProfilePage;
