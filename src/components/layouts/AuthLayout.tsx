import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

/* ── Floating Micro-particles ─────────────────────── */
function Particles() {
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{
            y: [0, -35, 0],
            opacity: [0, 0.4, 0],
            scale: [0.5, 1.3, 0.5],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ── Radar sweep ─────────────────────────────────── */
function RadarSweep() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] opacity-30 pointer-events-none z-0">
      {[1, 0.75, 0.5, 0.25].map((scale, i) => (
        <div
          key={i}
          className="absolute inset-0 rounded-full border border-white/[0.08]"
          style={{ transform: `scale(${scale})` }}
        />
      ))}

      <motion.div
        className="absolute left-1/2 top-1/2 h-[200px] w-[2px] origin-bottom"
        style={{ marginLeft: -1, marginTop: -200 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      >
        <div className="h-full w-full bg-gradient-to-t from-emerald-400 to-transparent rounded-full shadow-[0_0_10px_#3BB54A]" />
      </motion.div>
    </div>
  );
}

/* ── AI Bounding Boxes overlay ─────────────────────── */
function BoundingBoxes() {
  const boxes = [
    { x: 52, y: 18, w: 32, h: 42, label: 'ID-003 [85%]', delay: 0 },
    { x: 22, y: 55, w: 28, h: 36, label: 'ID-001 [99%]', delay: 2 },
  ];

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
      {boxes.map((box, i) => (
        <motion.g key={i}>
          <motion.rect
            x={box.x}
            y={box.y}
            width={box.w}
            height={box.h}
            rx={2}
            fill="none"
            stroke="#3BB54A"
            strokeWidth="0.6"
            strokeDasharray="3 2"
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, delay: box.delay }}
          />
          <path
            d={`M${box.x + 0.5} ${box.y + 4} L${box.x + 0.5} ${box.y + 0.5} L${box.x + 4} ${box.y + 0.5}`}
            fill="none"
            stroke="#3BB54A"
            strokeWidth="1.2"
          />
          <path
            d={`M${box.x + box.w - 4} ${box.y + 0.5} L${box.x + box.w - 0.5} ${box.y + 0.5} L${box.x + box.w - 0.5} ${box.y + 4}`}
            fill="none"
            stroke="#3BB54A"
            strokeWidth="1.2"
          />
          <text
            x={box.x + 0.5}
            y={box.y - 1.5}
            fill="#3BB54A"
            fontSize="2.8"
            fontFamily="monospace"
            fontWeight="bold"
          >
            {box.label}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

/* ── Typewriter Terminal Text ─────────────────────── */
function TerminalBox() {
  return (
    <div className="rounded-xl bg-black/30 border border-white/10 px-4 py-3 mb-6 max-w-md backdrop-blur-sm">
      <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm">
        <span>{'>'} Face verification ready</span>
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          className="inline-block w-2 h-4 bg-emerald-400"
        />
      </div>
    </div>
  );
}

/* ── Bottom KPI Stat Cards ────────────────────────── */
function StatCards() {
  const stats = [
    { label: 'CAMERAS ACTIVE', value: '48', icon: '👁️' },
    { label: 'EXAMS TODAY', value: '12', icon: '📋' },
    { label: 'AI ACCURACY', value: '99.4%', icon: '🧠' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-3"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs">{stat.icon}</span>
            <span className="text-[9px] uppercase tracking-wider text-white/50 font-bold">{stat.label}</span>
          </div>
          <p className="text-lg font-extrabold text-white">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Left Illustration Panel ──────────────────────── */
function IllustrationPanel() {
  return (
    <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#012a01] via-primary to-[#013802] p-10 text-white select-none">
      {/* Visual background overlays */}
      <Particles />
      <RadarSweep />
      <BoundingBoxes />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M 36 0 L 0 0 0 36" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Header Brand */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
            <Eye className="h-6 w-6 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight">ExamEye</span>
            <span className="text-[10px] rounded-full bg-emerald-500/20 text-emerald-300 px-2 py-0.5 font-mono border border-emerald-500/30">
              v1.0
            </span>
          </div>
        </div>
      </motion.div>

      {/* Center Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="relative z-10 my-auto py-6"
      >
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 mb-5">
          <motion.span
            className="h-2 w-2 rounded-full bg-emerald-400"
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          <span className="text-xs font-semibold text-emerald-300">System Online — All Cameras Active</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight mb-4">
          AI-Powered{' '}
          <span className="text-emerald-300">Examination</span>
          <br />
          Monitoring
        </h1>

        {/* Subtitle */}
        <p className="text-white/70 text-sm max-w-md leading-relaxed mb-6">
          Real-time computer vision surveillance for modern examination centers. Detect anomalies, verify identities, and ensure academic integrity.
        </p>

        {/* Terminal code box */}
        <TerminalBox />

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { label: 'Face Detection', emoji: '👁️' },
            { label: 'Phone Detection', emoji: '📱' },
            { label: 'Head Pose Analysis', emoji: '🔄' },
            { label: 'Smart Alerts', emoji: '🔔' },
          ].map((feat) => (
            <span
              key={feat.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm"
            >
              <span>{feat.emoji}</span>
              {feat.label}
            </span>
          ))}
        </div>

        {/* Stat Cards */}
        <StatCards />
      </motion.div>

      {/* Footer text */}
      <div className="relative z-10 text-white/40 text-xs font-mono">
        Secured by ExamEye AI Monitoring System
      </div>
    </div>
  );
}

/* ── Split Screen Auth Layout ─────────────────────── */
export function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-slate-950 font-sans">
      {/* Left 50% AI Command Center illustration panel */}
      <IllustrationPanel />

      {/* Right 50% White Login Form panel */}
      <div className="relative flex w-full lg:w-1/2 flex-1 items-center justify-center bg-white dark:bg-slate-950 p-6 lg:p-12 transition-colors duration-300">
        <div className="absolute top-6 right-6 z-50">
          <ThemeToggle />
        </div>
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
