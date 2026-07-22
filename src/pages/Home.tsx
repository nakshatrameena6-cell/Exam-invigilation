import { motion } from 'framer-motion';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { SpotlightCard } from '../components/common/SpotlightCard';
import { AnimatedList } from '../components/common/AnimatedList';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import {
  Monitor, Camera, AlertTriangle, CheckCircle, TrendingUp,
  ArrowRight, Clock, Activity, Cpu, ShieldCheck, Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Dock from '../components/reactbits/Dock';
import RBCarousel from '../components/reactbits/RBCarousel';
import { Video, Upload, BarChart3, HelpCircle, Info, User, FileText, Eye, Shield } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const stats = [
    {
      title: 'Active Exams',
      value: '12',
      icon: Monitor,
      change: '+2 today',
      trend: 'up',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10 dark:bg-emerald-950/50',
      borderColor: 'border-emerald-500/30',
      shadowGlow: 'shadow-glow',
    },
    {
      title: 'Cameras Online',
      value: '48',
      icon: Camera,
      change: '96% uptime',
      trend: 'up',
      textColor: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-500/10 dark:bg-cyan-950/50',
      borderColor: 'border-cyan-500/30',
      shadowGlow: 'shadow-glow-cyan',
    },
    {
      title: 'Alerts Today',
      value: '3',
      icon: AlertTriangle,
      change: '2 resolved',
      trend: 'down',
      textColor: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-500/10 dark:bg-amber-950/50',
      borderColor: 'border-amber-500/30',
      shadowGlow: 'shadow-glow-gold',
    },
    {
      title: 'Success Rate',
      value: '99.4%',
      icon: TrendingUp,
      change: '+0.2% this week',
      trend: 'up',
      textColor: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-500/10 dark:bg-purple-950/50',
      borderColor: 'border-purple-500/30',
      shadowGlow: 'shadow-glow-purple',
    },
  ];

  const recentExams = [
    { id: 1, name: 'CS101 - Data Structures', location: 'Hall A', status: 'active', cameras: 8, alerts: 0, time: '09:00 AM' },
    { id: 2, name: 'PHY201 - Mechanics', location: 'Hall B', status: 'active', cameras: 6, alerts: 1, time: '09:30 AM' },
    { id: 3, name: 'MTH301 - Calculus', location: 'Lab 3', status: 'completed', cameras: 4, alerts: 0, time: '08:00 AM' },
    { id: 4, name: 'ENG102 - Technical Writing', location: 'Hall C', status: 'active', cameras: 10, alerts: 2, time: '10:00 AM' },
  ];

  const recentActivity = [
    { id: 1, message: 'Malpractice flag logged in Hall B', time: '2 min ago', type: 'warning' as const, category: 'ALERTS' },
    { id: 2, message: 'Camera CAM-006 reconnected', time: '15 min ago', type: 'success' as const, category: 'SYSTEM' },
    { id: 3, message: 'Audit report compiled for CS101', time: '30 min ago', type: 'info' as const, category: 'REPORTS' },
    { id: 4, message: 'New session scheduled: BIO101', time: '1 hr ago', type: 'default' as const, category: 'SCHEDULE' },
  ];

  const getStatusBadge = (status: string) => {
    if (status === 'active') return <Badge variant="success" dot>Active Session</Badge>;
    return <Badge variant="info">Completed</Badge>;
  };

  const getHour = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <motion.div
      className="space-y-6 font-sans"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome banner */}
      <motion.div variants={itemVariants}>
        <PageHeader
          title={`${getHour()}, ${user?.name?.split(' ')[0] || 'Admin'}`}
          description="SecureX — AI-Powered Exam Monitoring. | Fairness Ensured."
          actions={
            <Button
              leftIcon={<Monitor className="h-4 w-4" />}
              onClick={() => navigate('/live-monitoring')}
            >
              Live Monitoring
            </Button>
          }
        />
      </motion.div>

      {/* Color-coded KPI Stats Grid */}
      <motion.div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" variants={itemVariants}>
        {stats.map((stat) => {
          const StatIcon = stat.icon;
          return (
            <div
              key={stat.title}
              className={`rounded-2xl border ${stat.borderColor} bg-white dark:bg-slate-900 p-5 transition-all duration-300 hover:-translate-y-1 ${stat.shadowGlow}`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{stat.title}</p>
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{stat.value}</p>
                </div>
                <div className={`rounded-xl p-3 ${stat.bgColor}`}>
                  <StatIcon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold">
                {stat.trend === 'up' ? (
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <TrendingUp className="h-3.5 w-3.5 text-amber-500 rotate-180" />
                )}
                <span className="text-slate-500 dark:text-slate-400">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Examinations table */}
        <motion.div className="lg:col-span-2" variants={itemVariants}>
          <Card className="border-emerald-500/20">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-extrabold">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                Active Examination Sessions
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                onClick={() => navigate('/live-monitoring')}
              >
                View all feeds
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200/60 dark:border-slate-800 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      <th className="pb-3">Course / Exam</th>
                      <th className="pb-3">Hall Location</th>
                      <th className="pb-3 hidden sm:table-cell">Start Time</th>
                      <th className="pb-3">Cameras</th>
                      <th className="pb-3">Alerts</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {recentExams.map((exam) => (
                      <tr key={exam.id} className="group hover:bg-emerald-50/30 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-4 font-bold text-slate-900 dark:text-slate-100">{exam.name}</td>
                        <td className="py-4 text-slate-600 dark:text-slate-300 font-medium">{exam.location}</td>
                        <td className="py-4 text-slate-500 dark:text-slate-400 hidden sm:table-cell font-mono text-xs">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {exam.time}
                          </span>
                        </td>
                        <td className="py-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">{exam.cameras} Channels</td>
                        <td className="py-4">
                          {exam.alerts > 0 ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
                              <AlertTriangle className="h-3.5 w-3.5" /> {exam.alerts} Flagged
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                              <CheckCircle className="h-3.5 w-3.5" /> Clean
                            </span>
                          )}
                        </td>
                        <td className="py-4">{getStatusBadge(exam.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Feed + System Health */}
        <motion.div className="space-y-6" variants={itemVariants}>
          {/* Recent Activity */}
          <Card className="border-cyan-500/20">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-extrabold">
                <Activity className="h-5 w-5 text-cyan-500" />
                Live Incident Telemetry Stream
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <AnimatedList>
                {recentActivity.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors">
                    <span className="mt-0.5 px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                      {item.category}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">{item.message}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-mono">{item.time}</p>
                    </div>
                  </div>
                ))}
              </AnimatedList>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="border-purple-500/20">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-extrabold">
                <Cpu className="h-5 w-5 text-purple-500" />
                Engine & Server Health
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {[
                { label: 'YOLOv8 Engine Load', value: 32, color: 'bg-emerald-500', barGlow: 'shadow-emerald-500/50' },
                { label: 'NVMe Storage', value: 68, color: 'bg-amber-500', barGlow: 'shadow-amber-500/50' },
                { label: 'MediaPipe FaceEngine', value: 100, color: 'bg-purple-500', statusText: 'Active' },
                { label: 'CCTV Stream Pipeline', value: 94, color: 'bg-cyan-500', statusText: 'Optimal (12ms)' },
              ].map((item) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                    <span className="font-mono text-slate-900 dark:text-slate-100">
                      {item.statusText || `${item.value}%`}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden p-0.5">
                    <motion.div
                      className={`h-full rounded-full ${item.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ReactBits RBCarousel — Quick Action Cards */}
      <motion.div variants={itemVariants}>
        <Card className="border-amber-500/20 shadow-lg">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-extrabold">
              <Zap className="h-5 w-5 text-amber-500" />
              SecureX Feature Highlights
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 pb-4">
            <RBCarousel
              items={[
                { id: 1, title: 'Live AI Monitoring', description: 'Real-time bounding box tracking with YOLOv8 & MediaPipe.', icon: <Eye className="h-4 w-4 text-white" /> },
                { id: 2, title: 'Talking Detection', description: 'Back-row talking flagged instantly with 96.8% confidence.', icon: <Shield className="h-4 w-4 text-white" /> },
                { id: 3, title: 'Video Upload & Analysis', description: 'Upload offline CCTV footage for async AI anomaly scans.', icon: <Upload className="h-4 w-4 text-white" /> },
                { id: 4, title: 'Smart Audit Reports', description: 'Auto-generated malpractice audit logs with evidence frames.', icon: <FileText className="h-4 w-4 text-white" /> },
                { id: 5, title: 'Head Pose & Gaze', description: '3D head pose estimation with yaw/pitch violation flags.', icon: <Monitor className="h-4 w-4 text-white" /> },
              ]}
              baseWidth={260}
              autoplay
              autoplayDelay={4000}
              pauseOnHover
              loop
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* ReactBits Dock — Quick Navigation */}
      <motion.div variants={itemVariants} className="flex justify-center">
        <Dock
          items={[
            { icon: <Monitor className="h-5 w-5 text-emerald-500" />, label: 'Dashboard', onClick: () => navigate('/'), color: '#10b981' },
            { icon: <Video className="h-5 w-5 text-cyan-500" />, label: 'Live Monitoring', onClick: () => navigate('/live-monitoring'), color: '#06b6d4' },
            { icon: <Upload className="h-5 w-5 text-purple-500" />, label: 'Upload Video', onClick: () => navigate('/upload-video'), color: '#8b5cf6' },
            { icon: <BarChart3 className="h-5 w-5 text-amber-500" />, label: 'Reports', onClick: () => navigate('/reports'), color: '#f59e0b' },
            { icon: <HelpCircle className="h-5 w-5 text-rose-500" />, label: 'FAQ', onClick: () => navigate('/faq'), color: '#f43f5e' },
            { icon: <Info className="h-5 w-5 text-blue-500" />, label: 'About', onClick: () => navigate('/about'), color: '#3b82f6' },
            { icon: <User className="h-5 w-5 text-indigo-500" />, label: 'Profile', onClick: () => navigate('/profile'), color: '#6366f1' },
          ]}
          magnification={70}
          baseItemSize={48}
        />
      </motion.div>
    </motion.div>
  );
}
