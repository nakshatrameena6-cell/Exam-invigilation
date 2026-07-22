import { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { BorderGlow } from '../components/common/BorderGlow';
import { AnimatedList } from '../components/common/AnimatedList';
import { Carousel } from '../components/common/Carousel';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import {
  Video, Maximize, Minimize, AlertTriangle, Settings, Circle,
  Camera, MicOff, Volume2, Grid3X3, Clock, Image,
} from 'lucide-react';

interface CameraFeed {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'recording';
  recording: boolean;
  alerts: number;
}

const cameraFeeds: CameraFeed[] = [
  { id: 'CAM-001', name: 'Hall A - Front', location: 'Hall A', status: 'recording', recording: true, alerts: 0 },
  { id: 'CAM-002', name: 'Hall A - Rear', location: 'Hall A', status: 'recording', recording: true, alerts: 0 },
  { id: 'CAM-003', name: 'Hall B - Front', location: 'Hall B', status: 'online', recording: false, alerts: 1 },
  { id: 'CAM-004', name: 'Hall B - Rear', location: 'Hall B', status: 'offline', recording: false, alerts: 0 },
  { id: 'CAM-005', name: 'Lab 3 - Entry', location: 'Lab 3', status: 'recording', recording: true, alerts: 0 },
  { id: 'CAM-006', name: 'Lab 3 - Center', location: 'Lab 3', status: 'recording', recording: true, alerts: 1 },
];

const anomalies = [
  { id: 1, type: 'warning', title: 'Unusual movement detected', camera: 'Hall B - Rear (CAM-004)', time: '2 min ago', confidence: 87 },
  { id: 2, type: 'warning', title: 'Multiple faces detected', camera: 'Lab 3 - Center (CAM-006)', time: '15 min ago', confidence: 92 },
  { id: 3, type: 'clear', title: 'All clear', camera: 'Remaining cameras', time: 'Just now', confidence: 100 },
];

const snapshots = [
  { id: 's1', time: '10:42 AM', label: 'CAM-006 Alert Flag', confidence: '92%' },
  { id: 's2', time: '10:35 AM', label: 'CAM-003 Motion Event', confidence: '87%' },
  { id: 's3', time: '10:15 AM', label: 'Hall A Entry Verification', confidence: '99%' },
  { id: 's4', time: '09:50 AM', label: 'Lab 3 Attendance Scan', confidence: '98%' },
  { id: 's5', time: '09:30 AM', label: 'Hall B Door Sensor Flag', confidence: '84%' },
];

function CameraPreview({ feed, isSelected, onSelect }: { feed: CameraFeed; isSelected: boolean; onSelect: () => void }) {
  const content = (
    <button
      onClick={onSelect}
      className={`group w-full rounded-xl border text-left transition-all ${
        isSelected
          ? 'border-primary dark:border-emerald-500 ring-2 ring-primary/20'
          : 'border-olive/10 dark:border-slate-800 hover:border-olive/30 dark:hover:border-slate-700'
      }`}
    >
      <div className="aspect-video w-full rounded-t-xl bg-slate-900 flex items-center justify-center relative overflow-hidden">
        <Video className="h-6 w-6 text-white/30" />

        <div className="absolute top-2 left-2">
          {feed.status === 'recording' && (
            <span className="flex items-center gap-1 rounded-full bg-red-600/90 px-2 py-0.5 text-[10px] font-medium text-white">
              <Circle className="h-1.5 w-1.5 fill-white animate-pulse-dot" />
              REC
            </span>
          )}
          {feed.status === 'offline' && (
            <span className="rounded-full bg-slate-600/80 px-2 py-0.5 text-[10px] font-medium text-white">
              OFFLINE
            </span>
          )}
        </div>

        {feed.alerts > 0 && (
          <div className="absolute top-2 right-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-warning text-[10px] font-bold text-highlight">
              {feed.alerts}
            </span>
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-mono text-slate-400">{feed.id}</span>
          <Badge
            variant={feed.status === 'offline' ? 'danger' : feed.status === 'recording' ? 'success' : 'default'}
            className="text-[10px] px-1.5 py-0"
          >
            {feed.status}
          </Badge>
        </div>
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{feed.name}</p>
        <p className="text-xs text-slate-400">{feed.location}</p>
      </div>
    </button>
  );

  return isSelected ? <BorderGlow active={true}>{content}</BorderGlow> : content;
}

export default function LiveMonitoring() {
  const [selectedFeed, setSelectedFeed] = useState(cameraFeeds[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const onlineCount = cameraFeeds.filter((f) => f.status !== 'offline').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Monitoring"
        description="Real-time camera feeds and AI anomaly detection"
        breadcrumb={[{ label: 'Live Monitoring' }]}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="success" dot>{onlineCount}/{cameraFeeds.length} Online</Badge>
            <Button variant="secondary" size="sm" leftIcon={<Grid3X3 className="h-4 w-4" />}>
              Grid View
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main feed viewer */}
        <Card className="lg:col-span-2">
          <CardContent className="p-0">
            <div className={`aspect-video w-full bg-slate-900 flex items-center justify-center relative overflow-hidden ${isFullscreen ? 'rounded-none' : 'rounded-t-2xl'}`}>
              <div className="text-center text-white">
                <Video className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">{selectedFeed.name}</p>
                <p className="text-sm text-white/50 mt-1">{selectedFeed.id} — Live feed simulation</p>
              </div>

              <div className="absolute top-4 left-4 flex items-center gap-2">
                <Badge
                  variant={selectedFeed.status === 'offline' ? 'danger' : 'success'}
                  className="bg-slate-800/80 text-white border-0 backdrop-blur-sm"
                  dot
                >
                  {selectedFeed.status.toUpperCase()}
                </Badge>
                {selectedFeed.recording && (
                  <span className="flex items-center gap-1 rounded-full bg-red-600/90 px-2.5 py-1 text-xs font-medium text-white">
                    <Circle className="h-2 w-2 fill-white animate-pulse-dot" />
                    REC
                  </span>
                )}
              </div>

              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800/80 text-white hover:bg-slate-700 transition-colors backdrop-blur-sm"
                  aria-label={audioEnabled ? 'Mute audio' : 'Enable audio'}
                >
                  {audioEnabled ? <Volume2 className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800/80 text-white hover:bg-slate-700 transition-colors backdrop-blur-sm"
                  aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </button>
              </div>

              <div className="absolute bottom-4 left-4 text-xs text-white/50 font-mono">
                {new Date().toLocaleTimeString()} — {new Date().toLocaleDateString()}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-olive/10 dark:border-slate-800 p-4">
              <div className="flex items-center gap-3">
                <Button size="sm">Start Recording</Button>
                <Button variant="secondary" size="sm">Capture Snapshot</Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Settings className="h-4 w-4 text-primary dark:text-emerald-400" />
                <span>AI Detection: <span className="font-medium text-success dark:text-emerald-400">Active</span></span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Anomalies with AnimatedList */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-highlight dark:text-amber-400" />
              Active Anomalies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatedList>
              {anomalies.map((anomaly) => (
                <div
                  key={anomaly.id}
                  className={`rounded-xl border p-3.5 ${
                    anomaly.type === 'warning'
                      ? 'border-warning/20 bg-warning/5 dark:border-amber-900/40 dark:bg-amber-950/20'
                      : 'border-olive/10 dark:border-slate-800 bg-secondary-bg/50 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {anomaly.type === 'warning' ? (
                      <AlertTriangle className="h-5 w-5 text-highlight dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-success/20 text-success mt-0.5">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{anomaly.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{anomaly.camera}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <p className="text-xs text-slate-400">{anomaly.time}</p>
                        {anomaly.type === 'warning' && (
                          <Badge variant="warning" className="text-[10px] px-1.5 py-0">
                            {anomaly.confidence}% conf
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </AnimatedList>
          </CardContent>
        </Card>
      </div>

      {/* Snapshot Timeline Carousel */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Image className="h-4 w-4 text-primary dark:text-emerald-400" />
            AI Flagged Snapshots Timeline
          </CardTitle>
          <span className="text-xs text-slate-400">Horizontal Carousel</span>
        </CardHeader>
        <CardContent>
          <Carousel>
            {snapshots.map((snap) => (
              <div
                key={snap.id}
                className="w-56 rounded-xl border border-olive/15 dark:border-slate-800 p-3 bg-white dark:bg-slate-900 shadow-xs"
              >
                <div className="aspect-video w-full rounded-lg bg-slate-800 flex items-center justify-center mb-2.5 relative">
                  <Camera className="h-6 w-6 text-white/30" />
                  <span className="absolute top-1.5 right-1.5 rounded-md bg-slate-900/80 px-1.5 py-0.5 text-[9px] font-mono text-white">
                    {snap.time}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{snap.label}</p>
                <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {snap.time}
                  </span>
                  <span className="font-semibold text-success dark:text-emerald-400">{snap.confidence}</span>
                </div>
              </div>
            ))}
          </Carousel>
        </CardContent>
      </Card>

      {/* Camera Grid */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-primary dark:text-emerald-400" />
            Camera Grid
          </CardTitle>
          <span className="text-sm text-slate-500 dark:text-slate-400">{cameraFeeds.length} cameras</span>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cameraFeeds.map((feed) => (
              <CameraPreview
                key={feed.id}
                feed={feed}
                isSelected={selectedFeed.id === feed.id}
                onSelect={() => setSelectedFeed(feed)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
