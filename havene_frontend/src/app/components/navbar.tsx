// "use client";
// import { Globe, ToggleRight, Mail, Lock } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import InputField from "./inputField";
// import Button from "./button";
// import { registerUser } from "./services/api";
// import jwtDecode from "jwt-decode";

// interface TokenPayload {
//   user_id: number;
//   role_name: string;
//   exp: number;
// }

// const Navbar = () => {
//   const [open, setOpen] = useState(false); // modal
//   const [view, setView] = useState<"login" | "signup" | "forgot">("login");

//   // sidebar (mobile)
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   // Sign Up state
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   // Login state (UI only)
//   const [loginEmail, setLoginEmail] = useState("");
//   const [loginPassword, setLoginPassword] = useState("");
//   const [loginMessage, setLoginMessage] = useState("");

//   // Forgot state (UI only)
//   const [forgotEmail, setForgotEmail] = useState("");
//   const [forgotMessage, setForgotMessage] = useState("");
//   const [forgotLoading, setForgotLoading] = useState(false);

//   useEffect(() => {
//     // when modal or sidebar open, prevent page scroll
//     if (open || sidebarOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "auto";
//     }
//   }, [open, sidebarOpen]);

//   // Sign up handler (connected)
//   const handleRegister = async () => {
//     if (!email || !password || !confirmPassword) {
//       setMessage("Бүх талбарыг бөглөнө үү.");
//       return;
//     }
//     if (password !== confirmPassword) {
//       setMessage("Нууц үг таарахгүй байна.");
//       return;
//     }

//     setLoading(true);
//     setMessage("");
//     try {
//       await registerUser(email, password);
//       setMessage("Бүртгэл амжилттай. Таны имэйл рүү баталгаажуулах линк илгээлээ.");
//       setEmail("");
//       setPassword("");
//       setConfirmPassword("");
//     } catch (err: any) {
//       setMessage(err.message || "Алдаа гарлаа.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Login handler (UI only — холбогдоогүй)
//   const handleLogin = async () => {
//     if (!loginEmail || !loginPassword) {
//       setLoginMessage("Имэйл/нууц үг дутуу.");
//       return;
//     }
  
//     try {
//       const res = await fetch(`${process.env.API_URL}/users/login/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: loginEmail, password: loginPassword }),
//       });
  
//       const data = await res.json();
//       if (res.ok) {
//         localStorage.setItem("havene_token", data.token);  // JWT хадгал
//         setLoginMessage("Амжилттай нэвтэрлээ.");
//         router.push("/");  // Dashboard руу
//       } else {
//         setLoginMessage(data.error || "Алдаа гарлаа.");
//       }
//     } catch (e) {
//       setLoginMessage("Сервертэй холбогдохгүй байна.");
//     }
//   };

//   // Forgot handler (UI only — холбогдоогүй)
//   const handleForgot = () => {
//     if (!forgotEmail) {
//       setForgotMessage("Имэйлээ оруулна уу.");
//       return;
//     }
//     setForgotLoading(true);
//     setTimeout(() => {
//       setForgotMessage("Нууц үг сэргээх холбоос таны имэйл рүү илгээгдэх болно (дараа холбоно).");
//       setForgotLoading(false);
//       setForgotEmail("");
//     }, 800);
//   };

//   // Toggle sidebar (mobile hamburger)
//   const toggleSidebar = () => {
//     setSidebarOpen((s) => !s);
//   };

//   // close everything helper
//   const closeAll = () => {
//     setOpen(false);
//     setSidebarOpen(false);
//     setMessage("");
//     setLoginMessage("");
//     setForgotMessage("");
//   };

//   return (
//     <>
//       <nav className="bg-white flex items-center justify-between px-4 md:px-8 py-3 shadow-sm">
//         {/* Left: logo */}
//         <div className="flex items-center gap-4">
//           <Link href="/">
//             <Image src="/haveneLogo.png" alt="Лого" width={105} height={89} />
//           </Link>
//         </div>

//         {/* Center: desktop menu (hidden on small screens) */}
//         <div className="hidden md:flex gap-8 items-center">
//           {["НҮҮР", "ОФИС", "АГЕНТУУД", "ТАНИЛЦУУЛГА", "ХОЛБОО БАРИХ"].map((item) => (
//             <a key={item} href="#" className="text-black hover:text-gray-400 font-medium text-sm">
//               {item}
//             </a>
//           ))}
//         </div>

//         {/* Right: actions */}
//         <div className="flex items-center gap-4">
//           {/* Desktop login button */}
//           <div className="hidden md:block">
//             <button
//               onClick={() => { setView("login"); setOpen(true); }}
//               className="bg-[#ABA48D] py-2 px-4 rounded-2xl text-white hover:opacity-95"
//             >
//               НЭВТРЭХ
//             </button>
//           </div>

//           {/* Language & toggle */}
//           <div className="hidden md:flex items-center gap-2">
//             <Globe size={18} color="#696969" />
//             <span className="text-[#696969] text-sm">EN</span>
//             <ToggleRight style={{ width: 36, height: 22, color: "#696969" }} />
//           </div>

//           {/* Mobile hamburger */}
//           <button
//             onClick={toggleSidebar}
//             aria-label={sidebarOpen ? "Close menu" : "Open menu"}
//             className="md:hidden flex flex-col justify-between w-8 h-6 mr-2"
//           >
//             {/* three lines */}
//             <span
//               className={`block h-0.5 w-full bg-black transition-transform duration-200 ${sidebarOpen ? "translate-y-2 rotate-45" : ""}`}
//             />
//             <span
//               className={`block h-0.5 w-full bg-black transition-opacity duration-200 ${sidebarOpen ? "opacity-0" : "opacity-100"}`}
//             />
//             <span
//               className={`block h-0.5 w-full bg-black transition-transform duration-200 ${sidebarOpen ? "-translate-y-2 -rotate-45" : ""}`}
//             />
//           </button>
//         </div>
//       </nav>

//       {/* Mobile sidebar (overlay + panel) */}
//       <div
//         className={`fixed inset-0 z-40 transition-opacity duration-300 ${sidebarOpen ? "pointer-events-auto" : "pointer-events-none"}`}
//         aria-hidden={!sidebarOpen}
//       >
//         {/* overlay */}
//         <div
//           onClick={() => setSidebarOpen(false)}
//           className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0"}`}
//         />

//         {/* slide-in panel */}
//         <aside
//           className={`absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
//         >
//           <div className="p-4 flex items-center justify-between border-b">
//             <div className="flex items-center gap-3">
//               <Image src="/haveneLogo.png" alt="Лого" width={56} height={48} />
//               <span className="font-semibold">Havene</span>
//             </div>
//             <button aria-label="Close sidebar" onClick={() => setSidebarOpen(false)} className="text-gray-600">✕</button>
//           </div>

//           <nav className="p-4 flex flex-col gap-2">
//             {["НҮҮР", "ОФИС", "АГЕНТУУД", "ТАНИЛЦУУЛГА", "ХОЛБОО БАРИХ"].map((item) => (
//               <a key={item} href="#" className="py-2 px-3 rounded hover:bg-gray-100 font-medium">
//                 {item}
//               </a>
//             ))}

//             <div className="border-t mt-3 pt-3">
//               <button
//                 onClick={() => { setOpen(true); setView("login"); setSidebarOpen(false); }}
//                 className="w-full py-2 rounded-md bg-[#ABA48D] text-white mb-2"
//               >
//                 НЭВТРЭХ
//               </button>

//               <button
//                 onClick={() => { setOpen(true); setView("signup"); setSidebarOpen(false); }}
//                 className="w-full py-2 rounded-md border border-[#ABA48D] text-[#222]"
//               >
//                 БҮРТГҮҮЛЭХ
//               </button>
//             </div>

//             <div className="mt-4 text-sm text-gray-500">
//               <div className="flex items-center gap-2">
//                 <Globe size={16} color="#696969" />
//                 <span>EN</span>
//               </div>
//             </div>
//           </nav>
//         </aside>
//       </div>

//       {/* Modal (login/signup/forgot) - unchanged but included */}
//       {open && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//           <div className="bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row w-full max-w-3xl">
//             <div className="hidden md:block md:w-1/2">
//               <Image src="/haveneLogo.png" alt="Лого" width={600} height={600} className="h-full w-full object-cover" />
//             </div>

//             <div className="w-full md:w-1/2 p-6 md:p-8">
//               {/* LOGIN */}
//               {view === "login" && (
//                 <>
//                   <h2 className="text-center text-xl font-semibold mb-6">НЭВТРЭХ</h2>
//                   <InputField type="email" placeholder="Имэйл" icon={Mail} value={loginEmail} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoginEmail(e.target.value)} />
//                   <InputField type="password" placeholder="Нууц үг" icon={Lock} value={loginPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoginPassword(e.target.value)} />
//                   <div className="text-right text-sm text-gray-500 mb-4 cursor-pointer hover:underline" onClick={() => setView("forgot")}>Нууц үг мартсан уу?</div>
//                   <Button label="НЭВТРЭХ" onClick={handleLogin} />
//                   {loginMessage && <p className="mt-2 text-center text-gray-600">{loginMessage}</p>}
//                   <div className="mt-3">
//                     <Button label="БҮРТГҮҮЛЭХ" variant="secondary" onClick={() => setView("signup")} />
//                   </div>
//                 </>
//               )}

//               {/* SIGNUP */}
//               {view === "signup" && (
//                 <>
//                   <h2 className="text-center text-xl font-semibold mb-6">БҮРТГҮҮЛЭХ</h2>
//                   <InputField type="email" placeholder="Имэйл" icon={Mail} value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
//                   <InputField type="password" placeholder="Нууц үг" icon={Lock} value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
//                   <InputField type="password" placeholder="Нууц үг давтах" icon={Lock} value={confirmPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)} />
//                   <Button label={loading ? "Хүлээж байна..." : "БҮРТГҮҮЛЭХ"} onClick={handleRegister} disabled={loading} />
//                   {message && <p className="mt-2 text-center text-green-600">{message}</p>}
//                   <div className="mt-4 text-sm text-gray-500 w-full text-center cursor-pointer hover:underline" onClick={() => setView("login")}>Аль хэдийн бүртгэлтэй юу? Нэвтрэх</div>
//                 </>
//               )}

//               {/* FORGOT */}
//               {view === "forgot" && (
//                 <>
//                   <h2 className="text-center text-xl font-semibold mb-6">НУУЦ ҮГ СЭРГЭЭХ</h2>
//                   <InputField type="email" placeholder="Имэйлээ оруулна уу" icon={Mail} value={forgotEmail} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForgotEmail(e.target.value)} />
//                   <Button label={forgotLoading ? "Илгээж байна..." : "ИЛГЭЭХ"} onClick={handleForgot} disabled={forgotLoading} />
//                   {forgotMessage && <p className="mt-2 text-center text-gray-600">{forgotMessage}</p>}
//                   <div className="mt-4 text-sm text-gray-500 w-full text-center cursor-pointer hover:underline" onClick={() => setView("login")}>Буцах</div>
//                 </>
//               )}

//               <button onClick={closeAll} className="mt-6 text-sm text-gray-500 w-full hover:underline">Хаах</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Navbar;
