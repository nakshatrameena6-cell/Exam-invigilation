import { PageHeader } from '../components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { Shield, Eye, Server, Zap, Cpu, Lock, CheckCircle2, Users } from 'lucide-react';
import ChromaGrid from '../components/reactbits/ChromaGrid';

export default function About() {
  const features = [
    {
      icon: Eye,
      title: 'Computer Vision AI',
      desc: 'Real-time detection of talking, head pose anomalies, and unauthorized objects during exams.',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      desc: 'Role-based access control with AES-256 encrypted video storage and institutional privacy compliance.',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
    },
    {
      icon: Zap,
      title: 'Instant Proctor Alerts',
      desc: 'Real-time notifications sent directly to invigilators when suspicious behaviors breach thresholds.',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
    },
    {
      icon: Server,
      title: 'Scalable Architecture',
      desc: 'Distributed multi-channel streaming engine monitoring hundreds of simultaneous examination halls.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
    },
  ];

  const specs = [
    { label: 'Core Framework', value: 'React 18 + TypeScript', color: 'border-emerald-500/30' },
    { label: 'Build Tool', value: 'Vite 6', color: 'border-cyan-500/30' },
    { label: 'Styling System', value: 'Tailwind CSS', color: 'border-amber-500/30' },
    { label: 'Routing Engine', value: 'React Router v6', color: 'border-purple-500/30' },
    { label: 'Iconography', value: 'Lucide React', color: 'border-rose-500/30' },
    { label: 'Animation Engine', value: 'Framer Motion', color: 'border-indigo-500/30' },
    { label: 'State Management', value: 'React Context API', color: 'border-teal-500/30' },
    { label: 'UI Library', value: 'ReactBits Components', color: 'border-blue-500/30' },
  ];

  const teamMembers = [
    { image: 'https://i.pravatar.cc/300?img=8', title: 'Nakshatra', subtitle: 'Full Stack Developer', handle: '@nakshatra', borderColor: '#10b981', gradient: 'linear-gradient(145deg, #10b98122, #0f172a)' },
    { image: 'https://i.pravatar.cc/300?img=11', title: 'Priya Sharma', subtitle: 'AI/ML Engineer', handle: '@priyasharma', borderColor: '#06b6d4', gradient: 'linear-gradient(210deg, #06b6d422, #0f172a)' },
    { image: 'https://i.pravatar.cc/300?img=3', title: 'Arjun Patel', subtitle: 'Backend Engineer', handle: '@arjunpatel', borderColor: '#8b5cf6', gradient: 'linear-gradient(165deg, #8b5cf622, #0f172a)' },
    { image: 'https://i.pravatar.cc/300?img=16', title: 'Kavya Nair', subtitle: 'UI/UX Designer', handle: '@kavyanair', borderColor: '#f59e0b', gradient: 'linear-gradient(195deg, #f59e0b22, #0f172a)' },
    { image: 'https://i.pravatar.cc/300?img=25', title: 'Rohan Gupta', subtitle: 'DevOps Engineer', handle: '@rohangupta', borderColor: '#f43f5e', gradient: 'linear-gradient(225deg, #f43f5e22, #0f172a)' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      <PageHeader
        title="About SecureX"
        description="AI-Powered Exam Monitoring. | Fairness Ensured."
        breadcrumb={[{ label: 'About' }]}
      />

      {/* Hero Card */}
      <Card className="border-emerald-500/20 shadow-lg overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0">
              <img src="/logo.png" alt="SecureX Logo" className="h-20 w-auto rounded-2xl drop-shadow-lg" />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Intelligent Examination Monitoring Infrastructure
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">
                SecureX is a modern enterprise-grade proctoring solution designed for universities and academic testing centers. Built with modular frontend architecture and a vibrant color system, it empowers invigilators to monitor live video feeds, receive automated anomaly notifications, and generate verified integrity reports.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {['AI Vision Engine', 'Emerald + Cyber Palette', 'ReactBits Components', 'Enterprise Grade'].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color-coded Feature cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const FeatureIcon = feature.icon;
          return (
            <Card key={feature.title} className={`border ${feature.borderColor} hover:-translate-y-1 transition-all duration-300`}>
              <CardContent className="p-5 text-center space-y-3">
                <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${feature.bgColor}`}>
                  <FeatureIcon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ReactBits ChromaGrid — Team */}
      <Card className="border-cyan-500/20 shadow-lg overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-extrabold">
            <Users className="h-5 w-5 text-cyan-500" />
            SecureX Development Team
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5 pb-5 bg-slate-950 rounded-b-2xl">
          <ChromaGrid items={teamMembers} />
        </CardContent>
      </Card>

      {/* Tech Spec Card */}
      <Card className="border-purple-500/20 shadow-lg">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-extrabold">
            <Cpu className="h-5 w-5 text-purple-500" />
            Technical Architecture Specifications
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {specs.map((item) => (
              <div
                key={item.label}
                className={`flex flex-col justify-between rounded-xl border ${item.color} p-4 bg-white dark:bg-slate-900/60 shadow-xs hover:shadow-md transition-all`}
              >
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{item.label}</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white mt-1">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
