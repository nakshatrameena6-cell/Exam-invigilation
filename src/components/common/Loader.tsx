import { motion } from 'framer-motion';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
};

export function Loader({ size = 'md', className = '', label }: LoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`} role="status">
      <div
        className={`${sizeClasses[size]} rounded-full border-primary border-t-transparent animate-spin`}
      />
      {label && <p className="text-sm text-slate-500">{label}</p>}
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function FullPageLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-white"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary">
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </div>
      <Loader size="md" />
      <p className="text-sm text-slate-400">Loading ExamEye…</p>
    </motion.div>
  );
}
