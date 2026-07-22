import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, AlertCircle, ArrowRight, CheckCircle2, Shield, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const isEmailValid = email.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = email.length > 0 && password.length > 0 && isEmailValid && !isSubmitting && !loginSuccess;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password, rememberMe);
      setLoginSuccess(true);
      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setIsSubmitting(false);
    }
  };

  const quickLogin = async (quickEmail: string, quickPassword: string) => {
    setEmail(quickEmail);
    setPassword(quickPassword);
    setError('');
    setIsSubmitting(true);

    try {
      await login(quickEmail, quickPassword, rememberMe);
      setLoginSuccess(true);
      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      {/* Success overlay */}
      <AnimatePresence>
        {loginSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-slate-950/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                className="h-20 w-20 rounded-full bg-success/10 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.6 }}
              >
                <CheckCircle2 className="h-10 w-10 text-success" />
              </motion.div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">Authentication Verified</p>
              <p className="text-sm text-slate-500">Redirecting to dashboard…</p>
              <motion.div className="h-1 w-32 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mt-2">
                <motion.div
                  className="h-full bg-success rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile brand header */}
      <motion.div variants={fadeUp} className="mb-8 flex items-center gap-3 lg:hidden">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-sm">
          <Eye className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-extrabold text-primary dark:text-emerald-400">ExamEye</span>
      </motion.div>

      {/* Header matching user image */}
      <motion.div variants={fadeUp} className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-1 w-8 rounded-full bg-primary" />
          <span className="text-xs font-extrabold uppercase tracking-widest text-primary dark:text-emerald-400">
            SECURE ACCESS
          </span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Welcome back</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Sign in to the AI Monitoring Dashboard
        </p>
      </motion.div>

      {/* Quick demo access */}
      <motion.div variants={fadeUp} className="mb-6">
        <p className="text-[11px] uppercase tracking-wider text-slate-400 font-extrabold mb-2.5">
          QUICK DEMO ACCESS
        </p>
        <div className="flex gap-3">
          <motion.button
            type="button"
            onClick={() => quickLogin('admin@example.com', 'password')}
            className="flex-1 group relative overflow-hidden rounded-2xl border border-olive/20 dark:border-slate-800 bg-secondary-bg/60 dark:bg-slate-900/80 p-3.5 text-left transition-all hover:border-primary/40 dark:hover:border-emerald-800 hover:shadow-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting || loginSuccess}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 dark:bg-emerald-950/60 text-primary dark:text-emerald-400">
                <Shield className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-900 dark:text-slate-100">Admin</p>
                <p className="text-[11px] text-slate-400">Full access</p>
              </div>
            </div>
            <ArrowRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>

          <motion.button
            type="button"
            onClick={() => quickLogin('teacher@example.com', 'password')}
            className="flex-1 group relative overflow-hidden rounded-2xl border border-olive/20 dark:border-slate-800 bg-secondary-bg/60 dark:bg-slate-900/80 p-3.5 text-left transition-all hover:border-primary/40 dark:hover:border-emerald-800 hover:shadow-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting || loginSuccess}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-info/10 dark:bg-blue-950/40 text-info dark:text-blue-400">
                <Zap className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-900 dark:text-slate-100">Teacher</p>
                <p className="text-[11px] text-slate-400">Limited access</p>
              </div>
            </div>
            <ArrowRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        </div>
      </motion.div>

      {/* Divider */}
      <motion.div variants={fadeUp} className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
        <span className="text-xs text-slate-400 font-medium">or sign in manually</span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              className="flex items-start gap-3 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/30 p-3.5"
            >
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-700 dark:text-red-400">{error}</p>
                <p className="text-xs text-red-500 dark:text-red-500/70 mt-0.5">Check your credentials and try again.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email */}
        <motion.div variants={fadeUp}>
          <label htmlFor="login-email" className="mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300">
            Email address
          </label>
          <div className="relative group">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary dark:group-focus-within:text-emerald-400 transition-colors" />
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="admin@example.com"
              required
              autoComplete="email"
              className={`input-field pl-10 ${!isEmailValid ? 'border-red-300 dark:border-red-800' : ''}`}
            />
          </div>
          {!isEmailValid && (
            <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">Please enter a valid email address.</p>
          )}
        </motion.div>

        {/* Password */}
        <motion.div variants={fadeUp}>
          <label htmlFor="login-password" className="mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300">
            Password
          </label>
          <div className="relative group">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary dark:group-focus-within:text-emerald-400 transition-colors" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              className="input-field pl-10 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </motion.div>

        {/* Remember + Forgot */}
        <motion.div variants={fadeUp} className="flex items-center justify-between">
          <label htmlFor="remember-me" className="flex items-center gap-2 cursor-pointer select-none">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-olive dark:border-slate-700 text-primary focus:ring-olive accent-primary"
            />
            <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Remember me</span>
          </label>
          <button
            type="button"
            className="text-sm font-extrabold text-primary dark:text-emerald-400 hover:text-primary-hover dark:hover:text-emerald-300 focus:outline-none"
          >
            Forgot password?
          </button>
        </motion.div>

        {/* Submit */}
        <motion.div variants={fadeUp}>
          <motion.button
            type="submit"
            disabled={!canSubmit}
            className="btn-primary w-full relative overflow-hidden group py-3"
            whileHover={{ scale: canSubmit ? 1.01 : 1 }}
            whileTap={{ scale: canSubmit ? 0.98 : 1 }}
          >
            <span className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
              <span className="animate-specular absolute -top-1/2 -left-1/2 h-[200%] w-12 bg-gradient-to-r from-transparent via-white/15 to-transparent transform rotate-25" />
            </span>
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2 relative z-10 text-sm">
                <motion.span
                  className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
                Authenticating…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2 relative z-10 text-sm">
                Sign in
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            )}
          </motion.button>
        </motion.div>
      </form>

      <motion.p variants={fadeUp} className="mt-8 text-center text-xs text-slate-400 lg:hidden">
        Secured by ExamEye AI Monitoring System
      </motion.p>
    </motion.div>
  );
}
