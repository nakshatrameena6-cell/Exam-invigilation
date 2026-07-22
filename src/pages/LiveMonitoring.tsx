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
  Cpu, CheckCircle2, UserX, Play, Pause, RefreshCw, Scan,
  FileText, Eye, AlertCircle, Sparkles, Layers, Activity, Crosshair, MessageSquare
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
    name: 'Hall A — Exam Room Main Feed (Live Session)',
    location: 'Examination Hall A (Row 3, Desk 14)',
    status: 'recording',
    recording: true,
    alerts: 2,
    malpracticeType: '🗣️ Talking & Head Turn Detection',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-students-sitting-at-desks-in-a-classroom-43187-large.mp4',
    poster: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    severity: 'critical',
    targetLabel: '🚨 TALKING DETECTED AT BACK DESK [96.8%]',
    confidence: 96.8,
    boxPos: { x: 62, y: 32, w: 26, h: 42 },
    headYaw: 62.4,
    pitch: -18.2,
    wristPos: { x: 58, y: 65 },
  },
  {
    id: 'CAM-002',
    name: 'Hall A — Paper Pass & Hand Trajectory',
    location: 'Examination Hall A (Desk 22 & 23)',
    status: 'recording',
    recording: true,
    alerts: 1,
    malpracticeType: '📄 Unauthorized Paper / Sheet Transfer',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-female-student-reading-in-a-library-41541-large.mp4',
    poster: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
    severity: 'warning',
    targetLabel: '⚠️ WRIST TRAJECTORY OVERLAP [92.4%]',
    confidence: 92.4,
    boxPos: { x: 26, y: 26, w: 30, h: 48 },
    headYaw: 34.8,
    pitch: 12.1,
  },
  {
    id: 'CAM-003',
    name: 'Hall B — Primary Video Stream (Live Session)',
    location: 'Examination Hall B (Center Aisle)',
    status: 'recording',
    recording: true,
    alerts: 3,
    malpracticeType: '🗣️ Whispering / Candidate Interaction',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-people-working-in-a-modern-office-4328-large.mp4',
    poster: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80',
    severity: 'critical',
    targetLabel: '🚨 BACK ROW TALKING DETECTED [95.8%]',
    confidence: 95.8,
    boxPos: { x: 60, y: 30, w: 28, h: 44 },
    headYaw: -42.1,
    pitch: -8.4,
    wristPos: { x: 54, y: 62 },
  },
  {
    id: 'CAM-004',
    name: 'Hall B — Proxy Candidate & Proximity',
    location: 'Examination Hall B (Station 08)',
    status: 'recording',
    recording: true,
    alerts: 1,
    malpracticeType: '👤 Secondary Person / Proxy Candidate',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-people-working-in-a-modern-office-4328-large.mp4',
    poster: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    severity: 'critical',
    targetLabel: '🚨 SECOND FACE IN FRAME (PROXY)',
    confidence: 96.2,
    boxPos: { x: 60, y: 18, w: 26, h: 44 },
    headYaw: 5.1,
    pitch: 2.8,
  },
  {
    id: 'CAM-005',
    name: 'Lab 3 — Desk Reference & Chit Sheet',
    location: 'Computer Lab 3 (Bay B)',
    status: 'recording',
    recording: true,
    alerts: 1,
    malpracticeType: '📚 Formula Chit / Paper Under Sheet',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-working-on-her-laptop-in-an-office-42798-large.mp4',
    poster: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
    severity: 'warning',
    targetLabel: '⚠️ UNAPPROVED NOTES ON DESK [89.7%]',
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
    title: 'Suspicious Talking & Head Turn at Back Desk',
    malpracticeCategory: 'Talking / Verbal Interaction',
    description: '3D Audio-Visual Head Tracker flagged two candidates at the back row talking and interacting.',
    camera: 'Hall A — Exam Room Main Feed (CAM-001)',
    studentId: 'STU-2024-88',
    timestamp: '10:54:12 AM',
    confidence: 96.8,
    boxCoords: '[X:620, Y:320, W:260, H:420]',
  },
  {
    id: 'MAL-9103',
    severity: 'critical',
    title: 'Unpermitted Paper / Chit Passing Gesture',
    malpracticeCategory: 'Material Transfer Trajectory',
    description: 'PoseNet wrist keypoint trajectory detected hand extension and paper transfer between adjacent desks.',
    camera: 'Hall B — Primary Video Stream (CAM-003)',
    studentId: 'STU-2024-14',
    timestamp: '10:51:30 AM',
    confidence: 95.8,
    boxCoords: '[X:380, Y:380, W:320, H:440]',
  },
  {
    id: 'MAL-9102',
    severity: 'warning',
    title: 'Whispering / Verbal Communication Pattern',
    malpracticeCategory: 'Audio-Visual Communication',
    description: 'Lip motion tracking and head proximity flagged candidate communicating verbally with adjacent examinee.',
    camera: 'Hall A — Exam Room Main Feed (CAM-001)',
    studentId: 'STU-2024-42',
    timestamp: '10:48:05 AM',
    confidence: 92.4,
    boxCoords: '[X:260, Y:260, W:300, H:480]',
  },
  {
    id: 'MAL-9101',
    severity: 'critical',
    title: 'Proxy Candidate / Secondary Face in Frame',
    malpracticeCategory: 'Identity / Impersonation',
    description: 'Biometric FaceEngine-v4 flagged second unauthorized face standing near candidate workstation.',
    camera: 'Hall B — Proxy Candidate (CAM-004)',
    studentId: 'STU-2024-91',
    timestamp: '10:42:19 AM',
    confidence: 96.2,
    boxCoords: '[X:600, Y:180, W:260, H:440]',
  },
];

const mockSnapshots = [
  { id: 's1', time: '10:54 AM', label: 'Back Row Talking Detection Frame', confidence: '96.8%', severity: 'critical', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80', malpractice: '🗣️ Back Row Talking' },
  { id: 's2', time: '10:51 AM', label: 'Paper Pass Trajectory Snapshot', confidence: '95.8%', severity: 'critical', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=400&q=80', malpractice: '📄 Paper Pass' },
  { id: 's3', time: '10:48 AM', label: 'Whispering Head Proximity Flag', confidence: '92.4%', severity: 'warning', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80', malpractice: '🗣️ Whispering' },
  { id: 's4', time: '10:42 AM', label: 'Biometric Proxy Face Match Mismatch', confidence: '96.2%', severity: 'critical', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80', malpractice: '👤 Proxy Face' },
];

/* ── Dynamic AI Bounding Overlay (Turns Red During Talking/Suspect Activity) ── */
function DynamicVideoAiOverlay({
  feed,
  showSkeletons,
  showGaze,
  videoTime
}: {
  feed: CameraFeed;
  showSkeletons: boolean;
  showGaze: boolean;
  videoTime: number;
}) {
  // Time-synced trigger: If video plays during seconds 2.5–8.0 or 12.0–18.0, the two candidates at the back are flagged talking!
  const isBackRowTalking = (videoTime >= 2.0 && videoTime <= 8.5) || (videoTime >= 12.0 && videoTime <= 18.5) || feed.severity === 'critical';

  // Front Student (Normal)
  const studentFront = { x: 10, y: 32, w: 26, h: 48, name: 'STU-01 (NORMAL)', isRed: false };
  // Front-Center Student (Normal)
  const studentCenter = { x: 36, y: 30, w: 26, h: 46, name: 'STU-02 (NORMAL)', isRed: false };
  // Back-Right Student 1 (Talking/Suspect)
  const studentBack1 = { x: 62, y: 28, w: 24, h: 44, name: isBackRowTalking ? '🚨 STU-14 (TALKING! 96.8%)' : 'STU-14 (NORMAL)', isRed: isBackRowTalking };
  // Back-Right Student 2 (Talking Partner)
  const studentBack2 = { x: 74, y: 34, w: 22, h: 40, name: isBackRowTalking ? '🚨 STU-15 (TALKING! 95.4%)' : 'STU-15 (NORMAL)', isRed: isBackRowTalking };

  const students = [studentFront, studentCenter, studentBack1, studentBack2];

  return (
    <svg className="absolute inset-0 h-full w-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
      {/* Laser scan line */}
      <motion.line
        x1="0"
        y1="0"
        x2="100"
        y2="0"
        stroke={isBackRowTalking ? '#ef4444' : '#10b981'}
        strokeWidth="0.7"
        strokeOpacity="0.85"
        animate={{ y1: [0, 100, 0], y2: [0, 100, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />

      {/* Render Dynamic Bounding Box for Each Candidate in Frame */}
      {students.map((st, i) => {
        const strokeColor = st.isRed ? '#ef4444' : '#10b981';
        const fillBg = st.isRed ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.05)';
        const tagBg = st.isRed ? '#dc2626' : '#059669';

        return (
          <g key={i}>
            {/* Dynamic Bounding Box */}
            <rect
              x={st.x}
              y={st.y}
              width={st.w}
              height={st.h}
              fill={fillBg}
              stroke={strokeColor}
              strokeWidth={st.isRed ? '1.6' : '0.8'}
              strokeDasharray={st.isRed ? 'none' : '2 1'}
            />

            {/* Corner accents */}
            <path d={`M${st.x} ${st.y + 4} L${st.x} ${st.y} L${st.x + 4} ${st.y}`} fill="none" stroke={strokeColor} strokeWidth="1.5" />
            <path d={`M${st.x + st.w - 4} ${st.y} L${st.x + st.w} ${st.y} L${st.x + st.w} ${st.y + 4}`} fill="none" stroke={strokeColor} strokeWidth="1.5" />
            <path d={`M${st.x + st.w} ${st.y + st.h - 4} L${st.x + st.w} ${st.y + st.h} L${st.x + st.w - 4} ${st.y + st.h}`} fill="none" stroke={strokeColor} strokeWidth="1.5" />
            <path d={`M${st.x + 4} ${st.y + st.h} L${st.x} ${st.y + st.h} L${st.x} ${st.y + st.h - 4}`} fill="none" stroke={strokeColor} strokeWidth="1.5" />

            {/* Top Label Tag */}
            <rect
              x={st.x}
              y={st.y - 7}
              width={st.w + 6}
              height="6.5"
              fill={tagBg}
              rx="0.8"
            />
            <text
              x={st.x + 1.5}
              y={st.y - 2.2}
              fill="#ffffff"
              fontSize="1.9"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {st.name}
            </text>
          </g>
        );
      })}

      {/* Red Gaze Connection Ray between Back Row Talking Students */}
      {isBackRowTalking && showGaze && (
        <g>
          <motion.line
            x1="74"
            y1="40"
            x2="85"
            y2="42"
            stroke="#ef4444"
            strokeWidth="1.4"
            strokeDasharray="1.5 1"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
          <text x="72" y="38" fill="#ef4444" fontSize="2.2" fontFamily="monospace" fontWeight="bold">
            🗣️ INTERACTION
          </text>
        </g>
      )}

      {/* Bottom Telemetry Overlay */}
      <text x="3" y="97" fill="rgba(255,255,255,0.75)" fontSize="2.2" fontFamily="monospace">
        EXAMEYE-AI FEED • BACK ROW TALKING: {isBackRowTalking ? '🔴 DETECTED (CONF 96.8%)' : '🟢 NORMAL'} • TIME: {videoTime.toFixed(1)}s
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
  const [videoTime, setVideoTime] = useState(0);
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

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setVideoTime(videoRef.current.currentTime);
    }
  };

  const simulateMalpractice = (type: 'talking' | 'gaze' | 'chit' | 'proxy') => {
    const newId = `MAL-${Math.floor(1000 + Math.random() * 9000)}`;
    let newAnomaly: Anomaly;

    if (type === 'talking') {
      newAnomaly = {
        id: newId,
        severity: 'critical',
        title: 'DETECTED: Back Row Talking & Interaction',
        malpracticeCategory: 'Verbal Cheating',
        description: '3D Audio-Visual Head Tracker flagged two students at back row talking (STU-14 & STU-15).',
        camera: selectedFeed.name,
        studentId: 'STU-14 / STU-15',
        timestamp: new Date().toLocaleTimeString(),
        confidence: 96.8,
        boxCoords: '[X:620, Y:320, W:260, H:420]',
      };
      setTriggerNotification('🚨 TALKING DETECTED: Back Row Bounding Box Turned RED!');
    } else if (type === 'gaze') {
      newAnomaly = {
        id: newId,
        severity: 'warning',
        title: 'FLAGGED: Persistent Side Head Turn (+62.4°)',
        malpracticeCategory: 'Gaze Violation',
        description: 'Candidate head pose angle turned > 60° towards neighboring exam desk in video feed.',
        camera: selectedFeed.name,
        studentId: 'STU-SIM-88',
        timestamp: new Date().toLocaleTimeString(),
        confidence: 98.6,
        boxCoords: '[X:420, Y:350, W:280, H:480]',
      };
      setTriggerNotification('⚠️ SIDE GHOST GAZE FLAG: Head Turn Bounding Box Turned RED!');
    } else if (type === 'chit') {
      newAnomaly = {
        id: newId,
        severity: 'critical',
        title: 'FLAGGED: Paper Chit Transfer Trajectory',
        malpracticeCategory: 'Material Transfer',
        description: 'Hand wrist keypoint trajectory detected note passing gesture in video feed.',
        camera: selectedFeed.name,
        studentId: 'STU-SIM-14',
        timestamp: new Date().toLocaleTimeString(),
        confidence: 95.8,
        boxCoords: '[X:380, Y:380, W:320, H:440]',
      };
      setTriggerNotification('🚨 PAPER PASS FLAG: Hand Trajectory Bounding Box Turned RED!');
    } else {
      newAnomaly = {
        id: newId,
        severity: 'critical',
        title: 'FLAGGED: Proxy Candidate / Secondary Face',
        malpracticeCategory: 'Identity Fraud',
        description: 'Biometric FaceEngine 96.2% mismatch against registered candidate hall ticket roster.',
        camera: selectedFeed.name,
        studentId: 'STU-SIM-91',
        timestamp: new Date().toLocaleTimeString(),
        confidence: 96.2,
        boxCoords: '[X:600, Y:180, W:260, H:440]',
      };
      setTriggerNotification('🚨 PROXY FACE FLAG: Unregistered Candidate Box Turned RED!');
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
        title="Exam Hall Surveillance & Live Session Analytics"
        description="Dynamic AI Bounding Boxes — Green for normal sitting, Red when talking or suspicious activity is detected"
        breadcrumb={[{ label: 'Live Session Surveillance' }]}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="danger" dot>{criticalCount} Critical Cheating Flags</Badge>
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
            <span className="text-xs font-mono bg-black/30 px-3 py-1 rounded-full font-bold">BOUNDING BOX RED FLAG</span>
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
              <p className="text-sm font-extrabold text-white">Live Session Dynamic AI Detection Controls</p>
              <p className="text-xs text-emerald-300/80">Bounding boxes turn RED automatically when candidates talk or turn head</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => simulateMalpractice('talking')}
              className="flex items-center gap-1.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white px-3 py-2 text-xs font-bold transition-all shadow-xs"
            >
              <MessageSquare className="h-3.5 w-3.5" /> Flag Back Row Talking
            </button>
            <button
              onClick={() => simulateMalpractice('gaze')}
              className="flex items-center gap-1.5 rounded-xl bg-amber-600/90 hover:bg-amber-600 text-white px-3 py-2 text-xs font-bold transition-all shadow-xs"
            >
              <Eye className="h-3.5 w-3.5" /> Flag Side Head Turn
            </button>
            <button
              onClick={() => simulateMalpractice('chit')}
              className="flex items-center gap-1.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white px-3 py-2 text-xs font-bold transition-all shadow-xs"
            >
              <FileText className="h-3.5 w-3.5" /> Flag Paper Pass
            </button>
            <button
              onClick={() => simulateMalpractice('proxy')}
              className="flex items-center gap-1.5 rounded-xl bg-purple-600/90 hover:bg-purple-600 text-white px-3 py-2 text-xs font-bold transition-all shadow-xs"
            >
              <UserX className="h-3.5 w-3.5" /> Flag Proxy Candidate
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Live Session Stream Viewer */}
        <Card className="lg:col-span-2 overflow-hidden shadow-lg border-olive/20 dark:border-slate-800">
          <CardContent className="p-0">
            <div className={`aspect-video w-full bg-slate-950 relative overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen w-screen' : 'rounded-t-2xl'}`}>

              {/* Real Video Stream */}
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
                  onTimeUpdate={handleTimeUpdate}
                  className="h-full w-full object-cover"
                />
              )}

              {/* Dynamic Time-Synced AI Bounding Box Overlay */}
              {selectedFeed.status !== 'offline' && (
                <DynamicVideoAiOverlay
                  feed={selectedFeed}
                  showSkeletons={showSkeletons}
                  showGaze={showGaze}
                  videoTime={videoTime}
                />
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
                  FEED: {selectedFeed.id} (LIVE SESSION)
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

              {/* Bottom Telemetry Overlay */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-20">
                <div className="flex items-center gap-3 rounded-xl bg-black/85 backdrop-blur-md px-3.5 py-1.5 border border-white/10 text-xs font-mono text-white/90 shadow-md">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <Scan className="h-3.5 w-3.5" /> ExamEye Dynamic AI
                  </span>
                  <span className="text-white/30">|</span>
                  <span>Yaw: <strong className="text-amber-300">{selectedFeed.headYaw}°</strong></span>
                  <span className="text-white/30">|</span>
                  <span>Time: <strong className="text-emerald-300">{videoTime.toFixed(1)}s</strong></span>
                  <span className="text-white/30 hidden sm:inline">|</span>
                  <span className="hidden sm:inline">Match: <strong className="text-emerald-400">{selectedFeed.confidence}%</strong></span>
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
                <span>Bounding Box Engine: <strong className="text-emerald-600 dark:text-emerald-400">Green (Normal) ➔ Red (Talking/Suspect)</strong></span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Session Malpractice Logs */}
        <Card className="flex flex-col shadow-lg border-olive/20 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Live Session Malpractice Logs
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
                          <AlertTriangle className="h-3.5 w-3.5" />
                        </span>
                      ) : anomaly.severity === 'warning' ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500 text-white font-bold text-xs shadow-xs">
                          <Eye className="h-3.5 w-3.5" />
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

      {/* Flagged Video Frame Captures Carousel */}
      <Card className="shadow-lg border-olive/20 dark:border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <Image className="h-5 w-5 text-primary dark:text-emerald-400" />
            Live Session Malpractice Evidence Captures
          </CardTitle>
          <span className="text-xs font-mono text-slate-400">Video Bounding Frames</span>
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
