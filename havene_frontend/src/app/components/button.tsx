"use client";

interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}

const Button = ({ label, variant = "primary", onClick }: ButtonProps) => {
  const baseClass =
    "w-full py-2 rounded-full font-medium transition-colors duration-200";

  const styles =
    variant === "primary"
      ? "bg-[#ABA48D] text-white hover:bg-gray-700"
      : "border border-[#ABA48D] text-[#ABA48D] hover:bg-[#ABA48D] hover:text-white";

  return (
    <button onClick={onClick} className={`${baseClass} ${styles}`}>
      {label}
    </button>
  );
};

export default Button;
