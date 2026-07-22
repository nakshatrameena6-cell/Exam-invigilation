import { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardContent } from '../components/common/Card';
import { PillNav } from '../components/common/PillNav';
import { ExpandableCard } from '../components/common/ExpandableCard';
import { HelpCircle, Search, Shield, Video, FileText, Server } from 'lucide-react';

interface FAQItem {
  id: string;
  category: 'general' | 'technical' | 'privacy';
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: '1',
    category: 'general',
    question: 'How does the AI detection system work?',
    answer: 'Our system uses state-of-the-art computer vision models trained specifically on examination room dynamics. It detects unusual head movements, mobile phone usage, unauthorized materials, and multiple faces in real time. Each event is assigned a confidence score and recorded for proctor review.',
  },
  {
    id: '2',
    category: 'general',
    question: 'Can I monitor multiple examination halls simultaneously?',
    answer: 'Yes. The Live Monitoring dashboard supports multi-channel streaming. You can view all live feeds on a single grid screen, filter feeds by hall, and automatically receive highlight alerts when anomalies are detected.',
  },
  {
    id: '3',
    category: 'technical',
    question: 'What video file formats and resolution are supported for upload?',
    answer: 'We support standard video container formats including MP4, AVI, and MOV with resolutions up to 4K. Upload file sizes up to 2GB per video are processed asynchronously with full AI anomaly playback logs.',
  },
  {
    id: '4',
    category: 'technical',
    question: 'What hardware requirements are needed for live camera integration?',
    answer: 'ExamEye interfaces with standard RTSP/ONVIF IP cameras or webcams without specialized hardware. Minimum recommended camera resolution is 1080p at 30 FPS under adequate hall lighting.',
  },
  {
    id: '5',
    category: 'privacy',
    question: 'Is student data and video footage securely stored?',
    answer: 'All video streams and metadata are encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. Access is strictly role-gated, and retention periods can be customized according to institutional privacy standards.',
  },
  {
    id: '6',
    category: 'privacy',
    question: 'Is the system compliant with university privacy regulations?',
    answer: 'Yes, ExamEye is designed around Privacy-by-Design principles. It complies with major data protection frameworks by isolating sensitive biometric vector computations and offering complete audit logs for all proctoring interventions.',
  },
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categoryTabs = [
    { id: 'all', label: 'All Questions', icon: <HelpCircle className="h-3.5 w-3.5" /> },
    { id: 'general', label: 'General', icon: <Video className="h-3.5 w-3.5" /> },
    { id: 'technical', label: 'Technical', icon: <Server className="h-3.5 w-3.5" /> },
    { id: 'privacy', label: 'Privacy & Security', icon: <Shield className="h-3.5 w-3.5" /> },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Frequently Asked Questions"
        description="Find answers to common questions about ExamEye AI monitoring system"
        breadcrumb={[{ label: 'FAQ' }]}
      />

      {/* Search and Segmented PillNav */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions or keywords..."
            className="input-field pl-10"
          />
        </div>

        {/* PillNav filter */}
        <PillNav
          tabs={categoryTabs}
          activeId={activeCategory}
          onChange={(id) => setActiveCategory(id)}
        />
      </div>

      {/* FAQ Accordion using ExpandableCard */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <HelpCircle className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-base font-semibold text-slate-700 dark:text-slate-300">No matching questions found</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Try adjusting your search term or category filter.</p>
            </CardContent>
          </Card>
        ) : (
          filteredFaqs.map((faq, i) => (
            <ExpandableCard
              key={faq.id}
              title={faq.question}
              defaultExpanded={i === 0}
              badge={
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-secondary-bg text-primary dark:bg-slate-800 dark:text-emerald-400 font-semibold">
                  {faq.category}
                </span>
              }
            >
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-2">
                {faq.answer}
              </p>
            </ExpandableCard>
          ))
        )}
      </div>
    </div>
  );
}
