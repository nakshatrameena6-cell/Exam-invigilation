import { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { SpotlightCard } from '../components/common/SpotlightCard';
import { PillNav } from '../components/common/PillNav';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import {
  Download, Search, FileText,
  AlertTriangle, Eye, ShieldCheck,
} from 'lucide-react';

interface Report {
  id: string;
  title: string;
  exam: string;
  date: string;
  type: 'anomaly' | 'attendance' | 'behavior';
  status: 'ready' | 'processing' | 'failed';
  flaggedCount: number;
  totalStudents: number;
  duration: string;
}

const mockReports: Report[] = [
  {
    id: 'RPT-2026-001',
    title: 'CS101 - Anomaly & Integrity Log',
    exam: 'CS101 - Data Structures',
    date: '2026-07-20',
    type: 'anomaly',
    status: 'ready',
    flaggedCount: 3,
    totalStudents: 120,
    duration: '2h 00m',
  },
  {
    id: 'RPT-2026-002',
    title: 'PHY201 - Facial Verification Summary',
    exam: 'PHY201 - Mechanics',
    date: '2026-07-20',
    type: 'attendance',
    status: 'ready',
    flaggedCount: 0,
    totalStudents: 85,
    duration: '1h 30m',
  },
  {
    id: 'RPT-2026-003',
    title: 'MTH301 - Behavioral Analysis Report',
    exam: 'MTH301 - Calculus',
    date: '2026-07-19',
    type: 'behavior',
    status: 'processing',
    flaggedCount: 1,
    totalStudents: 95,
    duration: '3h 00m',
  },
  {
    id: 'RPT-2026-004',
    title: 'ENG102 - Proctoring Security Summary',
    exam: 'ENG102 - Technical Writing',
    date: '2026-07-19',
    type: 'anomaly',
    status: 'ready',
    flaggedCount: 2,
    totalStudents: 110,
    duration: '1h 45m',
  },
  {
    id: 'RPT-2026-005',
    title: 'CHEM101 - Organic Chemistry Attendance',
    exam: 'CHEM101 - Organic Chem',
    date: '2026-07-18',
    type: 'attendance',
    status: 'failed',
    flaggedCount: 0,
    totalStudents: 75,
    duration: '2h 15m',
  },
];

export default function Reports() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [activeModalReport, setActiveModalReport] = useState<Report | null>(null);

  const filterTabs = [
    { id: 'all', label: 'All Types' },
    { id: 'anomaly', label: 'Anomalies' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'behavior', label: 'Behavioral' },
  ];

  const filteredReports = mockReports.filter((report) => {
    const matchesType = selectedType === 'all' || report.type === selectedType;
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.exam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'ready':
        return <Badge variant="success" dot>Ready</Badge>;
      case 'processing':
        return <Badge variant="warning">Processing</Badge>;
      case 'failed':
        return <Badge variant="danger">Failed</Badge>;
    }
  };

  const getTypeBadge = (type: Report['type']) => {
    switch (type) {
      case 'anomaly':
        return <Badge variant="warning">Anomaly Detection</Badge>;
      case 'attendance':
        return <Badge variant="info">Attendance Verification</Badge>;
      case 'behavior':
        return <Badge variant="success">Behavioral Analysis</Badge>;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Examination Reports & Analytics"
        description="View and download comprehensive SecureX AI-generated proctoring logs and anomaly audits."
        breadcrumb={[{ label: 'Reports' }]}
        actions={
          <Button variant="secondary" size="sm" leftIcon={<Download className="h-4 w-4" />}>
            Export Summary (CSV)
          </Button>
        }
      />

      {/* Summary Spotlight KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-emerald-500/30 bg-white dark:bg-slate-900 p-5 shadow-glow transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Reports
              </p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{mockReports.length}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-emerald-500" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-white dark:bg-slate-900 p-5 shadow-glow-gold transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Anomalies Flagged
              </p>
              <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">6 Events</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-purple-500/30 bg-white dark:bg-slate-900 p-5 shadow-glow-purple transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Integrity Index
              </p>
              <p className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">98.8% Clear</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Reports Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>All Generated Audit Reports</CardTitle>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search report title or exam..."
                className="input-field pl-9 py-2 text-xs"
              />
            </div>

            {/* Segmented PillNav */}
            <PillNav
              tabs={filterTabs}
              activeId={selectedType}
              onChange={(id) => setSelectedType(id)}
            />
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-olive/10 dark:border-slate-800">
                  <th className="pb-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Report ID</th>
                  <th className="pb-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Title</th>
                  <th className="pb-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Exam</th>
                  <th className="pb-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Type</th>
                  <th className="pb-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Date</th>
                  <th className="pb-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Status</th>
                  <th className="pb-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-olive/10 dark:divide-slate-800">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-secondary-bg/30 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 font-mono text-xs text-slate-500 dark:text-slate-400">{report.id}</td>
                    <td className="py-3.5 font-medium text-slate-900 dark:text-slate-100">{report.title}</td>
                    <td className="py-3.5 text-slate-600 dark:text-slate-300 text-xs">{report.exam}</td>
                    <td className="py-3.5">{getTypeBadge(report.type)}</td>
                    <td className="py-3.5 text-slate-500 dark:text-slate-400 text-xs">{report.date}</td>
                    <td className="py-3.5">{getStatusBadge(report.status)}</td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setActiveModalReport(report)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary dark:text-emerald-400 hover:text-primary-hover hover:bg-secondary-bg dark:hover:bg-slate-800 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </button>
                        {report.status === 'ready' && (
                          <button className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-emerald-400 hover:bg-secondary-bg dark:hover:bg-slate-800 px-2.5 py-1 rounded-lg transition-colors">
                            <Download className="h-3.5 w-3.5" /> PDF
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {activeModalReport && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModalReport(null)}
          title={`Report Details: ${activeModalReport.id}`}
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">{activeModalReport.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{activeModalReport.exam}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-secondary-bg/40 dark:bg-slate-800/60 p-3.5 rounded-xl text-xs">
              <div>
                <span className="text-slate-400 block">Date</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{activeModalReport.date}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Duration</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{activeModalReport.duration}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Students</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{activeModalReport.totalStudents}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Flags Detected</span>
                <span className="font-semibold text-highlight dark:text-amber-400">{activeModalReport.flaggedCount}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">AI Audit Summary</h5>
              <div className="rounded-xl border border-olive/15 dark:border-slate-800 p-3.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900">
                The automated computer vision model completed scanning footage for {activeModalReport.exam}. Key flags evaluated: {activeModalReport.flaggedCount > 0 ? `${activeModalReport.flaggedCount} potential anomalies verified by proctors.` : 'Zero integrity breaches detected.'} Full biometric posture & head pose logs archived.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-olive/10 dark:border-slate-800">
              <Button variant="ghost" size="sm" onClick={() => setActiveModalReport(null)}>
                Close
              </Button>
              {activeModalReport.status === 'ready' && (
                <Button size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>
                  Download Full PDF Report
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
