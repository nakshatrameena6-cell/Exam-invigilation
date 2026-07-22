import { motion } from 'framer-motion';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { SpotlightCard } from '../components/common/SpotlightCard';
import { AnimatedList } from '../components/common/AnimatedList';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import {
  Monitor, Camera, AlertTriangle, CheckCircle, TrendingUp,
  ArrowRight, Clock, Activity,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

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
    { title: 'Active Exams', value: '12', icon: Monitor, change: '+2 today', trend: 'up', color: 'text-primary dark:text-emerald-400', bgColor: 'bg-primary/5 dark:bg-emerald-950/40' },
    { title: 'Cameras Online', value: '48', icon: Camera, change: '96% uptime', trend: 'up', color: 'text-success dark:text-emerald-400', bgColor: 'bg-success/5 dark:bg-emerald-950/40' },
    { title: 'Alerts Today', value: '3', icon: AlertTriangle, change: '2 resolved', trend: 'down', color: 'text-highlight dark:text-amber-400', bgColor: 'bg-warning/5 dark:bg-amber-950/40' },
    { title: 'Success Rate', value: '99.4%', icon: TrendingUp, change: '+0.2% this week', trend: 'up', color: 'text-success dark:text-emerald-400', bgColor: 'bg-success/5 dark:bg-emerald-950/40' },
  ];

  const recentExams = [
    { id: 1, name: 'CS101 - Data Structures', location: 'Hall A', status: 'active', cameras: 8, alerts: 0, time: '09:00 AM' },
    { id: 2, name: 'PHY201 - Mechanics', location: 'Hall B', status: 'active', cameras: 6, alerts: 1, time: '09:30 AM' },
    { id: 3, name: 'MTH301 - Calculus', location: 'Lab 3', status: 'completed', cameras: 4, alerts: 0, time: '08:00 AM' },
    { id: 4, name: 'ENG102 - Technical Writing', location: 'Hall C', status: 'active', cameras: 10, alerts: 2, time: '10:00 AM' },
  ];

  const recentActivity = [
    { id: 1, message: 'Anomaly detected in Hall B', time: '2 min ago', type: 'warning' as const },
    { id: 2, message: 'Camera CAM-006 reconnected', time: '15 min ago', type: 'success' as const },
    { id: 3, message: 'Report generated for CS101', time: '30 min ago', type: 'info' as const },
    { id: 4, message: 'New exam scheduled: BIO101', time: '1 hr ago', type: 'default' as const },
  ];

  const getStatusBadge = (status: string) => {
    if (status === 'active') return <Badge variant="success" dot>Active</Badge>;
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
      className="space-y-6"
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

      {/* Spotlight KPI Stats grid */}
      <motion.div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" variants={itemVariants}>
        {stats.map((stat) => {
          const StatIcon = stat.icon;
          return (
            <SpotlightCard key={stat.title}>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
                </div>
                <div className={`rounded-xl p-2.5 ${stat.bgColor}`}>
                  <StatIcon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs">
                {stat.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-success dark:text-emerald-400" />
                ) : (
                  <TrendingUp className="h-3 w-3 text-slate-400 rotate-180" />
                )}
                <span className="text-slate-500 dark:text-slate-400">{stat.change}</span>
              </div>
            </SpotlightCard>
          );
        })}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Examinations table */}
        <motion.div className="lg:col-span-2" variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Active Examinations</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                onClick={() => navigate('/live-monitoring')}
              >
                View all
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-olive/10 dark:border-slate-800">
                      <th className="pb-3 font-medium text-slate-500 dark:text-slate-400">Exam</th>
                      <th className="pb-3 font-medium text-slate-500 dark:text-slate-400">Location</th>
                      <th className="pb-3 font-medium text-slate-500 dark:text-slate-400 hidden sm:table-cell">Time</th>
                      <th className="pb-3 font-medium text-slate-500 dark:text-slate-400">Cameras</th>
                      <th className="pb-3 font-medium text-slate-500 dark:text-slate-400">Alerts</th>
                      <th className="pb-3 font-medium text-slate-500 dark:text-slate-400">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-olive/10 dark:divide-slate-800">
                    {recentExams.map((exam) => (
                      <tr key={exam.id} className="group hover:bg-secondary-bg/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3.5 font-medium text-slate-900 dark:text-slate-100">{exam.name}</td>
                        <td className="py-3.5 text-slate-600 dark:text-slate-300">{exam.location}</td>
                        <td className="py-3.5 text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {exam.time}
                          </span>
                        </td>
                        <td className="py-3.5 text-slate-600 dark:text-slate-300">{exam.cameras}</td>
                        <td className="py-3.5">
                          {exam.alerts > 0 ? (
                            <span className="flex items-center gap-1 text-highlight dark:text-amber-400 font-medium">
                              <AlertTriangle className="h-4 w-4" /> {exam.alerts}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-success dark:text-emerald-400">
                              <CheckCircle className="h-4 w-4" /> 0
                            </span>
                          )}
                        </td>
                        <td className="py-3.5">{getStatusBadge(exam.status)}</td>
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
          {/* Recent Activity with AnimatedList */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary dark:text-emerald-400" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatedList>
                {recentActivity.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-1">
                    <div className="mt-1">
                      <Badge variant={item.type} dot className="border-0 bg-transparent px-0 py-0">
                        <span className="sr-only">{item.type}</span>
                      </Badge>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug">{item.message}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </AnimatedList>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Server Load', value: 32, color: 'bg-success' },
                { label: 'Storage', value: 68, color: 'bg-warning' },
                { label: 'AI Model', value: 100, color: 'bg-primary dark:bg-emerald-500', statusText: 'Online' },
                { label: 'Network', value: 94, color: 'bg-success', statusText: 'Stable' },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {item.statusText || `${item.value}%`}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary-bg dark:bg-slate-800 overflow-hidden">
                    <motion.div
                      className={`h-1.5 rounded-full ${item.color}`}
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
    </motion.div>
  );
}
