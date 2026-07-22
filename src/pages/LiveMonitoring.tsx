import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Cpu, CheckCircle2, UserX, Smartphone, Play, Pause, RefreshCw, Scan,
  FileText, Eye, AlertCircle, Zap, Shield, Sparkles
} from 'lucide-react';

interface CameraFeed {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'recording';
  recording: boolean;
  alerts: number;
  malpracticeType: string;
  videoUrl: string;
  poster: string;
  severity: 'critical' | 'warning' | 'none';
  targetLabel: string;
  confidence: number;
  boxPos: { x: number; y: number; w: number; h: number };
}

interface Anomaly {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  malpracticeCategory: string;
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
    name: 'Hall A — Mobile Phone Cheating Zone',
    location: 'Examination Hall A (Row 3, Desk 14)',
    status: 'recording',
    recording: true,
    alerts: 2,
    malpracticeType: '📱 Mobile Phone Usage Under Desk',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-person-typing-on-a-laptop-42930-large.mp4',
    poster: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    severity: 'critical',
    targetLabel: '🚨 MOBILE PHONE IN HAND [96.4%]',
    confidence: 96.4,
    boxPos: { x: 55, y: 55, w: 22, h: 32 },
  },
  {
    id: 'CAM-002',
    name: 'Hall A — Side Peeking & Paper Copying',
    location: 'Examination Hall A (Desk 22 & 23)',
    status: 'recording',
    recording: true,
    alerts: 1,
    malpracticeType: '👀 Neighbor Exam Sheet Peeking',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-female-student-reading-in-a-library-41541-large.mp4',
    poster: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
    severity: 'warning',
    targetLabel: '⚠️ HEAD POSE: YAW 62° LEFT (PEEKING)',
    confidence: 89.1,
    boxPos: { x: 28, y: 28, w: 28, h: 46 },
  },
  {
    id: 'CAM-003',
    name: 'Hall B — Unauthorized Chit Passing',
    location: 'Examination Hall B (Center Aisle)',
    status: 'recording',
    recording: true,
    alerts: 3,
    malpracticeType: '📄 Cheat Sheet / Chit Transfer',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-students-sitting-at-desks-in-a-classroom-43187-large.mp4',
    poster: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80',
    severity: 'critical',
    targetLabel: '🚨 OBJECT TRANSFER DETECTED [93.7%]',
    confidence: 93.7,
    boxPos: { x: 42, y: 45, w: 30, h: 38 },
  },
  {
    id: 'CAM-004',
    name: 'Hall B — Impersonation & Second Face',
    location: 'Examination Hall B (Station 08)',
    status: 'recording',
    recording: true,
    alerts: 1,
    malpracticeType: '👤 Multiple Persons / Proxy Candidate',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-people-working-in-a-modern-office-4328-large.mp4',
    poster: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    severity: 'critical',
    targetLabel: '🚨 SECOND FACE IN FRAME (PROXY)',
    confidence: 91.5,
    boxPos: { x: 62, y: 20, w: 25, h: 42 },
  },
  {
    id: 'CAM-005',
    name: 'Lab 3 — Book & Formula Sheet Under Desk',
    location: 'Computer Lab 3 (Bay B)',
    status: 'recording',
    recording: true,
    alerts: 1,
    malpracticeType: '📚 Unauthorized Paper / Book Reference',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-working-on-her-laptop-in-an-office-42798-large.mp4',
    poster: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
    severity: 'warning',
    targetLabel: '⚠️ UNAPPROVED BOOK DETECTED [87.9%]',
    confidence: 87.9,
    boxPos: { x: 18, y: 50, w: 26, h: 34 },
  },
  {
    id: 'CAM-006',
    name: 'Lab 3 — Normal Invigilation Baseline',
    location: 'Computer Lab 3 (Bay A)',
    status: 'recording',
    recording: true,
    alerts: 0,
    malpracticeType: '✅ Clean Exam Stream',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-students-walking-in-a-university-hallway-4412-large.mp4',
    poster: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80',
    severity: 'none',
    targetLabel: '✅ NORMAL MONITORING (99.5%)',
    confidence: 99.5,
    boxPos: { x: 35, y: 25, w: 28, h: 50 },
  },
];

const initialAnomalies: Anomaly[] = [
  {
    id: 'MAL-9104',
    severity: 'critical',
    title: 'Mobile Phone Cheating In-Progress',
    malpracticeCategory: 'Device Malpractice',
    description: 'YOLOv8 detected smartphone held under desk. Candidate STU-2024-88 typing answers.',
    camera: 'Hall A — Mobile Phone Cheating Zone (CAM-001)',
    studentId: 'STU-2024-88',
    timestamp: '10:54:12 AM',
    confidence: 96.4,
  },
  {
    id: 'MAL-9103',
    severity: 'critical',
    title: 'Unpermitted Paper / Chit Passing',
    malpracticeCategory: 'Unauthorized Material',
    description: 'Object tracking detected paper transfer between Desk #04 and Desk #05.',
    camera: 'Hall B — Unauthorized Chit Passing (CAM-003)',
    studentId: 'STU-2024-14',
    timestamp: '10:51:30 AM',
    confidence: 93.7,
  },
  {
    id: 'MAL-9102',
    severity: 'warning',
    title: 'Persistent Side-Peeking (Neighbor Paper)',
    malpracticeCategory: 'Gaze / Head Pose Violation',
    description: 'Head pose estimator flagged 62° left yaw angle towards Desk #23 for > 15s.',
    camera: 'Hall A — Side Peeking & Paper Copying (CAM-002)',
    studentId: 'STU-2024-42',
    timestamp: '10:48:05 AM',
    confidence: 89.1,
  },
  {
    id: 'MAL-9101',
    severity: 'critical',
    title: 'Proxy Candidate / Secondary Face',
    malpracticeCategory: 'Identity / Impersonation',
    description: 'Biometric engine flagged second unauthorized face standing over candidate seat.',
    camera: 'Hall B — Impersonation & Second Face (CAM-004)',
    studentId: 'STU-2024-91',
    timestamp: '10:42:19 AM',
    confidence: 91.5,
  },
  {
    id: 'MAL-9100',
    severity: 'warning',
    title: 'Hidden Study Book Under Exam Sheet',
    malpracticeCategory: 'Unauthorized Material',
    description: 'Bounding box classifier detected textbook pages under exam question paper.',
    camera: 'Lab 3 — Book & Formula Sheet (CAM-005)',
    studentId: 'STU-2024-09',
    timestamp: '10:35:40 AM',
    confidence: 87.9,
  },
];

const mockSnapshots = [
  { id: 's1', time: '10:54 AM', label: 'Mobile Device Bounding Box — Desk #14', confidence: '96.4%', severity: 'critical', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80', malpractice: '📱 Phone' },
  { id: 's2', time: '10:51 AM', label: 'Paper Pass Object Trajectory Flag', confidence: '93.7%', severity: 'critical', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=400&q=80', malpractice: '📄 Chit Transfer' },
  { id: 's3', time: '10:48 AM', label: 'Head Pose Gaze Tracking Alert', confidence: '89.1%', severity: 'warning', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80', malpractice: '👀 Side Peeking' },
  { id: 's4', time: '10:42 AM', label: 'Biometric Proxy Candidate Flag', confidence: '91.5%', severity: 'critical', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80', malpractice: '👤 Proxy Face' },
  { id: 's5', time: '10:35 AM', label: 'Hidden Formula Book Frame', confidence: '87.9%', severity: 'warning', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=400&q=80', malpractice: '📚 Book' },
];

/* ── Malpractice AI Bounding Box Overlay ──────────── */
function MalpracticeAiOverlay({ feed }: { feed: CameraFeed }) {
  const isCritical = feed.severity === 'critical';
  const isWarning = feed.severity === 'warning';
  const box = feed.boxPos;

  return (
    <svg className="absolute inset-0 h-full w-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
      {/* Scanning laser beam line */}
      <motion.line
        x1="0"
        y1="0"
        x2="100"
        y2="0"
        stroke={isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981'}
        strokeWidth="0.6"
        strokeOpacity="0.8"
        animate={{ y1: [0, 100, 0], y2: [0, 100, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
      />

      {/* Malpractice Target Bounding Box */}
      <motion.g animate={{ opacity: [0.75, 1, 0.75] }} transition={{ duration: 1.2, repeat: Infinity }}>
        {/* Fill highlight */}
        <rect
          x={box.x}
          y={box.y}
          width={box.w}
          height={box.h}
          fill={isCritical ? 'rgba(239, 68, 68, 0.22)' : isWarning ? 'rgba(245, 158, 11, 0.18)' : 'rgba(16, 185, 129, 0.1)'}
          stroke={isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981'}
          strokeWidth={isCritical ? '1.5' : '1'}
          strokeDasharray={isCritical ? 'none' : '3 1.5'}
        />

        {/* Heavy corner brackets */}
        <path d={`M${box.x} ${box.y + 6} L${box.x} ${box.y} L${box.x + 6} ${box.y}`} fill="none" stroke={isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981'} strokeWidth="2" />
        <path d={`M${box.x + box.w - 6} ${box.y} L${box.x + box.w} ${box.y} L${box.x + box.w} ${box.y + 6}`} fill="none" stroke={isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981'} strokeWidth="2" />
        <path d={`M${box.x + box.w} ${box.y + box.h - 6} L${box.x + box.w} ${box.y + box.h} L${box.x + box.w - 6} ${box.y + box.h}`} fill="none" stroke={isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981'} strokeWidth="2" />
        <path d={`M${box.x + 6} ${box.y + box.h} L${box.x} ${box.y + box.h} L${box.x} ${box.y + box.h - 6}`} fill="none" stroke={isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981'} strokeWidth="2" />

        {/* Tag Banner Header */}
        <rect
          x={box.x}
          y={box.y - 12}
          width={box.w + 14}
          height="11"
          fill={isCritical ? '#dc2626' : isWarning ? '#d97706' : '#059669'}
          rx="1"
        />
        <text
          x={box.x + 2}
          y={box.y - 4}
          fill="#ffffff"
          fontSize="2.4"
          fontFamily="monospace"
          fontWeight="900"
        >
          {feed.targetLabel}
        </text>

        {/* Head pose directional arrow line if warning */}
        {isWarning && (
          <line
            x1={box.x + box.w / 2}
            y1={box.y + 10}
            x2={box.x - 15}
            y2={box.y + 10}
            stroke="#f59e0b"
            strokeWidth="1.2"
            strokeDasharray="2 1"
          />
        )}
      </motion.g>

      {/* Watermark telemetry line */}
      <text x="3" y="97" fill="rgba(255,255,255,0.7)" fontSize="2.2" fontFamily="monospace">
        AI MONITORING STREAM • MALPRACTICE ENGINE V4 • CONF: {feed.confidence}%
      </text>
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
  const [triggerNotification, setTriggerNotification] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  const onlineCount = cameraFeeds.filter((f) => f.status !== 'offline').length;
  const criticalCount = anomalies.filter((a) => a.severity === 'critical' && !a.actionTaken).length;

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

  const simulateMalpractice = (type: 'phone' | 'gaze' | 'chit' | 'proxy') => {
    const newId = `MAL-${Math.floor(1000 + Math.random() * 9000)}`;
    let newAnomaly: Anomaly;

    if (type === 'phone') {
      newAnomaly = {
        id: newId,
        severity: 'critical',
        title: 'LIVE SIMULATION: Mobile Phone Detected',
        malpracticeCategory: 'Device Cheating',
        description: 'Candidate detected retrieving smartphone from pocket under exam table.',
        camera: selectedFeed.name,
        studentId: 'STU-SIM-99',
        timestamp: new Date().toLocaleTimeString(),
        confidence: 97.2,
      };
      setTriggerNotification('🚨 CRITICAL MALPRACTICE TRIGGERED: Mobile Phone Detected!');
    } else if (type === 'gaze') {
      newAnomaly = {
        id: newId,
        severity: 'warning',
        title: 'LIVE SIMULATION: Side Gaze Violation',
        malpracticeCategory: 'Head Pose Peeking',
        description: 'Candidate gaze fixed on neighbor student exam paper for > 10 seconds.',
        camera: selectedFeed.name,
        studentId: 'STU-SIM-77',
        timestamp: new Date().toLocaleTimeString(),
        confidence: 91.4,
      };
      setTriggerNotification('⚠️ WARNING MALPRACTICE TRIGGERED: Side Peeking Detected!');
    } else if (type === 'chit') {
      newAnomaly = {
        id: newId,
        severity: 'critical',
        title: 'LIVE SIMULATION: Paper Chit Passing',
        malpracticeCategory: 'Material Transfer',
        description: 'Object trajectory tracker detected paper note passed between desks.',
        camera: selectedFeed.name,
        studentId: 'STU-SIM-55',
        timestamp: new Date().toLocaleTimeString(),
        confidence: 95.8,
      };
      setTriggerNotification('🚨 CRITICAL MALPRACTICE TRIGGERED: Cheat Sheet Passing!');
    } else {
      newAnomaly = {
        id: newId,
        severity: 'critical',
        title: 'LIVE SIMULATION: Impersonator Proxy Face',
        malpracticeCategory: 'Identity Fraud',
        description: 'Second face detected in frame. Candidate roster mismatch flagged.',
        camera: selectedFeed.name,
        studentId: 'STU-SIM-33',
        timestamp: new Date().toLocaleTimeString(),
        confidence: 98.1,
      };
      setTriggerNotification('🚨 CRITICAL MALPRACTICE TRIGGERED: Proxy Face Detected!');
    }

    setAnomalies((prev) => [newAnomaly, ...prev]);

    setTimeout(() => {
      setTriggerNotification(null);
    }, 4000);
  };

  const filteredAnomalies = anomalies.filter((a) =>
    filterSeverity === 'all' ? true : a.severity === filterSeverity
  );

  return (
    <div className="space-y-6 font-sans select-none">
      <PageHeader
        title="AI Exam Malpractice Detection & Live Surveillance"
        description="Real-time exam cheating detection — Phone usage, paper copying, chit passing, & impersonation"
        breadcrumb={[{ label: 'Live Malpractice Surveillance' }]}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="danger" dot>{criticalCount} Critical Cheating Alerts</Badge>
            <Badge variant="success">{onlineCount}/{cameraFeeds.length} Feeds Online</Badge>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
              onClick={() => setAnomalies(initialAnomalies)}
            >
              Reset Feeds
            </Button>
          </div>
        }
      />

      {/* Simulated Malpractice Alert Banner */}
      <AnimatePresence>
        {triggerNotification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl bg-red-600 text-white p-4 font-bold flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-white animate-bounce" />
              <span>{triggerNotification}</span>
            </div>
            <span className="text-xs font-mono bg-black/30 px-3 py-1 rounded-full">INSTANT AI FLAG</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Malpractice Simulator Trigger Bar */}
      <Card className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white border border-emerald-500/30 shadow-lg">
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-white">Live Exam Malpractice Simulator</p>
              <p className="text-xs text-emerald-300/80">Click any trigger button below to simulate real-time cheating detection</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => simulateMalpractice('phone')}
              className="flex items-center gap-1.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white px-3 py-2 text-xs font-bold transition-all shadow-xs"
            >
              <Smartphone className="h-3.5 w-3.5" /> Simulate Phone Cheating
            </button>
            <button
              onClick={() => simulateMalpractice('gaze')}
              className="flex items-center gap-1.5 rounded-xl bg-amber-600/90 hover:bg-amber-600 text-white px-3 py-2 text-xs font-bold transition-all shadow-xs"
            >
              <Eye className="h-3.5 w-3.5" /> Simulate Side Peeking
            </button>
            <button
              onClick={() => simulateMalpractice('chit')}
              className="flex items-center gap-1.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white px-3 py-2 text-xs font-bold transition-all shadow-xs"
            >
              <FileText className="h-3.5 w-3.5" /> Simulate Chit Passing
            </button>
            <button
              onClick={() => simulateMalpractice('proxy')}
              className="flex items-center gap-1.5 rounded-xl bg-purple-600/90 hover:bg-purple-600 text-white px-3 py-2 text-xs font-bold transition-all shadow-xs"
            >
              <UserX className="h-3.5 w-3.5" /> Simulate Proxy Candidate
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Stock Video Feed Viewer */}
        <Card className="lg:col-span-2 overflow-hidden shadow-lg border-olive/20 dark:border-slate-800">
          <CardContent className="p-0">
            <div className={`aspect-video w-full bg-slate-950 relative overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen w-screen' : 'rounded-t-2xl'}`}>

              {/* Real Stock Video Stream */}
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

              {/* Malpractice AI Bounding Box Overlay */}
              {selectedFeed.status !== 'offline' && <MalpracticeAiOverlay feed={selectedFeed} />}

              {/* Malpractice Alert Badge Banner Overlay */}
              <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-20">
                <Badge
                  variant={selectedFeed.severity === 'critical' ? 'danger' : selectedFeed.severity === 'warning' ? 'warning' : 'success'}
                  className="bg-slate-900/90 text-white border border-white/10 backdrop-blur-md px-3 py-1 font-mono text-xs shadow-md font-extrabold"
                  dot
                >
                  {selectedFeed.malpracticeType}
                </Badge>
                {selectedFeed.recording && (
                  <span className="flex items-center gap-1.5 rounded-full bg-red-600/90 backdrop-blur-md px-3 py-1 text-xs font-mono font-bold text-white shadow-md">
                    <Circle className="h-2 w-2 fill-white animate-pulse-dot" />
                    MALPRACTICE MONITORING
                  </span>
                )}
              </div>

              {/* Player Overlay Controls */}
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

              {/* Bottom Malpractice Telemetry Overlay */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-20">
                <div className="flex items-center gap-3 rounded-xl bg-black/85 backdrop-blur-md px-3.5 py-1.5 border border-white/10 text-xs font-mono text-white/90 shadow-md">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <Scan className="h-3.5 w-3.5" /> YOLOv8-Malpractice Engine
                  </span>
                  <span className="text-white/30">|</span>
                  <span>FPS: <strong className="text-emerald-300">29.8</strong></span>
                  <span className="text-white/30 hidden sm:inline">|</span>
                  <span className="hidden sm:inline">Target: <strong className="text-amber-300">{selectedFeed.id}</strong></span>
                </div>
                <div className="text-xs font-mono text-white/80 bg-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 shadow-md">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Video Action Controls Bar */}
            <div className="flex flex-wrap items-center justify-between border-t border-olive/10 dark:border-slate-800 p-4 gap-3">
              <div className="flex items-center gap-2">
                <Button size="sm" leftIcon={<Camera className="h-4 w-4" />}>
                  Save Malpractice Evidence Frame
                </Button>
                <Button variant="secondary" size="sm" leftIcon={<ShieldAlert className="h-4 w-4 text-red-500" />}>
                  Alert Flying Squad
                </Button>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <Cpu className="h-4 w-4 text-primary dark:text-emerald-400" />
                <span>Detection: <strong className="text-emerald-600 dark:text-emerald-400">YOLOv8-ExamCheating + GazePose</strong></span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Malpractice Incident Log */}
        <Card className="flex flex-col shadow-lg border-olive/20 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Detected Malpractice Stream
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

                  <span className="inline-block px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {anomaly.malpracticeCategory}
                  </span>

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
                        className="flex-1 rounded-xl bg-red-600 dark:bg-red-800 text-white py-1.5 text-xs font-bold hover:bg-red-700 transition-colors shadow-xs"
                      >
                        Acknowledge & Escalate
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

      {/* Flagged AI Malpractice Snapshots Carousel */}
      <Card className="shadow-lg border-olive/20 dark:border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <Image className="h-5 w-5 text-primary dark:text-emerald-400" />
            Flagged Malpractice Evidence Frames & Bounding Snapshots
          </CardTitle>
          <span className="text-xs font-mono text-slate-400">Captured Evidence Clips</span>
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
                  <span className="absolute top-2 left-2 rounded-md bg-red-600/90 backdrop-blur-md px-1.5 py-0.5 text-[9px] font-mono font-bold text-white">
                    {snap.malpractice}
                  </span>
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

      {/* Malpractice Camera Channels Roster */}
      <Card className="shadow-lg border-olive/20 dark:border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <Camera className="h-5 w-5 text-primary dark:text-emerald-400" />
            Malpractice Monitoring Channels (6 Camera Nodes)
          </CardTitle>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{cameraFeeds.length} Configured Nodes</span>
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
                    <img
                      src={feed.poster}
                      alt={feed.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    <div className="absolute top-2 left-2 z-10">
                      <span className="flex items-center gap-1 rounded-full bg-red-600/90 backdrop-blur-md px-2 py-0.5 text-[9px] font-mono font-bold text-white">
                        <Circle className="h-1.5 w-1.5 fill-white animate-pulse-dot" />
                        REC
                      </span>
                    </div>

                    <div className="absolute bottom-2 left-2 z-10">
                      <span className="text-[10px] font-bold text-amber-300 bg-black/70 px-2 py-0.5 rounded-md">
                        {feed.malpracticeType}
                      </span>
                    </div>

                    {feed.alerts > 0 && (
                      <div className="absolute top-2 right-2 z-10">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-extrabold text-white shadow-xs animate-pulse">
                          {feed.alerts}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-3.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-bold text-slate-400">{feed.id}</span>
                      <Badge
                        variant={feed.severity === 'critical' ? 'danger' : feed.severity === 'warning' ? 'warning' : 'success'}
                        className="text-[10px] px-1.5 py-0 uppercase font-bold"
                      >
                        {feed.severity.toUpperCase()}
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
