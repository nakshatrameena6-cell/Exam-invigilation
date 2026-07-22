import { ReactNode } from 'react';

type BadgeVariant = 'success' | 'warning' | 'info' | 'default' | 'danger';

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-highlight border-warning/20',
  info: 'bg-info/10 text-info border-info/20',
  danger: 'bg-red-50 text-red-600 border-red-200',
  default: 'bg-slate-100 text-slate-600 border-slate-200',
};

const dotColors: Record<BadgeVariant, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  info: 'bg-info',
  danger: 'bg-red-500',
  default: 'bg-slate-400',
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

export function Badge({ children, variant = 'default', dot = false, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}
