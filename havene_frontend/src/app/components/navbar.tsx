"use client";
import { Globe, ToggleRight, Mail, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import InputField from "./inputField.tsx";
import Button from "./button.tsx";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"login" | "signup" | "forgot" | "verify">(
    "login"
  );

  // Баталгаажуулах кодын state
  const [code, setCode] = useState(["", "", "", ""]);
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  const handleCodeChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
    }
  };

  return (
    <>
      <nav className="bg-white flex items-center justify-between ">
        {/* Logo */}
        <div className="-mt-4 ml-8 -mb-1">
          <Link href="/">
            <Image
              src="/haveneLogo.png"
              alt="site logo"
              width={105}
              height={89}
            />
          </Link>
        </div>

        {/* Menu */}
        <div className="flex gap-10">
          <a href="" className="text-black hover:text-gray-400 font-medium">
            HOME
          </a>
          <a href="" className="text-black hover:text-gray-400">
            OFFICES
          </a>
          <a href="" className="text-black hover:text-gray-400">
            AGENTS
          </a>
          <a href="" className="text-black hover:text-gray-400">
            ABOUT
          </a>
          <a href="" className="text-black hover:text-gray-400">
            CONTACT
          </a>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setView("login");
              setOpen(true);
            }}
            className="bg-[#ABA48D] pt-2.5 pb-2.5 px-6 text-white rounded-2xl hover:bg-gray-100 hover:text-black "
          >
            LOGIN
          </button>

          {/* Modal */}
          {open && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg flex w-[90%] md:w-[750px]">
                {/* Зураг хэсэг */}
                <div className="hidden md:block w-1/2">
                  <Image
                    src="/haveneLogo.png"
                    alt="login"
                    width={400}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Form хэсэг */}
                <div className="w-full md:w-1/2 p-8">
                  {view === "login" && (
                    <>
                      <h2 className="text-center text-xl font-semibold mb-6">
                        LOGIN
                      </h2>
                      <InputField
                        type="email"
                        placeholder="E-mail"
                        icon={Mail}
                      />
                      <InputField
                        type="password"
                        placeholder="Password"
                        icon={Lock}
                      />
                      <div
                        className="text-right text-sm text-gray-500 mb-6 cursor-pointer hover:underline"
                        onClick={() => setView("forgot")}
                      >
                        Forgot password?
                      </div>
                      <Button label="SIGN IN" />
                      <div className="mt-3">
                        <Button
                          label="SIGN UP"
                          variant="secondary"
                          onClick={() => setView("signup")}
                        />
                      </div>
                    </>
                  )}

                  {view === "signup" && (
                    <>
                      <h2 className="text-center text-xl font-semibold mb-6">
                        SIGN UP
                      </h2>
                      <InputField
                        type="email"
                        placeholder="E-mail"
                        icon={Mail}
                      />
                      <InputField
                        type="password"
                        placeholder="Password"
                        icon={Lock}
                      />
                      <InputField
                        type="password"
                        placeholder="Confirm password"
                        icon={Lock}
                      />
                      <Button label="REGISTER" />
                      <div
                        className="mt-4 text-sm text-gray-500 w-full text-center cursor-pointer hover:underline"
                        onClick={() => setView("login")}
                      >
                        Already have an account? Login
                      </div>
                    </>
                  )}

                  {view === "forgot" && (
                    <>
                      <h2 className="text-center text-xl font-semibold mb-6">
                        FORGOT PASSWORD
                      </h2>
                      <InputField
                        type="email"
                        placeholder="Enter your email"
                        icon={Mail}
                      />
                      <Button
                        label="RESET PASSWORD"
                        onClick={() => setView("verify")}
                      />
                      <div
                        className="mt-4 text-sm text-gray-500 w-full text-center cursor-pointer hover:underline"
                        onClick={() => setView("login")}
                      >
                        Back to Login
                      </div>
                    </>
                  )}

                  {view === "verify" && (
                    <>
                      <h2 className="text-center text-xl font-semibold mb-6">
                        VERIFY CODE
                      </h2>
                      <div className="flex justify-center gap-3 mb-6">
                        {code.map((digit, index) => (
                          <input
                            key={index}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) =>
                              handleCodeChange(e.target.value, index)
                            }
                            className="w-12 h-12 border text-center text-xl rounded-md focus:outline-none focus:ring-2 focus:ring-[#ABA48D]"
                          />
                        ))}
                      </div>
                      <Button label="CONFIRM" />
                      <div
                        className="mt-4 text-sm text-gray-500 w-full text-center cursor-pointer hover:underline"
                        onClick={() => setView("forgot")}
                      >
                        Resend code
                      </div>
                    </>
                  )}

                  {/* Close */}
                  <button
                    onClick={() => setOpen(false)}
                    className="mt-6 text-sm text-gray-500 w-full hover:underline"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Language + toggle */}
          <div className="flex space-x-[2px]">
            <Globe size={24} color="#696969"></Globe>
          </div>
          <span className="text-[#696969] text-xl">EN</span>
          <div className="mr-8">
            <ToggleRight style={{ width: 50, height: 29, color: "#696969" }} />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
