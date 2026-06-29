import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = ({ label, className, ...props }: InputProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-muted mb-2">{label}</label>
      )}
      <input
        className={`w-full bg-inputBg p-4 rounded-lg border border-transparent focus:border-primary text-text outline-none transition-all ${className}`}
        {...props}
      />
    </div>
  );
};
