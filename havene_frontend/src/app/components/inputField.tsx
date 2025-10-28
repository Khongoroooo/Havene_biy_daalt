"use client";
import { LucideIcon } from "lucide-react";

interface InputFieldProps {
  type?: string;
  placeholder: string;
  icon?: LucideIcon;
  value?: string; 
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; 
}

const InputField = ({ type = "text", placeholder, icon: Icon, value, onChange }: InputFieldProps) => {
  return (
    <div className="flex items-center border border-gray-300 rounded-md p-3 w-full mb-4 focus-within:border-[#ABA48D]">
      {Icon && <Icon className="w-5 h-5 text-gray-400 mr-2" />}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full focus:outline-none text-sm"
      />
    </div>
  );
};

export default InputField;
