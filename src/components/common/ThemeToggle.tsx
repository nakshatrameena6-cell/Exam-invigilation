import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative flex h-9 w-16 cursor-pointer items-center rounded-full p-1 shadow-inner transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-olive"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #1e293b, #334155)'
          : 'linear-gradient(135deg, #e2e8f0, #f1f5f9)',
      }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      whileTap={{ scale: 0.95 }}
    >
      {/* Track icons */}
      <Sun
        className="absolute left-2 h-3.5 w-3.5 text-amber-400 transition-opacity duration-200"
        style={{ opacity: isDark ? 0.3 : 0 }}
      />
      <Moon
        className="absolute right-2 h-3.5 w-3.5 text-blue-300 transition-opacity duration-200"
        style={{ opacity: isDark ? 0 : 0.3 }}
      />

      {/* Sliding knob */}
      <motion.div
        className="flex h-7 w-7 items-center justify-center rounded-full shadow-md"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #475569, #64748b)'
            : 'linear-gradient(135deg, #ffffff, #f8fafc)',
        }}
        animate={{ x: isDark ? 28 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        <motion.div
          animate={{ rotate: isDark ? 360 : 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          {isDark ? (
            <Moon className="h-3.5 w-3.5 text-blue-300" />
          ) : (
            <Sun className="h-3.5 w-3.5 text-amber-500" />
          )}
        </motion.div>
      </motion.div>
    </motion.button>
  );
}

export const ThemeToggleBtn = ThemeToggle;
export default ThemeToggle;
