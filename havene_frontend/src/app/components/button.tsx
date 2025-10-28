"use client";

interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary";
  onClick?: () => void | Promise<void>;
  disabled?: boolean; 
}

const Button = ({ label, variant = "primary", onClick, disabled = false }: ButtonProps) => {
  const baseClass =
    "w-full py-2 rounded-full font-medium transition-colors duration-200 text-center";

  const styles =
    variant === "primary"
      ? "bg-[#ABA48D] text-white hover:bg-gray-700 disabled:opacity-50"
      : "border border-[#ABA48D] text-[#ABA48D] hover:bg-[#ABA48D] hover:text-white disabled:opacity-50";

  return (
    <button onClick={onClick} className={`${baseClass} ${styles}`} disabled={disabled}>
      {label}
    </button>
  );
};

export default Button;
