import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "success";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-app-primary bg-app-primary text-white shadow-sm hover:bg-app-primaryDark disabled:border-transparent disabled:bg-slate-200 disabled:text-slate-400",
  secondary:
    "border-slate-200 bg-white text-app-text hover:border-app-primary hover:text-app-primaryDark disabled:bg-slate-100 disabled:text-slate-400",
  ghost:
    "border-transparent bg-transparent text-app-soft hover:bg-slate-100 hover:text-app-text disabled:text-slate-300",
  danger:
    "border-app-danger bg-app-danger text-white hover:bg-red-700 disabled:border-transparent disabled:bg-slate-200 disabled:text-slate-400",
  success:
    "border-app-success bg-emerald-50 text-app-success hover:bg-emerald-100 disabled:border-transparent disabled:bg-slate-100 disabled:text-slate-400",
};

export function Button({
  children,
  className,
  iconLeft,
  iconRight,
  variant = "secondary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-semibold transition disabled:cursor-not-allowed",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {iconLeft}
      <span>{children}</span>
      {iconRight}
    </button>
  );
}
