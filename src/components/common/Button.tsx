import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  specular?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-hover dark:bg-emerald-800 dark:hover:bg-emerald-700 shadow-sm',
  secondary: 'border border-olive bg-white dark:bg-slate-900 dark:border-slate-700 text-primary dark:text-emerald-400 hover:bg-secondary-bg dark:hover:bg-slate-800',
  ghost: 'text-slate-600 dark:text-slate-300 hover:bg-secondary-bg dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-5 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading,
      leftIcon,
      rightIcon,
      specular = true,
      children,
      className = '',
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      'relative overflow-hidden inline-flex items-center justify-center rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-olive focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    return (
      <motion.button
        ref={ref}
        className={classes}
        disabled={disabled || isLoading}
        whileTap={{ scale: 0.97 }}
        {...(props as any)}
      >
        {/* Specular sheen animation overlay */}
        {specular && variant === 'primary' && !disabled && !isLoading && (
          <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
            <span className="animate-specular absolute -top-1/2 -left-1/2 h-[200%] w-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transform rotate-25" />
          </span>
        )}

        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon}
        <span className="relative z-10">{children}</span>
        {!isLoading && rightIcon}
      </motion.button>
    );
  },
);

Button.displayName = 'Button';
