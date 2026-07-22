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
  FileText, Eye, AlertCircle, Zap, Shield, Sparkles, Sliders, Activity, Layers, Crosshair
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
  headYaw: number;
  pitch: number;
  wristPos?: { x: number; y: number };
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
  boxCoords: string;
  actionTaken?: boolean;
}

const cameraFeeds: CameraFeed[] = [
  {
    id: 'CAM-001',
    name: 'Hall A — Mobile Phone Cheating (Desk 14)',
    location: 'Examination Hall A (Row 3, Desk 14)',
    status: 'recording',
    recording: true,
    alerts: 2,
    malpracticeType: '📱 Mobile Phone Usage Under Desk',
    videoUrl: '/videos/exam_feed.mp4',
    poster: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    severity: 'critical',
    targetLabel: '🚨 MOBILE PHONE IN HAND [98.6%]',
    confidence: 98.6,
    boxPos: { x: 52, y: 52, w: 24, h: 36 },
    headYaw: 14.2,
    pitch: -22.5,
    wristPos: { x: 64, y: 70 },
  },
  {
    id: 'CAM-002',
    name: 'Hall A — Side Peeking & Gaze Angle (Desk 22)',
    location: 'Examination Hall A (Desk 22 & 23)',
    status: 'recording',
    recording: true,
    alerts: 1,
    malpracticeType: '👀 Neighbor Exam Sheet Peeking',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-female-student-reading-in-a-library-41541-large.mp4',
    poster: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
    severity: 'warning',
    targetLabel: '⚠️ HEAD YAW: +64.8° (GAZE ON DESK 23)',
    confidence: 92.4,
    boxPos: { x: 26, y: 26, w: 30, h: 48 },
    headYaw: 64.8,
    pitch: 12.1,
  },
  {
    id: 'CAM-003',
    name: 'Hall B — Unauthorized Chit Passing (Row 2)',
    location: 'Examination Hall B (Center Aisle)',
    status: 'recording',
    recording: true,
    alerts: 3,
    malpracticeType: '📄 Cheat Sheet / Chit Transfer',
    videoUrl: '/videos/exam_feed.mp4',
    poster: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80',
    severity: 'critical',
    targetLabel: '🚨 HAND-TO-HAND CHIT PASS [95.8%]',
    confidence: 95.8,
    boxPos: { x: 40, y: 42, w: 32, h: 40 },
    headYaw: -35.2,
    pitch: -8.4,
    wristPos: { x: 56, y: 62 },
  },
  {
    id: 'CAM-004',
    name: 'Hall B — Impersonation & Proxy Face (Station 08)',
    location: 'Examination Hall B (Station 08)',
    status: 'recording',
    recording: true,
    alerts: 1,
    malpracticeType: '👤 Multiple Persons / Proxy Candidate',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-people-working-in-a-modern-office-4328-large.mp4',
    poster: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    severity: 'critical',
    targetLabel: '🚨 PROXY FACE MATCH MISMATCH [96.2%]',
    confidence: 96.2,
    boxPos: { x: 60, y: 18, w: 26, h: 44 },
    headYaw: 5.1,
    pitch: 2.8,
  },
  {
    id: 'CAM-005',
    name: 'Lab 3 — Book & Formula Sheet (Terminal B)',
    location: 'Computer Lab 3 (Bay B)',
    status: 'recording',
    recording: true,
    alerts: 1,
    malpracticeType: '📚 Unauthorized Paper / Book Reference',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-working-on-her-laptop-in-an-office-42798-large.mp4',
    poster: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
    severity: 'warning',
    targetLabel: '⚠️ UNAPPROVED BOOK DETECTED [89.7%]',
    confidence: 89.7,
    boxPos: { x: 16, y: 48, w: 28, h: 36 },
    headYaw: -18.4,
    pitch: -34.1,
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
    targetLabel: '✅ NORMAL MONITORING (99.8%)',
    confidence: 99.8,
    boxPos: { x: 34, y: 22, w: 30, h: 52 },
    headYaw: 0.8,
    pitch: -4.2,
  },
];

const initialAnomalies: Anomaly[] = [
  {
    id: 'MAL-9104',
    severity: 'critical',
    title: 'Mobile Phone Cheating In-Progress',
    malpracticeCategory: 'Device Malpractice',
    description: 'YOLOv8x-Exam detected smartphone held under desk. Candidate STU-2024-88 typing answers.',
    camera: 'Hall A — Mobile Phone (CAM-001)',
    studentId: 'STU-2024-88',
    timestamp: '10:54:12 AM',
    confidence: 98.6,
    boxCoords: '[X:522, Y:312, W:184, H:220]',
  },
  {
    id: 'MAL-9103',
    severity: 'critical',
    title: 'Unpermitted Paper / Chit Passing',
    malpracticeCategory: 'Material Transfer',
    description: 'PoseNet wrist trajectory detected paper transfer between Desk #04 and Desk #05.',
    camera: 'Hall B — Chit Passing (CAM-003)',
    studentId: 'STU-2024-14',
    timestamp: '10:51:30 AM',
    confidence: 95.8,
    boxCoords: '[X:410, Y:280, W:210, H:190]',
  },
  {
    id: 'MAL-9102',
    severity: 'warning',
    title: 'Persistent Side-Peeking (Gaze Angle +64.8°)',
    malpracticeCategory: 'Gaze / Head Pose Violation',
    description: '3D Head Pose Estimator flagged +64.8° left yaw angle towards Desk #23 for > 15s.',
    camera: 'Hall A — Side Peeking (CAM-002)',
    studentId: 'STU-2024-42',
    timestamp: '10:48:05 AM',
    confidence: 92.4,
    boxCoords: '[X:260, Y:190, W:220, H:310]',
  },
  {
    id: 'MAL-9101',
    severity: 'critical',
    title: 'Proxy Candidate / Secondary Face',
    malpracticeCategory: 'Identity / Impersonation',
    description: 'Biometric FaceEngine-v4 flagged second unauthorized face standing over candidate seat.',
    camera: 'Hall B — Impersonation (CAM-004)',
    studentId: 'STU-2024-91',
    timestamp: '10:42:19 AM',
    confidence: 96.2,
    boxCoords: '[X:600, Y:140, W:190, H:280]',
  },
];

const mockSnapshots = [
  { id: 's1', time: '10:54 AM', label: 'YOLOv8 Phone Bounding Box — Desk #14', confidence: '98.6%', severity: 'critical', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80', malpractice: '📱 Phone' },
  { id: 's2', time: '10:51 AM', label: 'Wrist Trajectory Object Transfer Flag', confidence: '95.8%', severity: 'critical', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=400&q=80', malpractice: '📄 Chit Transfer' },
  { id: 's3', time: '10:48 AM', label: 'Gaze Vector Raycast Target Desk #23', confidence: '92.4%', severity: 'warning', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80', malpractice: '👀 Gaze Vector' },
  { id: 's4', time: '10:42 AM', label: 'Biometric Proxy Face Match Mismatch', confidence: '96.2%', severity: 'critical', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80', malpractice: '👤 Proxy Face' },
];

/* ── High-Precision MediaPipe/YOLO Overlay Component ── */
function PrecisionAiOverlay({ feed, showSkeletons, showGaze }: { feed: CameraFeed; showSkeletons: boolean; showGaze: boolean }) {
  const isCritical = feed.severity === 'critical';
  const isWarning = feed.severity === 'warning';
  const box = feed.boxPos;

  // Center points for pose keypoints
  const cx = box.x + box.w / 2;
  const cy = box.y + 12;

  return (
    <svg className="absolute inset-0 h-full w-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
      {/* Grid overlay lines */}
      <defs>
        <pattern id="cam-grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#cam-grid)" />

      {/* Laser scan line */}
      <motion.line
        x1="0"
        y1="0"
        x2="100"
        y2="0"
        stroke={isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981'}
        strokeWidth="0.7"
        strokeOpacity="0.85"
        animate={{ y1: [0, 100, 0], y2: [0, 100, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />

      {/* Pose Estimation Skeleton (Head, Shoulders, Wrists) */}
      {showSkeletons && (
        <g stroke="rgba(56, 189, 248, 0.8)" strokeWidth="1" fill="#38bdf8">
          {/* Head circle */}
          <circle cx={cx} cy={cy} r="3" fill="none" stroke="#38bdf8" strokeWidth="1" />
          {/* Spine & Shoulders */}
          <line x1={cx} y1={cy + 3} x2={cx} y2={cy + 18} />
          <line x1={cx - 10} y1={cy + 8} x2={cx + 10} y2={cy + 8} />
          {/* Left Arm */}
          <line x1={cx - 10} y1={cy + 8} x2={cx - 14} y2={cy + 22} />
          <line x1={cx - 14} y1={cy + 22} x2={cx - 8} y2={cy + 32} />
          {/* Right Arm */}
          <line x1={cx + 10} y1={cy + 8} x2={cx + 15} y2={cy + 22} />
          <line x1={cx + 15} y1={cy + 22} x2={cx + (feed.wristPos ? feed.wristPos.x - cx : 12)} y2={cy + (feed.wristPos ? feed.wristPos.y - cy : 32)} />

          {/* Skeleton Keypoint Dots */}
          <circle cx={cx} cy={cy} r="1" />
          <circle cx={cx - 10} cy={cy + 8} r="1" />
          <circle cx={cx + 10} cy={cy + 8} r="1" />
          <circle cx={cx - 14} cy={cy + 22} r="1" />
          <circle cx={cx + 15} cy={cy + 22} r="1" />
          {/* Wrist keypoint highlighted in red if cheating */}
          <circle
            cx={feed.wristPos ? feed.wristPos.x : cx + 12}
            cy={feed.wristPos ? feed.wristPos.y : cy + 32}
            r="1.8"
            fill={isCritical ? '#ef4444' : '#38bdf8'}
          />
        </g>
      )}

      {/* 3D Gaze / Head Pose Raycast Arrow */}
      {showGaze && (
        <g>
          {/* Raycast vector pointing towards neighbor desk */}
          <motion.line
            x1={cx}
            y1={cy}
            x2={cx + feed.headYaw * 0.45}
            y2={cy + 14}
            stroke={isWarning ? '#f59e0b' : '#38bdf8'}
            strokeWidth="1.5"
            strokeDasharray="2 1"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          {/* Gaze Target Reticle */}
          <circle
            cx={cx + feed.headYaw * 0.45}
            cy={cy + 14}
            r="2"
            fill="none"
            stroke={isWarning ? '#ef4444' : '#38bdf8'}
            strokeWidth="1"
          />
          <text
            x={cx + feed.headYaw * 0.45 + 3}
            y={cy + 15}
            fill={isWarning ? '#f59e0b' : '#38bdf8'}
            fontSize="2.2"
            fontFamily="monospace"
            fontWeight="bold"
          >
            GAZE YAW: {feed.headYaw}°
          </text>
        </g>
      )}

      {/* Malpractice Target Bounding Box */}
      <g>
        <rect
          x={box.x}
          y={box.y}
          width={box.w}
          height={box.h}
          fill={isCritical ? 'rgba(239, 68, 68, 0.2)' : isWarning ? 'rgba(245, 158, 11, 0.18)' : 'rgba(16, 185, 129, 0.1)'}
          stroke={isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981'}
          strokeWidth={isCritical ? '1.5' : '1'}
        />

        {/* Heavy corner brackets */}
        <path d={`M${box.x} ${box.y + 6} L${box.x} ${box.y} L${box.x + 6} ${box.y}`} fill="none" stroke={isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981'} strokeWidth="2" />
        <path d={`M${box.x + box.w - 6} ${box.y} L${box.x + box.w} ${box.y} L${box.x + box.w} ${box.y + 6}`} fill="none" stroke={isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981'} strokeWidth="2" />
        <path d={`M${box.x + box.w} ${box.y + box.h - 6} L${box.x + box.w} ${box.y + box.h} L${box.x + box.w - 6} ${box.y + box.h}`} fill="none" stroke={isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981'} strokeWidth="2" />
        <path d={`M${box.x + 6} ${box.y + box.h} L${box.x} ${box.y + box.h} L${box.x} ${box.y + box.h - 6}`} fill="none" stroke={isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981'} strokeWidth="2" />

        {/* Banner Tag */}
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
      </g>

      {/* Bottom Telemetry Overlay */}
      <text x="3" y="97" fill="rgba(255,255,255,0.75)" fontSize="2.2" fontFamily="monospace">
        YOLOv8x-EXAM • YAW: {feed.headYaw}° • PITCH: {feed.pitch}° • LATENCY: 8.4ms
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
  const [showSkeletons, setShowSkeletons] = useState(true);
  const [showGaze, setShowGaze] = useState(true);
  const [aiModel, setAiModel] = useState<'yolov8x' | 'mediapipe' | 'resnet'>('yolov8x');
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
        title: 'HIGH ACCURACY FLAG: Smartphone in Hand',
        malpracticeCategory: 'Device Cheating',
        description: 'YOLOv8x-Exam 98.8% confidence match for smartphone under desk.',
        camera: selectedFeed.name,
        studentId: 'STU-SIM-99',
        timestamp: new Date().toLocaleTimeString(),
        confidence: 98.8,
        boxCoords: '[X:540, Y:320, W:180, H:230]',
      };
      setTriggerNotification('🚨 HIGH PRECISION FLAG: Mobile Phone Detected (98.8% Confidence)!');
    } else if (type === 'gaze') {
      newAnomaly = {
        id: newId,
        severity: 'warning',
        title: 'HIGH ACCURACY FLAG: Gaze Vector Violation (+68.4°)',
        malpracticeCategory: 'Head Pose Peeking',
        description: '3D Raycast gaze vector targeted at candidate #18 exam sheet.',
        camera: selectedFeed.name,
        studentId: 'STU-SIM-77',
        timestamp: new Date().toLocaleTimeString(),
        confidence: 94.1,
        boxCoords: '[X:270, Y:195, W:210, H:300]',
      };
      setTriggerNotification('⚠️ HIGH PRECISION FLAG: Side Peeking Raycast Vector Target!');
    } else if (type === 'chit') {
      newAnomaly = {
        id: newId,
        severity: 'critical',
        title: 'HIGH ACCURACY FLAG: Hand-to-Hand Chit Transfer',
        malpracticeCategory: 'Material Transfer',
        description: 'MediaPipe Wrist Keypoint #16 trajectory intersected Desk #05 bounds.',
        camera: selectedFeed.name,
        studentId: 'STU-SIM-55',
        timestamp: new Date().toLocaleTimeString(),
        confidence: 96.8,
        boxCoords: '[X:415, Y:285, W:205, H:185]',
      };
      setTriggerNotification('🚨 HIGH PRECISION FLAG: Cheat Sheet Transfer Trajectory!');
    } else {
      newAnomaly = {
        id: newId,
        severity: 'critical',
        title: 'HIGH ACCURACY FLAG: Impersonator Proxy Candidate',
        malpracticeCategory: 'Identity Fraud',
        description: 'Biometric FaceEngine 99.1% mismatch against registered candidate hall ticket.',
        camera: selectedFeed.name,
        studentId: 'STU-SIM-33',
        timestamp: new Date().toLocaleTimeString(),
        confidence: 99.1,
        boxCoords: '[X:610, Y:145, W:185, H:275]',
      };
      setTriggerNotification('🚨 HIGH PRECISION FLAG: Proxy Candidate Biometric Mismatch!');
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
        title="High-Accuracy AI Exam Malpractice Surveillance"
        description="Ultra-precision YOLOv8x + MediaPipe 3D Head Pose + Wrist Keypoint Trajectory Analytics"
        breadcrumb={[{ label: 'Ultra-Precision Surveillance' }]}
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
              Reset Stream
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
            <span className="text-xs font-mono bg-black/30 px-3 py-1 rounded-full">YOLOV8X HIGH CONFIDENCE</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Precision Model Toolbar */}
      <Card className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white border border-emerald-500/30 shadow-lg">
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-white">High-Accuracy AI Detection Engine Controls</p>
              <p className="text-xs text-emerald-300/80">Toggle pose skeletons, 3D gaze vectors, and detection neural models</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Toggle Skeletons */}
            <button
              onClick={() => setShowSkeletons(!showSkeletons)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                showSkeletons
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <Activity className="h-3.5 w-3.5" /> Skeletons: {showSkeletons ? 'ON' : 'OFF'}
            </button>

            {/* Toggle Gaze Vectors */}
            <button
              onClick={() => setShowGaze(!showGaze)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                showGaze
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <Crosshair className="h-3.5 w-3.5" /> 3D Gaze Vectors: {showGaze ? 'ON' : 'OFF'}
            </button>

            {/* Model Selector */}
            <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs font-bold">
              {(['yolov8x', 'mediapipe', 'resnet'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setAiModel(m)}
                  className={`px-2.5 py-1 rounded-lg uppercase tracking-wider transition-colors ${
                    aiModel === m ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {m === 'yolov8x' ? 'YOLOv8x (Ultra)' : m === 'mediapipe' ? 'MediaPipe' : 'ResNet'}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Ultra-Precision Video Stream */}
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

              {/* High-Precision AI Overlay */}
              {selectedFeed.status !== 'offline' && (
                <PrecisionAiOverlay feed={selectedFeed} showSkeletons={showSkeletons} showGaze={showGaze} />
              )}

              {/* Header Badge Overlay */}
              <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-20">
                <Badge
                  variant={selectedFeed.severity === 'critical' ? 'danger' : selectedFeed.severity === 'warning' ? 'warning' : 'success'}
                  className="bg-slate-900/90 text-white border border-white/10 backdrop-blur-md px-3 py-1 font-mono text-xs shadow-md font-extrabold"
                  dot
                >
                  {selectedFeed.malpracticeType}
                </Badge>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-600/90 backdrop-blur-md px-3 py-1 text-xs font-mono font-bold text-white shadow-md">
                  MODEL: {aiModel.toUpperCase()} (INFERENCE 8.4MS)
                </span>
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

              {/* Bottom Precision Telemetry Overlay */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-20">
                <div className="flex items-center gap-3 rounded-xl bg-black/85 backdrop-blur-md px-3.5 py-1.5 border border-white/10 text-xs font-mono text-white/90 shadow-md">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <Scan className="h-3.5 w-3.5" /> High-Accuracy Engine
                  </span>
                  <span className="text-white/30">|</span>
                  <span>Yaw: <strong className="text-amber-300">{selectedFeed.headYaw}°</strong></span>
                  <span className="text-white/30">|</span>
                  <span>Pitch: <strong className="text-amber-300">{selectedFeed.pitch}°</strong></span>
                  <span className="text-white/30 hidden sm:inline">|</span>
                  <span className="hidden sm:inline">Confidence: <strong className="text-emerald-400">{selectedFeed.confidence}%</strong></span>
                </div>
                <div className="text-xs font-mono text-white/80 bg-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 shadow-md">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Video Controls Bar */}
            <div className="flex flex-wrap items-center justify-between border-t border-olive/10 dark:border-slate-800 p-4 gap-3">
              <div className="flex items-center gap-2">
                <Button size="sm" leftIcon={<Camera className="h-4 w-4" />}>
                  Export Evidence Frame
                </Button>
                <Button variant="secondary" size="sm" leftIcon={<ShieldAlert className="h-4 w-4 text-red-500" />}>
                  Alert Chief Proctor
                </Button>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <Cpu className="h-4 w-4 text-primary dark:text-emerald-400" />
                <span>Active Model: <strong className="text-emerald-600 dark:text-emerald-400">YOLOv8x-Exam + MediaPipe Pose</strong></span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* High-Accuracy Malpractice Stream */}
        <Card className="flex flex-col shadow-lg border-olive/20 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              High-Precision Flags Stream
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

                  <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 mt-1 font-bold">
                    Target Box: {anomaly.boxCoords}
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
            High-Confidence Malpractice Frame Captures
          </CardTitle>
          <span className="text-xs font-mono text-slate-400">Precision Bounding Frames</span>
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
    </div>
  );
}
