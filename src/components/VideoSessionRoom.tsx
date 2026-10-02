import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { useWebRTCRoom, WhiteboardStroke } from '../hooks/useWebRTCRoom';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Camera,
  RefreshCw,
  PhoneOff,
  Monitor,
  PenTool,
  MessageSquare,
  FileText,
  Clock,
  Copy,
  Check,
  RotateCcw,
  Download,
  Send,
  Users,
  ExternalLink,
  Volume2,
  Wifi,
  ArrowLeft,
  AlertTriangle
} from 'lucide-react';

export const VideoSessionRoom: React.FC = () => {
  const { activeLiveSession, endLiveSessionRoom, leaveLiveSessionRoom, user } = useApp();

  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'video' | 'whiteboard' | 'chat' | 'notes'>('video');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Modals
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState<boolean>(false);
  const [showEndSessionConfirmation, setShowEndSessionConfirmation] = useState<boolean>(false);

  // Media references
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selectedFacingMode, setSelectedFacingMode] = useState<'user' | 'environment'>('user');
  const [isRequestingCamera, setIsRequestingCamera] = useState<boolean>(false);

  // Whiteboard references & state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawColor, setDrawColor] = useState<string>('#4f46e5');
  const [brushSize, setBrushSize] = useState<number>(3);
  const [whiteboardTool, setWhiteboardTool] = useState<'pen' | 'eraser'>('pen');
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  // Handle remote stroke drawing
  const handleRemoteStroke = useCallback((stroke: WhiteboardStroke) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(stroke.x0, stroke.y0);
    ctx.lineTo(stroke.x1, stroke.y1);
    ctx.strokeStyle = stroke.isEraser ? '#ffffff' : stroke.color;
    ctx.lineWidth = stroke.isEraser ? stroke.size * 4 : stroke.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }, []);

  const handleRemoteClear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // WebRTC Hook
  const {
    remoteStream,
    connectionStatus,
    peerName,
    peerMessages,
    sendChatMessage,
    broadcastStroke,
    broadcastClear
  } = useWebRTCRoom(
    activeLiveSession?.roomCode || 'LX-ROOM',
    localStream,
    user?.name || 'Learner',
    handleRemoteStroke,
    handleRemoteClear
  );

  const [chatInput, setChatInput] = useState<string>('');

  // Notes state
  const [notes, setNotes] = useState<string>(
    `# Session Notes: ${activeLiveSession?.skill || 'Skill Exchange'}\nDate: ${new Date().toLocaleDateString()}\nRoom Code: ${activeLiveSession?.roomCode}\nTeacher: ${activeLiveSession?.teacherName}\nLearner: ${activeLiveSession?.learnerName}\n\n## Action Items & Summary:\n- \n- \n`
  );

  // Initialize Camera/Mic Stream
  useEffect(() => {
    let isMounted = true;

    async function initMedia() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: true
          });

          if (!isMounted) {
            stream.getTracks().forEach((track) => track.stop());
            return;
          }

          setLocalStream(stream);
          setHasCameraPermission(true);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        } else {
          setHasCameraPermission(false);
        }
      } catch (err) {
        if (isMounted) {
          setHasCameraPermission(false);
        }
      }
    }

    initMedia();

    // Session Timer
    const timerInterval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(timerInterval);
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Attach remote stream to remote video element
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Format Elapsed Time
  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle Mic
  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !isMicOn;
      });
    }
    setIsMicOn(!isMicOn);
  };

  // Explicit Enable Camera Action
  const enableCamera = async () => {
    setIsRequestingCamera(true);
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: selectedFacingMode
          },
          audio: false
        });

        const newVideoTrack = stream.getVideoTracks()[0];
        if (!newVideoTrack) {
          setCameraError('No video track available from device.');
          setIsRequestingCamera(false);
          return;
        }

        let combinedStream: MediaStream;
        if (localStream) {
          localStream.getVideoTracks().forEach((track) => {
            track.stop();
            localStream.removeTrack(track);
          });
          localStream.addTrack(newVideoTrack);
          combinedStream = new MediaStream([...localStream.getAudioTracks(), newVideoTrack]);
        } else {
          combinedStream = stream;
        }

        setLocalStream(combinedStream);
        setHasCameraPermission(true);
        setIsVideoOn(true);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = combinedStream;
        }
      } else {
        setCameraError('Camera API is not supported on this browser/environment.');
      }
    } catch (err: any) {
      console.warn('Camera request error:', err);
      setCameraError(err.message || 'Camera permission was denied. Please allow camera access in browser.');
      setHasCameraPermission(false);
    } finally {
      setIsRequestingCamera(false);
    }
  };

  // Switch camera facing mode (front / back)
  const switchCameraFacingMode = async () => {
    const nextMode = selectedFacingMode === 'user' ? 'environment' : 'user';
    setSelectedFacingMode(nextMode);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: nextMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      const newTrack = stream.getVideoTracks()[0];
      if (localStream && newTrack) {
        localStream.getVideoTracks().forEach((track) => {
          track.stop();
          localStream.removeTrack(track);
        });
        localStream.addTrack(newTrack);
        const combined = new MediaStream([...localStream.getAudioTracks(), newTrack]);
        setLocalStream(combined);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = combined;
        }
      }
    } catch (err) {
      console.warn('Switch camera error:', err);
    }
  };

  // Toggle Video (Enables camera if currently off or missing track)
  const toggleVideo = () => {
    if (!isVideoOn) {
      // If we already have video tracks, just re-enable them
      const videoTracks = localStream ? localStream.getVideoTracks() : [];
      if (videoTracks.length > 0) {
        videoTracks.forEach((track) => {
          track.enabled = true;
        });
        setIsVideoOn(true);
      } else {
        // Request and attach video track
        enableCamera();
      }
    } else {
      // Turn off video
      if (localStream) {
        localStream.getVideoTracks().forEach((track) => {
          track.enabled = false;
        });
      }
      setIsVideoOn(false);
    }
  };

  // Screen Share Toggle
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      setIsScreenSharing(false);
      return;
    }

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = stream;
        setIsScreenSharing(true);
        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = stream;
        }

        stream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
        };
      }
    } catch (err) {
      console.warn('Screen share cancelled or not allowed');
    }
  };

  const inviteUrl = `${window.location.origin}${window.location.pathname}?room=${activeLiveSession?.roomCode || 'LX-LIVE'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Whiteboard drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    lastPosRef.current = { x, y };
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPosRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const currentX = (e.clientX - rect.left) * scaleX;
    const currentY = (e.clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(currentX, currentY);
    ctx.strokeStyle = whiteboardTool === 'eraser' ? '#ffffff' : drawColor;
    ctx.lineWidth = whiteboardTool === 'eraser' ? brushSize * 4 : brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    broadcastStroke({
      x0: lastPosRef.current.x,
      y0: lastPosRef.current.y,
      x1: currentX,
      y1: currentY,
      color: drawColor,
      size: brushSize,
      isEraser: whiteboardTool === 'eraser'
    });

    lastPosRef.current = { x: currentX, y: currentY };
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPosRef.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    broadcastClear();
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `learnx-whiteboard-${Date.now()}.png`;
    a.click();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendChatMessage(chatInput.trim());
    setChatInput('');
  };

  const exportNotes = () => {
    const blob = new Blob([notes], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `learnx-session-notes-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!activeLiveSession) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      
      {/* 1. Session Top Navigation Bar */}
      <div className="h-14 px-4 sm:px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        
        {/* Left: Back button with confirmation modal */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLeaveConfirmation(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs"
            title="Back to Session Details"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-200 truncate max-w-[200px] sm:max-w-xs">
                {activeLiveSession.skill} Exchange
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-indigo-400 bg-indigo-950/70 border border-indigo-800/80 px-1.5 py-0.5 rounded">
                {activeLiveSession.roomCode}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>{activeLiveSession.teacherName} (Teacher) ↔ {activeLiveSession.learnerName} (Learner)</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                {connectionStatus === 'connected' ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LiveKit / WebRTC Connected
                  </span>
                ) : connectionStatus === 'connecting' ? (
                  <span className="text-amber-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    Connecting...
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1">
                    <Wifi className="w-3 h-3 text-slate-500" />
                    Waiting for peer
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Live Timer & Rule Reminder */}
        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-mono tabular-nums text-slate-200">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>{formatTimer(elapsedSeconds)}</span>
          <span className="text-slate-500">/</span>
          <span className="text-slate-400 text-[11px] font-sans">1 Credit</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {connectionStatus !== 'connected' && (
            <a
              href={inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 rounded-lg text-xs font-medium border border-indigo-700/60 transition-colors"
              title="Open a second window in this browser to test real-time 2-way streaming"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Partner Window</span>
            </a>
          )}

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
            title="Invite participant via link"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedLink ? 'Link Copied' : 'Invite Link'}</span>
          </button>

          <button
            onClick={() => setShowEndSessionConfirmation(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>End Session</span>
          </button>
        </div>

      </div>

      {/* 2. Main Stage & Workspace Deck */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Main Stage (Video or Whiteboard) */}
        <div className="flex-1 flex flex-col p-3 sm:p-4 bg-slate-950 overflow-hidden relative">
          
          {/* Main Visual Display */}
          {activeTab === 'whiteboard' ? (
            /* Interactive Whiteboard Canvas */
            <div className="flex-1 flex flex-col bg-white rounded-xl overflow-hidden shadow-lg border border-slate-800">
              <div className="h-11 px-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs text-slate-700 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <PenTool className="w-4 h-4 text-indigo-600" />
                    <span>Real-Time Collaborative Whiteboard</span>
                  </span>
                  <div className="h-4 w-px bg-slate-300 mx-1" />
                  
                  <button
                    onClick={() => setWhiteboardTool('pen')}
                    className={`p-1.5 rounded transition-colors ${
                      whiteboardTool === 'pen' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-200 text-slate-700'
                    }`}
                    title="Pencil"
                  >
                    <PenTool className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setWhiteboardTool('eraser')}
                    className={`p-1.5 rounded transition-colors ${
                      whiteboardTool === 'eraser' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-200 text-slate-700'
                    }`}
                    title="Eraser"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  {/* Colors */}
                  <div className="flex items-center gap-1 ml-2">
                    {['#4f46e5', '#0f172a', '#dc2626', '#16a34a', '#d97706'].map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          setDrawColor(color);
                          setWhiteboardTool('pen');
                        }}
                        style={{ backgroundColor: color }}
                        className={`w-5 h-5 rounded-full ring-1 ring-slate-300 transition-transform ${
                          drawColor === color && whiteboardTool === 'pen' ? 'scale-125 ring-2 ring-indigo-500' : ''
                        }`}
                      />
                    ))}
                  </div>

                  {/* Brush Size */}
                  <div className="flex items-center gap-1.5 ml-3">
                    <span className="text-[11px] text-slate-500">Size:</span>
                    <input
                      type="range"
                      min="1"
                      max="12"
                      value={brushSize}
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="w-16 accent-indigo-600 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={clearCanvas}
                    className="px-2.5 py-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 rounded transition-colors"
                  >
                    Clear Board
                  </button>
                  <button
                    onClick={downloadCanvas}
                    className="px-2.5 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded flex items-center gap-1 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save PNG</span>
                  </button>
                </div>
              </div>

              {/* Canvas Board */}
              <div className="flex-1 bg-white relative overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={1280}
                  height={720}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="w-full h-full cursor-crosshair touch-none"
                />
              </div>
            </div>
          ) : isScreenSharing ? (
            /* Screen Sharing Mode */
            <div className="flex-1 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 relative flex items-center justify-center">
              <video
                ref={screenVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-contain bg-black"
              />
              <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded text-xs font-semibold text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5" />
                <span>Screen Sharing Active</span>
              </div>
            </div>
          ) : (
            /* Dual Video Stream View (Local + Real Peer WebRTC Stream) */
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 overflow-hidden">
              
              {/* Remote Participant Video Stream */}
              <div className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800 relative flex items-center justify-center group shadow-md">
                {remoteStream ? (
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center max-w-sm">
                    <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-3 text-slate-400">
                      <Users className="w-8 h-8" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-200 mb-1">
                      Waiting for Learning Partner
                    </h4>
                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                      Share the invite link with your partner or open a second window to connect live.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={handleCopyLink}
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedLink ? 'Copied' : 'Copy Room Link'}</span>
                      </button>
                      <a
                        href={inviteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 border border-slate-700"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open Partner Tab</span>
                      </a>
                    </div>
                  </div>
                )}
                
                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      remoteStream ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                  <span>
                    {peerName || (remoteStream ? 'Connected Peer' : 'Partner Slot')}
                  </span>
                </div>

                {remoteStream && (
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-lg text-emerald-400 border border-slate-700">
                    <Volume2 className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Local Participant (User) */}
              <div className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800 relative flex items-center justify-center shadow-md">
                {hasCameraPermission && isVideoOn ? (
                  <>
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover scale-x-[-1]"
                    />
                    <button
                      onClick={switchCameraFacingMode}
                      className="absolute top-3 right-3 p-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors shadow-sm"
                      title="Switch Camera (Front / Back)"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center max-w-xs">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-950/80 border border-indigo-700/60 flex items-center justify-center mb-3 text-indigo-300 font-bold text-xl shadow-inner">
                      {user?.name ? user.name.slice(0, 2).toUpperCase() : 'ME'}
                    </div>
                    <span className="text-xs font-bold text-slate-200">
                      {user?.name || 'You'}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      Camera is currently turned off
                    </span>

                    {/* Prominent Enable Camera Option */}
                    <button
                      onClick={enableCamera}
                      disabled={isRequestingCamera}
                      className="mt-3.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{isRequestingCamera ? 'Connecting Camera...' : 'Enable Camera'}</span>
                    </button>

                    {cameraError && (
                      <p className="text-[11px] text-rose-400 mt-2 leading-tight">
                        {cameraError}
                      </p>
                    )}
                  </div>
                )}

                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-1.5">
                  <span>{user?.name || 'You'}</span>
                  {!isMicOn && <MicOff className="w-3.5 h-3.5 text-rose-400 ml-1" />}
                </div>
              </div>

            </div>
          )}

          {/* Floating Controls Bar */}
          <div className="mt-3 py-2 px-4 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-800 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMic}
                className={`p-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  isMicOn ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-rose-600 text-white'
                }`}
                title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
              >
                {isMicOn ? <Mic className="w-4 h-4 text-emerald-400" /> : <MicOff className="w-4 h-4" />}
                <span className="hidden sm:inline">{isMicOn ? 'Mute' : 'Unmuted'}</span>
              </button>

              <button
                onClick={toggleVideo}
                className={`p-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  isVideoOn
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                }`}
                title={isVideoOn ? 'Stop Camera' : 'Enable Camera'}
              >
                {isVideoOn ? <Video className="w-4 h-4 text-emerald-400" /> : <Camera className="w-4 h-4 text-white" />}
                <span className="hidden sm:inline">{isVideoOn ? 'Stop Video' : 'Enable Camera'}</span>
              </button>

              <button
                onClick={switchCameraFacingMode}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                title="Switch Camera (Front / Rear)"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Flip Camera</span>
              </button>

              <button
                onClick={toggleScreenShare}
                className={`p-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  isScreenSharing ? 'bg-indigo-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
                title="Share Screen"
              >
                <Monitor className="w-4 h-4" />
                <span className="hidden sm:inline">{isScreenSharing ? 'Sharing' : 'Share Screen'}</span>
              </button>
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('video')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  activeTab === 'video' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Video Grid
              </button>
              <button
                onClick={() => setActiveTab('whiteboard')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === 'whiteboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Whiteboard</span>
              </button>
            </div>

          </div>

        </div>

        {/* Right Collaboration Panel (Real Live Chat & Notes) */}
        <div className="w-80 lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0">
          
          <div className="h-11 px-3 border-b border-slate-800 flex items-center justify-between text-xs font-medium">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                  activeTab === 'chat' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Real-Time Chat</span>
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                  activeTab === 'notes' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Notes & Scratchpad</span>
              </button>
            </div>
            
            <span className="text-[11px] text-slate-400 tabular-nums">
              {connectionStatus === 'connected' ? '2 Connected' : '1 Online'}
            </span>
          </div>

          {activeTab === 'notes' ? (
            <div className="flex-1 p-3 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
                <span className="text-slate-400">Live Markdown Editor</span>
                <button
                  onClick={exportNotes}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                >
                  <Download className="w-3 h-3" />
                  <span>Download .md</span>
                </button>
              </div>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="flex-1 bg-slate-950 text-slate-200 p-3 rounded-lg border border-slate-800 text-xs font-mono resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                placeholder="Document key concepts, algorithms, links, or code..."
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 p-3 overflow-y-auto space-y-3">
                {peerMessages.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500">
                    <p>Live room chat started.</p>
                    <p className="mt-1 text-[11px] text-slate-600">Messages sent here are synced with your partner in real time.</p>
                  </div>
                ) : (
                  peerMessages.map((m) => {
                    const isMe = m.sender === (user?.name || 'Learner');
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col text-xs ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-500">
                          <span className="font-semibold text-slate-400">{m.sender}</span>
                          <span>{m.time}</span>
                        </div>
                        <div
                          className={`p-2.5 rounded-xl max-w-[85%] break-words ${
                            isMe
                              ? 'bg-indigo-600 text-white rounded-br-xs'
                              : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-bl-xs'
                          }`}
                        >
                          {m.text}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Send a real-time message..."
                  className="flex-1 bg-slate-950 text-slate-100 text-xs px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* Back Button Leave Session Confirmation Modal (Required by Spec) */}
      {showLeaveConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white text-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Leave Session?
            </h3>
            <p className="text-xs text-slate-600 mb-5">
              Are you sure you want to leave the session? You will return to Session Details without ending the call for your partner.
            </p>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setShowLeaveConfirmation(false)}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Continue Session
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLeaveConfirmation(false);
                  leaveLiveSessionRoom();
                }}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Leave Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* End Session Confirmation Modal */}
      {showEndSessionConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white text-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-1">
              End Live Session Call
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              You completed <strong className="text-slate-900">{formatTimer(elapsedSeconds)}</strong> of live exchange on {activeLiveSession.skill}.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 mb-4 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-900">Dual Confirmation Rule:</p>
              <p>Both teacher and learner will be prompted to confirm completion.</p>
              <p>Once verified by both participants, 1 Time Credit is transferred to the teacher.</p>
              <p className="text-slate-400 text-[11px]">(Sessions under 10 minutes do not receive credit)</p>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowEndSessionConfirmation(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Resume Call
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEndSessionConfirmation(false);
                  endLiveSessionRoom();
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-sm"
              >
                End Call & Proceed to Verification
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
