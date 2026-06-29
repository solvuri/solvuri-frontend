import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent";
}

export const Button = ({
  variant = "primary",
  className,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "px-6 py-3 rounded-lg font-medium transition-all duration-200 cursor-pointer";
  const variants = {
    primary: "bg-primary text-white hover:bg-primaryHover",
    secondary: "bg-inputBg text-text hover:bg-surface",
    accent: "bg-accent text-background hover:bg-accentMuted",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className} `}
      {...props}
    />
  );
};
