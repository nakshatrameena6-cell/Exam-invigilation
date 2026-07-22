import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Upload, FileVideo, X, CheckCircle2, AlertCircle, Play, ShieldAlert, Cpu, Sparkles, Sliders } from 'lucide-react';

interface UploadItem {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  examHall: string;
  analysisType: 'full' | 'anomaly_only' | 'attendance';
}

export default function UploadVideo() {
  const [dragActive, setDragActive] = useState(false);
  const [queue, setQueue] = useState<UploadItem[]>([]);
  const [selectedHall, setSelectedHall] = useState('Hall A - Main Examination');
  const [selectedAnalysis, setSelectedAnalysis] = useState<'full' | 'anomaly_only' | 'attendance'>('full');

  const addFilesToQueue = (fileList: FileList | File[]) => {
    const newItems: UploadItem[] = Array.from(fileList).map((file, i) => ({
      id: `${Date.now()}-${i}`,
      file,
      progress: 0,
      status: 'pending',
      examHall: selectedHall,
      analysisType: selectedAnalysis,
    }));
    setQueue((prev) => [...prev, ...newItems]);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files?.length) {
        addFilesToQueue(e.dataTransfer.files);
      }
    },
    [selectedHall, selectedAnalysis],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      addFilesToQueue(e.target.files);
    }
  };

  const removeItem = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const startUpload = (id: string) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'uploading', progress: 10 } : item)),
    );

    let currentProgress = 10;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 25) + 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setQueue((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: 'completed', progress: 100 } : item,
          ),
        );
      } else {
        setQueue((prev) =>
          prev.map((item) => (item.id === id ? { ...item, progress: currentProgress } : item)),
        );
      }
    }, 400);
  };

  const uploadAll = () => {
    queue.filter((q) => q.status === 'pending').forEach((item) => startUpload(item.id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      <PageHeader
        title="Upload Examination Video"
        description="Upload offline CCTV footage for asynchronous SecureX AI anomaly detection & behavior analysis"
        breadcrumb={[{ label: 'Upload Video' }]}
      />

      {/* Analysis Settings Bar */}
      <Card className="border-emerald-500/20 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sliders className="h-5 w-5 text-emerald-500" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              AI Detection Configuration Profile
            </h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Target Examination Hall
              </label>
              <select
                value={selectedHall}
                onChange={(e) => setSelectedHall(e.target.value)}
                className="input-field border-emerald-500/30"
              >
                <option value="Hall A - Main Examination">Hall A - Main Examination</option>
                <option value="Hall B - Science Block">Hall B - Science Block</option>
                <option value="Lab 3 - Computer Science">Lab 3 - Computer Science</option>
                <option value="Auditorium - Engineering">Auditorium - Engineering</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                AI Detection Profile
              </label>
              <select
                value={selectedAnalysis}
                onChange={(e) => setSelectedAnalysis(e.target.value as any)}
                className="input-field border-emerald-500/30"
              >
                <option value="full">Full Analysis (Behavior, Talking, & Attendance)</option>
                <option value="anomaly_only">Anomaly & Head Pose/Talking Only</option>
                <option value="attendance">Student Verification & Attendance Roster Only</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vibrant Drag and Drop Box */}
      <Card className="border-cyan-500/30 shadow-lg overflow-hidden">
        <CardContent className="p-8">
          <div
            className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-all ${
              dragActive
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 scale-[1.01]'
                : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/20 dark:hover:bg-slate-900/60'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30">
              <Upload className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Drag & Drop CCTV Footage Files</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              Select or drop your examination camera recordings to run automated SecureX AI computer vision scans.
            </p>
            <div className="mt-4 flex items-center gap-3 text-xs font-semibold text-slate-500">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 font-mono">
                <FileVideo className="h-3.5 w-3.5" /> MP4, AVI, MOV, MKV
              </span>
              <span>•</span>
              <span className="font-mono">Up to 2GB per file</span>
            </div>

            <input
              type="file"
              accept="video/*"
              multiple
              onChange={handleFileInput}
              className="hidden"
              id="video-upload-input"
            />
            <label htmlFor="video-upload-input" className="mt-6 inline-block">
              <Button type="button" className="btn-primary">
                Browse Video Files
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* File Queue List */}
      {queue.length > 0 && (
        <Card className="border-purple-500/30 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-extrabold">
              <Cpu className="h-5 w-5 text-purple-500" />
              Uploaded Video Processing Queue ({queue.length})
            </CardTitle>
            {queue.some((item) => item.status === 'pending') && (
              <Button size="sm" onClick={uploadAll} leftIcon={<Play className="h-3.5 w-3.5" />}>
                Process All Videos
              </Button>
            )}
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {queue.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/40"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                      <FileVideo className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                        {item.file.name}
                      </p>
                      <p className="text-xs text-slate-400 font-mono">
                        {formatFileSize(item.file.size)} • {item.examHall}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {item.status === 'pending' && (
                      <Button size="sm" variant="secondary" onClick={() => startUpload(item.id)}>
                        Analyze Now
                      </Button>
                    )}
                    {item.status === 'uploading' && (
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 transition-all duration-300"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-500">{item.progress}%</span>
                      </div>
                    )}
                    {item.status === 'completed' && (
                      <Badge variant="success" className="text-xs font-bold">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Analysis Ready
                      </Badge>
                    )}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
