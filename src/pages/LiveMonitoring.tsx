import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { BorderGlow } from '../components/common/BorderGlow';
import { AnimatedList } from '../components/common/AnimatedList';
import { Carousel } from '../components/common/Carousel';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import {
  Video, Maximize, Minimize, AlertTriangle, Settings, Circle,
  Camera, MicOff, Volume2, Grid3X3, Clock, Image, ShieldAlert,
  Eye, Cpu, CheckCircle2, UserX, Smartphone, RotateCcw, Play, Pause,
  Download, Filter, RefreshCw
} from 'lucide-react';

interface CameraFeed {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'recording';
  recording: boolean;
  alerts: number;
  videoBg: string;
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
  snapshotUrl?: string;
  actionTaken?: boolean;
}

const cameraFeeds: CameraFeed[] = [
  { id: 'CAM-001', name: 'Hall A — Front Row', location: 'Examination Hall A', status: 'recording', recording: true, alerts: 0, videoBg: '#0f172a' },
  { id: 'CAM-002', name: 'Hall A — Rear View', location: 'Examination Hall A', status: 'recording', recording: true, alerts: 1, videoBg: '#0b1329' },
  { id: 'CAM-003', name: 'Hall B — Center Aisle', location: 'Examination Hall B', status: 'recording', recording: true, alerts: 2, videoBg: '#091c15' },
  { id: 'CAM-004', name: 'Hall B — Exit Bay', location: 'Examination Hall B', status: 'online', recording: false, alerts: 0, videoBg: '#1e1b4b' },
  { id: 'CAM-005', name: 'Lab 3 — Station Alpha', location: 'Computer Lab 3', status: 'recording', recording: true, alerts: 0, videoBg: '#172554' },
  { id: 'CAM-006', name: 'Lab 3 — Station Beta', location: 'Computer Lab 3', status: 'offline', recording: false, alerts: 0, videoBg: '#1e293b' },
];

const initialAnomalies: Anomaly[] = [
  {
    id: 'ANO-8941',
    severity: 'critical',
    title: 'Unauthorized Mobile Device Detected',
    description: 'Object detector flagged smartphone held under desk level at Desk #14.',
    camera: 'Hall B — Center Aisle (CAM-003)',
    studentId: 'STU-2024-88',
    timestamp: '10:48:22 AM',
    confidence: 94.8,
  },
  {
    id: 'ANO-8940',
    severity: 'warning',
    title: 'Persistent Off-Screen Head Pose',
    description: 'Student turned head > 60° to the right for 12 consecutive seconds.',
    camera: 'Hall A — Rear View (CAM-002)',
    studentId: 'STU-2024-42',
    timestamp: '10:45:09 AM',
    confidence: 88.3,
  },
  {
    id: 'ANO-8939',
    severity: 'warning',
    title: 'Multiple Face Bounding Boxes',
    description: 'Second face detected in background frame near aisle row 3.',
    camera: 'Hall B — Center Aisle (CAM-003)',
    studentId: 'STU-2024-91',
    timestamp: '10:39:50 AM',
    confidence: 91.2,
  },
  {
    id: 'ANO-8938',
    severity: 'info',
    title: 'Face Verification Completed',
    description: 'Biometric match score 99.4% confirmed against candidate roster.',
    camera: 'Lab 3 — Station Alpha (CAM-005)',
    studentId: 'STU-2024-12',
    timestamp: '10:30:15 AM',
    confidence: 99.4,
    actionTaken: true,
  },
];

const mockSnapshots = [
  { id: 's1', time: '10:48 AM', label: 'Mobile Device Detected — Desk #14', confidence: '94.8%', severity: 'critical' },
  { id: 's2', time: '10:45 AM', label: 'Head Pose Warning — Seat #22', confidence: '88.3%', severity: 'warning' },
  { id: 's3', time: '10:39 AM', label: 'Secondary Person in Frame', confidence: '91.2%', severity: 'warning' },
  { id: 's4', time: '10:30 AM', label: 'Identity Verification Success', confidence: '99.4%', severity: 'info' },
  { id: 's5', time: '10:15 AM', label: 'Rapid Head Gaze Shift Alert', confidence: '85.1%', severity: 'warning' },
];

/* ── Simulated Video Stream Canvas Component ─────── */
function SimulatedVideoStream({ feed, isPlaying }: { feed: CameraFeed; isPlaying: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const render = () => {
      frame++;
      const width = canvas.width;
      const height = canvas.height;

      // Dark background with CCTV grid overlay
      ctx.fillStyle = feed.status === 'offline' ? '#0f172a' : '#041308';
      ctx.fillRect(0, 0, width, height);

      if (feed.status === 'offline') {
        // Render offline screen
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CAMERA SIGNAL OFFLINE', width / 2, height / 2 - 10);
        ctx.font = '14px monospace';
        ctx.fillText(`NO FEED FROM ${feed.id}`, width / 2, height / 2 + 20);
        return;
      }

      // Draw subtle desk rows / environment setup
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let y = 80; y < height; y += 70) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Simulated examinees (3 student silhouettes with AI bounding boxes)
      const students = [
        { id: 'STU-01', x: width * 0.22, y: height * 0.38, w: 90, h: 120, state: 'normal', name: 'John Doe [99.2%]' },
        { id: 'STU-02', x: width * 0.52, y: height * 0.35, w: 95, h: 125, state: feed.id.includes('CAM-003') ? 'critical' : 'normal', name: feed.id.includes('CAM-003') ? 'PHONE DETECTED! [94.8%]' : 'Jane Smith [98.5%]' },
        { id: 'STU-03', x: width * 0.78, y: height * 0.40, w: 85, h: 115, state: feed.id.includes('CAM-002') ? 'warning' : 'normal', name: feed.id.includes('CAM-002') ? 'HEAD POSE: 45° R [88.3%]' : 'Alex Chen [97.1%]' },
      ];

      students.forEach((st) => {
        // Draw head silhouette
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.beginPath();
        ctx.arc(st.x + st.w / 2, st.y + 25, 22, 0, Math.PI * 2);
        ctx.fill();

        // Draw body silhouette
        ctx.beginPath();
        ctx.ellipse(st.x + st.w / 2, st.y + st.h - 20, 35, 45, 0, Math.PI, Math.PI * 2);
        ctx.fill();

        // Color based on status
        let strokeColor = '#3BB54A'; // green
        let labelBg = 'rgba(59, 181, 74, 0.85)';
        if (st.state === 'warning') {
          strokeColor = '#FFF100'; // yellow
          labelBg = 'rgba(123, 84, 14, 0.9)';
        } else if (st.state === 'critical') {
          strokeColor = '#ef4444'; // red
          labelBg = 'rgba(220, 38, 38, 0.9)';
        }

        // Animated bounding box corner accents
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = st.state === 'critical' ? 2.5 : 1.5;
        const bounce = Math.sin((frame + st.x) * 0.05) * (st.state === 'critical' ? 3 : 1);
        const bx = st.x;
        const by = st.y + bounce;
        const bw = st.w;
        const bh = st.h;

        // Bounding box rect
        ctx.strokeRect(bx, by, bw, bh);

        // Corner accents
        const cLen = 12;
        ctx.lineWidth = 3;
        ctx.beginPath();
        // Top-Left
        ctx.moveTo(bx, by + cLen); ctx.lineTo(bx, by); ctx.lineTo(bx + cLen, by);
        // Top-Right
        ctx.moveTo(bx + bw - cLen, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by + cLen);
        // Bottom-Right
        ctx.moveTo(bx + bw, by + bh - cLen); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw - cLen, by + bh);
        // Bottom-Left
        ctx.moveTo(bx + cLen, by + bh); ctx.lineTo(bx, by + bh); ctx.lineTo(bx, by + bh - cLen);
        ctx.stroke();

        // Label banner
        ctx.fillStyle = labelBg;
        ctx.fillRect(bx, by - 22, bw, 20);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(st.name, bx + 4, by - 8);

        // If phone critical, draw highlighted phone box in hand area
        if (st.state === 'critical') {
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
          const px = bx + bw / 2 - 12;
          const py = by + bh - 35 + Math.sin(frame * 0.1) * 2;
          ctx.fillRect(px, py, 24, 32);
          ctx.strokeRect(px, py, 24, 32);

          ctx.fillStyle = '#ffffff';
          ctx.font = '8px monospace';
          ctx.fillText('PHONE', px + 2, py - 4);
        }
      });

      // Animated scan line effect
      const scanY = (frame * 2.5) % height;
      const grad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
      grad.addColorStop(0, 'rgba(59, 181, 74, 0)');
      grad.addColorStop(0.5, 'rgba(59, 181, 74, 0.15)');
      grad.addColorStop(1, 'rgba(59, 181, 74, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 20, width, 40);

      // Top CCTV telemetry overlay text
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`CAM: ${feed.id} | MODEL: YOLOv8s-Invigilate | FPS: ${(29.5 + Math.sin(frame * 0.1) * 0.5).toFixed(1)}`, 16, 28);

      if (isPlaying) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [feed, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={720}
      height={405}
      className="w-full h-full object-cover"
    />
  );
}

export default function LiveMonitoring() {
  const [selectedFeed, setSelectedFeed] = useState<CameraFeed>(cameraFeeds[0]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>(initialAnomalies);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning'>('all');

  const onlineCount = cameraFeeds.filter((f) => f.status !== 'offline').length;
  const activeAlertsCount = anomalies.filter((a) => !a.actionTaken).length;

  const handleActionTaken = (id: string) => {
    setAnomalies((prev) =>
      prev.map((item) => (item.id === id ? { ...item, actionTaken: true } : item))
    );
  };

  const filteredAnomalies = anomalies.filter((a) =>
    filterSeverity === 'all' ? true : a.severity === filterSeverity
  );

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Live Surveillance & AI Anomaly Stream"
        description="Real-time exam room CCTV stream, AI face & object tracking, anomaly telemetry"
        breadcrumb={[{ label: 'Live Monitoring' }]}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="success" dot>{onlineCount}/{cameraFeeds.length} Active Feeds</Badge>
            <Badge variant="warning">{activeAlertsCount} Unresolved Flags</Badge>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
              onClick={() => {
                setAnomalies(initialAnomalies);
              }}
            >
              Reset Feeds
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main feed viewer */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardContent className="p-0">
            <div className={`aspect-video w-full bg-slate-950 relative overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen w-screen' : 'rounded-t-2xl'}`}>
              {/* Animated Canvas Video Stream */}
              <SimulatedVideoStream feed={selectedFeed} isPlaying={isPlaying} />

              {/* Status Header Overlay */}
              <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                <Badge
                  variant={selectedFeed.status === 'offline' ? 'danger' : 'success'}
                  className="bg-slate-900/90 text-white border border-white/10 backdrop-blur-md px-3 py-1 font-mono text-xs"
                  dot
                >
                  {selectedFeed.status.toUpperCase()}
                </Badge>
                {selectedFeed.recording && (
                  <span className="flex items-center gap-1.5 rounded-full bg-red-600/90 backdrop-blur-md px-3 py-1 text-xs font-mono font-bold text-white shadow-sm">
                    <Circle className="h-2 w-2 fill-white animate-pulse-dot" />
                    LIVE REC
                  </span>
                )}
                <span className="rounded-full bg-black/60 text-white/90 backdrop-blur-md px-3 py-1 text-xs font-mono">
                  {selectedFeed.name}
                </span>
              </div>

              {/* Action Overlay Controls */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/80 text-white hover:bg-slate-800 transition-colors backdrop-blur-md border border-white/10"
                  aria-label={isPlaying ? 'Pause stream' : 'Play stream'}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/80 text-white hover:bg-slate-800 transition-colors backdrop-blur-md border border-white/10"
                  aria-label={audioEnabled ? 'Mute audio' : 'Enable audio'}
                >
                  {audioEnabled ? <Volume2 className="h-4 w-4 text-emerald-400" /> : <MicOff className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/80 text-white hover:bg-slate-800 transition-colors backdrop-blur-md border border-white/10"
                  aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </button>
              </div>

              {/* Bottom Telemetry Bar */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3 rounded-xl bg-black/70 backdrop-blur-md px-3.5 py-1.5 border border-white/10 text-xs font-mono text-white/90">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Cpu className="h-3.5 w-3.5" /> AI Engine Active
                  </span>
                  <span className="text-white/40">|</span>
                  <span>Latency: <strong className="text-white">14ms</strong></span>
                  <span className="text-white/40">|</span>
                  <span>Resolution: <strong className="text-white">1080p</strong></span>
                </div>
                <div className="text-xs font-mono text-white/70 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10">
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
                  Flag Proctor
                </Button>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Detection Models: <strong>YOLOv8 + HeadPose-ResNet</strong></span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Anomaly Data Feed */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Live Anomaly Data
            </CardTitle>
            <div className="flex gap-1">
              {(['all', 'critical', 'warning'] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    filterSeverity === sev
                      ? 'bg-primary text-white dark:bg-emerald-800'
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
                  className={`rounded-2xl border p-3.5 transition-all ${
                    anomaly.actionTaken
                      ? 'opacity-60 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30'
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
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-500 text-white font-bold text-xs">
                          <Smartphone className="h-3.5 w-3.5" />
                        </span>
                      ) : anomaly.severity === 'warning' ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500 text-white font-bold text-xs">
                          <UserX className="h-3.5 w-3.5" />
                        </span>
                      ) : (
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500 text-white font-bold text-xs">
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
                      {anomaly.confidence}% Confidence
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
                        Acknowledge & Log
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

      {/* Flagged AI Snapshots Carousel */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <Image className="h-5 w-5 text-primary dark:text-emerald-400" />
            AI Flagged Snapshots & Incident Clip Replay
          </CardTitle>
          <span className="text-xs font-mono text-slate-400">5 High-Confidence Frames</span>
        </CardHeader>
        <CardContent>
          <Carousel>
            {mockSnapshots.map((snap) => (
              <div
                key={snap.id}
                className="w-60 rounded-2xl border border-olive/15 dark:border-slate-800 p-3 bg-white dark:bg-slate-900 shadow-xs flex-shrink-0"
              >
                {/* Simulated frame snapshot canvas */}
                <div className="aspect-video w-full rounded-xl bg-slate-950 flex flex-col items-center justify-center mb-2.5 relative overflow-hidden border border-slate-800">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-900" />
                  <div className="relative z-10 text-center p-2">
                    <Camera className="h-6 w-6 text-emerald-400 mx-auto mb-1 opacity-80" />
                    <span className="text-[10px] font-mono text-emerald-300 bg-black/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      FRAME #{snap.id.toUpperCase()}
                    </span>
                  </div>
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

      {/* All Camera Feeds Grid */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <Camera className="h-5 w-5 text-primary dark:text-emerald-400" />
            Camera Roster & Channel Switcher
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
                  <div className="aspect-video w-full rounded-t-2xl bg-slate-950 flex items-center justify-center relative overflow-hidden">
                    <SimulatedVideoStream feed={feed} isPlaying={true} />

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
