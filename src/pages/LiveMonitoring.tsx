import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { BorderGlow } from '../components/common/BorderGlow';
import { AnimatedList } from '../components/common/AnimatedList';
import { Carousel } from '../components/common/Carousel';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import {
  Video, Maximize, Minimize, AlertTriangle, Circle,
  Camera, MicOff, Volume2, Clock, Image, ShieldAlert,
  Cpu, CheckCircle2, UserX, Smartphone, Play, Pause, RefreshCw, Scan
} from 'lucide-react';

interface CameraFeed {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'recording';
  recording: boolean;
  alerts: number;
  videoUrl: string;
  poster: string;
  anomalyType?: 'critical' | 'warning' | 'none';
}

interface Anomaly {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  camera: string;
  studentId: string;
  timestamp: string;
  confidence: number;
  actionTaken?: boolean;
}

const cameraFeeds: CameraFeed[] = [
  {
    id: 'CAM-001',
    name: 'Hall A — Front Desk Rows',
    location: 'Examination Hall A',
    status: 'recording',
    recording: true,
    alerts: 0,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-students-sitting-at-desks-in-a-classroom-43187-large.mp4',
    poster: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80',
    anomalyType: 'none',
  },
  {
    id: 'CAM-002',
    name: 'Hall A — Rear Surveillance',
    location: 'Examination Hall A',
    status: 'recording',
    recording: true,
    alerts: 1,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-female-student-reading-in-a-library-41541-large.mp4',
    poster: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
    anomalyType: 'warning',
  },
  {
    id: 'CAM-003',
    name: 'Hall B — Center Aisle Flagged',
    location: 'Examination Hall B',
    status: 'recording',
    recording: true,
    alerts: 2,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-people-working-in-a-modern-office-4328-large.mp4',
    poster: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    anomalyType: 'critical',
  },
  {
    id: 'CAM-004',
    name: 'Hall B — Entry Bay',
    location: 'Examination Hall B',
    status: 'online',
    recording: false,
    alerts: 0,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-students-walking-in-a-university-hallway-4412-large.mp4',
    poster: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80',
    anomalyType: 'none',
  },
  {
    id: 'CAM-005',
    name: 'Lab 3 — Workstation Typing',
    location: 'Computer Lab 3',
    status: 'recording',
    recording: true,
    alerts: 0,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-person-typing-on-a-laptop-42930-large.mp4',
    poster: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
    anomalyType: 'none',
  },
  {
    id: 'CAM-006',
    name: 'Lab 3 — Terminal Beta',
    location: 'Computer Lab 3',
    status: 'offline',
    recording: false,
    alerts: 0,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-working-on-her-laptop-in-an-office-42798-large.mp4',
    poster: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    anomalyType: 'none',
  },
];

const initialAnomalies: Anomaly[] = [
  {
    id: 'ANO-8941',
    severity: 'critical',
    title: 'Unauthorized Mobile Phone Detected',
    description: 'Object detection model flagged mobile device under desk at Hall B Center Aisle.',
    camera: 'Hall B — Center Aisle (CAM-003)',
    studentId: 'STU-2024-88',
    timestamp: '10:48:22 AM',
    confidence: 94.8,
  },
  {
    id: 'ANO-8940',
    severity: 'warning',
    title: 'Persistent Off-Angle Head Pose',
    description: 'Candidate turned head > 60° to the right for 14 consecutive seconds.',
    camera: 'Hall A — Rear View (CAM-002)',
    studentId: 'STU-2024-42',
    timestamp: '10:45:09 AM',
    confidence: 88.3,
  },
  {
    id: 'ANO-8939',
    severity: 'warning',
    title: 'Multiple Face Bounding Boxes in Frame',
    description: 'Second face detected in background frame near aisle row 3.',
    camera: 'Hall B — Center Aisle (CAM-003)',
    studentId: 'STU-2024-91',
    timestamp: '10:39:50 AM',
    confidence: 91.2,
  },
  {
    id: 'ANO-8938',
    severity: 'info',
    title: 'Biometric Face Verification Confirmed',
    description: 'Biometric match score 99.4% confirmed against candidate hall ticket.',
    camera: 'Lab 3 — Station Alpha (CAM-005)',
    studentId: 'STU-2024-12',
    timestamp: '10:30:15 AM',
    confidence: 99.4,
    actionTaken: true,
  },
];

const mockSnapshots = [
  { id: 's1', time: '10:48 AM', label: 'Mobile Device Detected — Desk #14', confidence: '94.8%', severity: 'critical', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80' },
  { id: 's2', time: '10:45 AM', label: 'Head Pose Warning — Seat #22', confidence: '88.3%', severity: 'warning', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80' },
  { id: 's3', time: '10:39 AM', label: 'Secondary Person in Frame', confidence: '91.2%', severity: 'warning', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=400&q=80' },
  { id: 's4', time: '10:30 AM', label: 'Identity Verification Success', confidence: '99.4%', severity: 'info', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=400&q=80' },
  { id: 's5', time: '10:15 AM', label: 'Rapid Head Gaze Shift Alert', confidence: '85.1%', severity: 'warning', url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=400&q=80' },
];

/* ── SVG Real-Time AI Detection Overlay ─────────── */
function AiDetectionOverlay({ feed }: { feed: CameraFeed }) {
  const isCritical = feed.anomalyType === 'critical';
  const isWarning = feed.anomalyType === 'warning';

  return (
    <svg className="absolute inset-0 h-full w-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
      {/* Scanning laser line */}
      <motion.line
        x1="0"
        y1="0"
        x2="100"
        y2="0"
        stroke={isCritical ? '#ef4444' : isWarning ? '#eab308' : '#10b981'}
        strokeWidth="0.5"
        strokeOpacity="0.7"
        animate={{ y1: [0, 100, 0], y2: [0, 100, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      {/* Primary Face & Body Bounding Box 1 */}
      <motion.rect
        x="22"
        y="25"
        width="26"
        height="48"
        fill="none"
        stroke={isWarning ? '#eab308' : '#10b981'}
        strokeWidth="0.8"
        strokeDasharray="2 1"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <text x="22" y="22" fill={isWarning ? '#facc15' : '#34d399'} fontSize="2.8" fontFamily="monospace" fontWeight="bold">
        {isWarning ? '⚠️ STU-42 (HEAD POSE 45° R)' : '✅ STU-01 (VERIFIED 99.2%)'}
      </text>

      {/* Secondary Bounding Box / Critical Alert Box */}
      <motion.g animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.5, repeat: Infinity }}>
        <rect
          x="58"
          y="32"
          width="24"
          height="44"
          fill={isCritical ? 'rgba(239, 68, 68, 0.15)' : 'none'}
          stroke={isCritical ? '#ef4444' : '#10b981'}
          strokeWidth={isCritical ? '1.2' : '0.8'}
        />
        {/* Corner brackets */}
        <path d="M58 36 L58 32 L62 32" fill="none" stroke={isCritical ? '#ef4444' : '#10b981'} strokeWidth="1.5" />
        <path d="M78 32 L82 32 L82 36" fill="none" stroke={isCritical ? '#ef4444' : '#10b981'} strokeWidth="1.5" />
        <path d="M82 72 L82 76 L78 76" fill="none" stroke={isCritical ? '#ef4444' : '#10b981'} strokeWidth="1.5" />
        <path d="M62 76 L58 76 L58 72" fill="none" stroke={isCritical ? '#ef4444' : '#10b981'} strokeWidth="1.5" />

        <text x="58" y="29" fill={isCritical ? '#f87171' : '#34d399'} fontSize="2.8" fontFamily="monospace" fontWeight="bold">
          {isCritical ? '🚨 PHONE DETECTED [94.8%]' : '✅ STU-02 (VERIFIED 98.5%)'}
        </text>
      </motion.g>

      {/* Small phone target box if critical */}
      {isCritical && (
        <motion.rect
          x="66"
          y="62"
          width="8"
          height="12"
          fill="rgba(239, 68, 68, 0.4)"
          stroke="#ef4444"
          strokeWidth="1"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </svg>
  );
}

export default function LiveMonitoring() {
  const [selectedFeed, setSelectedFeed] = useState<CameraFeed>(cameraFeeds[0]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>(initialAnomalies);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning'>('all');

  const videoRef = useRef<HTMLVideoElement>(null);

  const onlineCount = cameraFeeds.filter((f) => f.status !== 'offline').length;
  const activeAlertsCount = anomalies.filter((a) => !a.actionTaken).length;

  const handleActionTaken = (id: string) => {
    setAnomalies((prev) =>
      prev.map((item) => (item.id === id ? { ...item, actionTaken: true } : item))
    );
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const filteredAnomalies = anomalies.filter((a) =>
    filterSeverity === 'all' ? true : a.severity === filterSeverity
  );

  return (
    <div className="space-y-6 font-sans select-none">
      <PageHeader
        title="Live Surveillance & AI Anomaly Stream"
        description="Real-time exam room stock video streams, AI face & phone tracking overlays, live telemetry"
        breadcrumb={[{ label: 'Live Monitoring' }]}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="success" dot>{onlineCount}/{cameraFeeds.length} Active Feeds</Badge>
            <Badge variant="warning">{activeAlertsCount} Unresolved Flags</Badge>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
              onClick={() => setAnomalies(initialAnomalies)}
            >
              Reset Stream
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Stock Video Feed Viewer */}
        <Card className="lg:col-span-2 overflow-hidden shadow-lg">
          <CardContent className="p-0">
            <div className={`aspect-video w-full bg-slate-950 relative overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen w-screen' : 'rounded-t-2xl'}`}>

              {/* Real HTML5 Stock MP4 Video Stream */}
              {selectedFeed.status === 'offline' ? (
                <div className="flex h-full w-full flex-col items-center justify-center bg-slate-900 text-slate-400 p-6 text-center">
                  <Video className="h-16 w-16 mb-3 opacity-30" />
                  <p className="text-lg font-mono font-bold text-white">CAMERA SIGNAL OFFLINE</p>
                  <p className="text-xs text-slate-400 mt-1">{selectedFeed.id} — {selectedFeed.location}</p>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  key={selectedFeed.videoUrl}
                  src={selectedFeed.videoUrl}
                  poster={selectedFeed.poster}
                  autoPlay
                  loop
                  muted={!audioEnabled}
                  playsInline
                  className="h-full w-full object-cover"
                />
              )}

              {/* Real-Time AI Detection Overlay */}
              {selectedFeed.status !== 'offline' && <AiDetectionOverlay feed={selectedFeed} />}

              {/* Header Badge Overlay */}
              <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
                <Badge
                  variant={selectedFeed.status === 'offline' ? 'danger' : 'success'}
                  className="bg-slate-900/90 text-white border border-white/10 backdrop-blur-md px-3 py-1 font-mono text-xs shadow-md"
                  dot
                >
                  {selectedFeed.status.toUpperCase()}
                </Badge>
                {selectedFeed.recording && (
                  <span className="flex items-center gap-1.5 rounded-full bg-red-600/90 backdrop-blur-md px-3 py-1 text-xs font-mono font-bold text-white shadow-md">
                    <Circle className="h-2 w-2 fill-white animate-pulse-dot" />
                    LIVE REC
                  </span>
                )}
                <span className="rounded-full bg-black/70 backdrop-blur-md text-white/90 px-3 py-1 text-xs font-mono border border-white/10 hidden sm:inline-block">
                  {selectedFeed.name}
                </span>
              </div>

              {/* Video Player Action Overlay */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                <button
                  onClick={togglePlay}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/80 text-white hover:bg-slate-800 transition-colors backdrop-blur-md border border-white/10 shadow-md"
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/80 text-white hover:bg-slate-800 transition-colors backdrop-blur-md border border-white/10 shadow-md"
                  aria-label={audioEnabled ? 'Mute audio' : 'Enable audio'}
                >
                  {audioEnabled ? <Volume2 className="h-4 w-4 text-emerald-400" /> : <MicOff className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/80 text-white hover:bg-slate-800 transition-colors backdrop-blur-md border border-white/10 shadow-md"
                  aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </button>
              </div>

              {/* Bottom Telemetry Overlay */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-20">
                <div className="flex items-center gap-3 rounded-xl bg-black/80 backdrop-blur-md px-3.5 py-1.5 border border-white/10 text-xs font-mono text-white/90 shadow-md">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <Scan className="h-3.5 w-3.5" /> YOLOv8 Live Overlay
                  </span>
                  <span className="text-white/30">|</span>
                  <span>FPS: <strong className="text-emerald-300">29.8</strong></span>
                  <span className="text-white/30 hidden sm:inline">|</span>
                  <span className="hidden sm:inline">Latency: <strong className="text-white">12ms</strong></span>
                </div>
                <div className="text-xs font-mono text-white/80 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 shadow-md">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Video Controls Bar */}
            <div className="flex flex-wrap items-center justify-between border-t border-olive/10 dark:border-slate-800 p-4 gap-3">
              <div className="flex items-center gap-2">
                <Button size="sm" leftIcon={<Camera className="h-4 w-4" />}>
                  Capture Snapshot
                </Button>
                <Button variant="secondary" size="sm" leftIcon={<ShieldAlert className="h-4 w-4 text-amber-500" />}>
                  Flag Invigilator
                </Button>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <Cpu className="h-4 w-4 text-primary dark:text-emerald-400" />
                <span>Detection: <strong className="text-emerald-600 dark:text-emerald-400">YOLOv8 + ResNet HeadPose</strong></span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Anomaly Telemetry List */}
        <Card className="flex flex-col shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Real-Time Anomalies
            </CardTitle>
            <div className="flex gap-1">
              {(['all', 'critical', 'warning'] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    filterSeverity === sev
                      ? 'bg-primary text-white dark:bg-emerald-800 shadow-xs'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto max-h-[460px] pr-1">
            <AnimatedList>
              {filteredAnomalies.map((anomaly) => (
                <div
                  key={anomaly.id}
                  className={`rounded-2xl border p-3.5 transition-all mb-3 ${
                    anomaly.actionTaken
                      ? 'opacity-50 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30'
                      : anomaly.severity === 'critical'
                      ? 'border-red-300 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 shadow-xs'
                      : anomaly.severity === 'warning'
                      ? 'border-amber-300 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20'
                      : 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      {anomaly.severity === 'critical' ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-500 text-white font-bold text-xs shadow-xs">
                          <Smartphone className="h-3.5 w-3.5" />
                        </span>
                      ) : anomaly.severity === 'warning' ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500 text-white font-bold text-xs shadow-xs">
                          <UserX className="h-3.5 w-3.5" />
                        </span>
                      ) : (
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500 text-white font-bold text-xs shadow-xs">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </span>
                      )}
                      <span className="text-xs font-mono font-extrabold text-slate-900 dark:text-slate-100">
                        {anomaly.id}
                      </span>
                    </div>
                    <Badge
                      variant={anomaly.severity === 'critical' ? 'danger' : anomaly.severity === 'warning' ? 'warning' : 'success'}
                      className="text-[10px] uppercase font-bold"
                    >
                      {anomaly.confidence}% Conf
                    </Badge>
                  </div>

                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
                    {anomaly.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {anomaly.description}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500">
                    <span className="truncate max-w-[170px] font-medium">{anomaly.camera}</span>
                    <span className="font-mono text-[10px] text-slate-400">{anomaly.timestamp}</span>
                  </div>

                  {!anomaly.actionTaken && anomaly.severity !== 'info' && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleActionTaken(anomaly.id)}
                        className="flex-1 rounded-xl bg-primary dark:bg-emerald-800 text-white py-1.5 text-xs font-bold hover:bg-primary-hover transition-colors shadow-xs"
                      >
                        Acknowledge Alert
                      </button>
                      <button
                        onClick={() => handleActionTaken(anomaly.id)}
                        className="px-3 rounded-xl border border-slate-300 dark:border-slate-700 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </AnimatedList>
          </CardContent>
        </Card>
      </div>

      {/* AI Flagged Snapshots Timeline Carousel */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <Image className="h-5 w-5 text-primary dark:text-emerald-400" />
            AI Flagged Snapshots & Frame Highlights
          </CardTitle>
          <span className="text-xs font-mono text-slate-400">Stock Frame Captures</span>
        </CardHeader>
        <CardContent>
          <Carousel>
            {mockSnapshots.map((snap) => (
              <div
                key={snap.id}
                className="w-64 rounded-2xl border border-olive/15 dark:border-slate-800 p-3 bg-white dark:bg-slate-900 shadow-xs flex-shrink-0"
              >
                <div className="aspect-video w-full rounded-xl bg-slate-950 relative overflow-hidden mb-2.5 border border-slate-800">
                  <img
                    src={snap.url}
                    alt={snap.label}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute top-2 right-2 rounded-md bg-black/80 backdrop-blur-md px-1.5 py-0.5 text-[9px] font-mono text-white border border-white/10">
                    {snap.time}
                  </span>
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[9px] font-bold text-white bg-red-600/90 px-2 py-0.5 rounded-full">
                    <span>{snap.confidence}</span>
                  </div>
                </div>

                <p className="text-xs font-extrabold text-slate-900 dark:text-slate-100 truncate">
                  {snap.label}
                </p>
                <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3" /> {snap.time}
                  </span>
                  <Badge
                    variant={snap.severity === 'critical' ? 'danger' : snap.severity === 'warning' ? 'warning' : 'success'}
                    className="text-[9px] px-1.5 py-0 font-bold"
                  >
                    {snap.severity.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </Carousel>
        </CardContent>
      </Card>

      {/* Real Stock Video Camera Roster Switcher */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <Camera className="h-5 w-5 text-primary dark:text-emerald-400" />
            Stock Video Camera Roster & Channel Switcher
          </CardTitle>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{cameraFeeds.length} Real Stock Channels</span>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cameraFeeds.map((feed) => {
              const isSelected = selectedFeed.id === feed.id;
              const content = (
                <button
                  onClick={() => setSelectedFeed(feed)}
                  className={`group w-full rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-primary dark:border-emerald-500 ring-2 ring-primary/20 bg-emerald-50/20 dark:bg-emerald-950/20'
                      : 'border-olive/10 dark:border-slate-800 hover:border-olive/30 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="aspect-video w-full rounded-t-2xl bg-slate-950 relative overflow-hidden">
                    {feed.status === 'offline' ? (
                      <div className="flex h-full w-full items-center justify-center bg-slate-900 text-slate-500">
                        <Video className="h-8 w-8 opacity-30" />
                      </div>
                    ) : (
                      <img
                        src={feed.poster}
                        alt={feed.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    <div className="absolute top-2 left-2 z-10">
                      {feed.status === 'recording' && (
                        <span className="flex items-center gap-1 rounded-full bg-red-600/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-mono font-bold text-white">
                          <Circle className="h-1.5 w-1.5 fill-white animate-pulse-dot" />
                          REC
                        </span>
                      )}
                      {feed.status === 'offline' && (
                        <span className="rounded-full bg-slate-700/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-mono font-bold text-white">
                          OFFLINE
                        </span>
                      )}
                    </div>

                    {feed.alerts > 0 && (
                      <div className="absolute top-2 right-2 z-10">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-extrabold text-white shadow-xs">
                          {feed.alerts}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-3.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-bold text-slate-400">{feed.id}</span>
                      <Badge
                        variant={feed.status === 'offline' ? 'danger' : feed.status === 'recording' ? 'success' : 'default'}
                        className="text-[10px] px-1.5 py-0 uppercase font-bold"
                      >
                        {feed.status}
                      </Badge>
                    </div>
                    <p className="text-xs font-extrabold text-slate-900 dark:text-slate-100 truncate">{feed.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{feed.location}</p>
                  </div>
                </button>
              );

              return isSelected ? <BorderGlow key={feed.id} active={true}>{content}</BorderGlow> : <div key={feed.id}>{content}</div>;
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
