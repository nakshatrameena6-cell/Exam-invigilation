import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Upload, FileVideo, X, CheckCircle2, AlertCircle, Play, ShieldAlert, Cpu } from 'lucide-react';

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

    // Simulate progress
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
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Upload Examination Video"
        description="Upload offline CCTV footage for asynchronous AI anomaly detection & behavior analysis"
        breadcrumb={[{ label: 'Upload Video' }]}
      />

      {/* Analysis Settings Bar */}
      <Card>
        <CardContent className="p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Target Examination Hall
              </label>
              <select
                value={selectedHall}
                onChange={(e) => setSelectedHall(e.target.value)}
                className="input-field"
              >
                <option value="Hall A - Main Examination">Hall A - Main Examination</option>
                <option value="Hall B - Science Block">Hall B - Science Block</option>
                <option value="Lab 3 - Computer Science">Lab 3 - Computer Science</option>
                <option value="Auditorium - Engineering">Auditorium - Engineering</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                AI Detection Profile
              </label>
              <select
                value={selectedAnalysis}
                onChange={(e) => setSelectedAnalysis(e.target.value as any)}
                className="input-field"
              >
                <option value="full">Full Analysis (Behavior, Anomaly & Attendance)</option>
                <option value="anomaly_only">Anomaly & Suspicious Movement Only</option>
                <option value="attendance">Student Verification & Attendance Only</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drag and Drop Box */}
      <Card>
        <CardContent className="p-6">
          <div
            className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-all ${
              dragActive
                ? 'border-primary bg-secondary-bg/80 scale-[1.01]'
                : 'border-olive/30 hover:border-olive/60 hover:bg-secondary-bg/20'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary-bg text-primary shadow-sm">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Drag & Drop CCTV Footage Files</h3>
            <p className="mt-1.5 text-sm text-slate-500 max-w-sm">
              Select or drop your examination camera recordings to run automated AI computer vision scans.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1">
                <FileVideo className="h-3.5 w-3.5 text-primary" /> Supports MP4, AVI, MOV, MKV
              </span>
              <span>•</span>
              <span>Up to 2GB per file</span>
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
              <Button variant="secondary" type="button">
                Browse Video Files
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* File Queue List */}
      {queue.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" />
              Upload Queue ({queue.length})
            </CardTitle>
            {queue.some((item) => item.status === 'pending') && (
              <Button size="sm" onClick={uploadAll} leftIcon={<Play className="h-3.5 w-3.5" />}>
                Upload All
              </Button>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            <AnimatePresence>
              {queue.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="rounded-xl border border-olive/15 p-4 bg-white shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-secondary-bg text-primary">
                        <FileVideo className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {item.file.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <span>{formatFileSize(item.file.size)}</span>
                          <span>•</span>
                          <span>{item.examHall}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {item.status === 'completed' && (
                        <Badge variant="success" dot>
                          Ready for AI Scan
                        </Badge>
                      )}
                      {item.status === 'uploading' && (
                        <Badge variant="warning">Uploading {item.progress}%</Badge>
                      )}
                      {item.status === 'pending' && <Badge variant="default">Queued</Badge>}

                      {item.status === 'pending' && (
                        <Button size="sm" onClick={() => startUpload(item.id)}>
                          Upload
                        </Button>
                      )}

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                        title="Remove file"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {item.status === 'uploading' && (
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="bg-primary h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
