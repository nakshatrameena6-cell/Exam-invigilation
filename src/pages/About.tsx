import { PageHeader } from '../components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { Shield, Eye, Server, Zap, Cpu, Lock, CheckCircle2 } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: Eye,
      title: 'Computer Vision AI',
      desc: 'Real-time detection of unusual head pose, phone usage, multiple faces, and unauthorized objects during exams.',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      desc: 'Role-based access control with AES-256 encrypted video storage and strict institutional privacy compliance.',
    },
    {
      icon: Zap,
      title: 'Instant Proctor Alerts',
      desc: 'Real-time notifications sent directly to invigilators when suspicious behaviors breach confidence thresholds.',
    },
    {
      icon: Server,
      title: 'Scalable Architecture',
      desc: 'Distributed multi-channel streaming engine capable of monitoring hundreds of simultaneous examination halls.',
    },
  ];

  const specs = [
    { label: 'Core Framework', value: 'React 18 + TypeScript' },
    { label: 'Build Tool', value: 'Vite' },
    { label: 'Styling System', value: 'Tailwind CSS (Vanilla Custom Palette)' },
    { label: 'Routing Engine', value: 'React Router DOM v6' },
    { label: 'Iconography', value: 'Lucide React' },
    { label: 'Animation Engine', value: 'Framer Motion' },
    { label: 'State Management', value: 'React Context API' },
    { label: 'API Client', value: 'Axios (Configured)' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="About ExamEye Monitoring System"
        description="AI-Based Smart Examination Surveillance Platform"
        breadcrumb={[{ label: 'About' }]}
      />

      {/* Main hero card */}
      <Card>
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white flex-shrink-0 shadow-md">
              <Eye className="h-8 w-8" />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Intelligent Examination Monitoring Infrastructure
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                ExamEye is a modern enterprise-grade proctoring solution designed for universities and academic testing centers. Built with modular frontend architecture and clean color system, it empowers invigilators to monitor live video feeds, receive automated anomaly notifications, and generate verified integrity reports.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {['75% White Primary', 'Forest Green Accent', 'Zero Glassmorphism', 'Enterprise Grade'].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-bg text-primary text-xs font-semibold"
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

      {/* Feature cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const FeatureIcon = feature.icon;
          return (
            <Card key={feature.title} hover>
              <CardContent className="p-5 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-bg text-primary">
                  <FeatureIcon className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">{feature.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tech Spec Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-primary" />
            Technical Architecture Specifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {specs.map((item) => (
              <div
                key={item.label}
                className="flex flex-col justify-between rounded-xl border border-olive/15 p-3.5 bg-white shadow-xs"
              >
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{item.label}</span>
                <span className="text-sm font-semibold text-slate-900 mt-1">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
