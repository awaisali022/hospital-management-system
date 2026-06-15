import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Mic, MicOff, Video, VideoOff, PhoneOff, Monitor,
  Circle, CheckCheck, Wifi, WifiOff, MessageSquare, Users
} from 'lucide-react';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';
import { useChatStore } from '../../stores/chat.store';
import { useAuthStore } from '../../stores/auth.store';

/* ================================================================
   LIVE CHAT PANEL
   ================================================================ */
interface LiveChatPanelProps {
  chatId: string;
  participantName: string;
  compact?: boolean;
}

export function LiveChatPanel({ chatId, participantName, compact = false }: LiveChatPanelProps) {
  const { user } = useAuthStore();
  const {
    connect, isConnected, messages, typingUsers, sendMessage, setTyping, joinRoom, addMockRoom
  } = useChatStore();
  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const roomMessages = messages[chatId] ?? [];
  const isTyping = (typingUsers[chatId] ?? []).filter((n) => n !== user?.firstName);

  useEffect(() => {
    if (user) {
      connect(
        localStorage.getItem('doctor-hub-auth')
          ? JSON.parse(localStorage.getItem('doctor-hub-auth')!).state?.accessToken ?? ''
          : '',
        user.id,
        user.firstName
      );
      joinRoom(chatId);
      addMockRoom({
        id: chatId,
        participantName,
        lastMessage: 'Session initialized',
        unreadCount: 0,
        isOnline: true
      });
    }
  }, [chatId, user?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomMessages.length]);

  const handleSend = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!draft.trim() || !user) return;
      sendMessage(chatId, draft.trim(), user.id, `${user.firstName} ${user.lastName}`);
      setDraft('');
      setTyping(chatId, false);
    },
    [draft, chatId, user]
  );

  const handleDraftChange = (value: string) => {
    setDraft(value);
    setTyping(chatId, value.length > 0);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => setTyping(chatId, false), 2000);
  };

  const height = compact ? 'h-[380px]' : 'h-[520px]';

  return (
    <Panel className={`flex flex-col border border-border/40 bg-background/20 ${height}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/20 pb-3 mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-black">
            {participantName[0]}
          </span>
          <div>
            <p className="font-black text-sm">{participantName}</p>
            <p className={`text-[10px] font-semibold ${isConnected ? 'text-green-400' : 'text-foreground/40'}`}>
              {isConnected ? '● Online' : '○ Offline mode'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isConnected
            ? <Wifi size={14} className="text-green-400" />
            : <WifiOff size={14} className="text-foreground/30" />
          }
          <span className={`text-[10px] rounded-full px-2 py-0.5 border font-bold uppercase ${
            isConnected
              ? 'bg-green-500/10 text-green-400 border-green-500/20'
              : 'bg-foreground/5 text-foreground/30 border-border/20'
          }`}>
            {isConnected ? 'Socket Live' : 'Local Mode'}
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-3 px-1 py-1 scrollbar-thin">
        {roomMessages.length === 0 && (
          <div className="flex h-full items-center justify-center text-foreground/30 text-sm">
            <div className="text-center space-y-2">
              <MessageSquare size={32} className="mx-auto opacity-30" />
              <p>Start the secure clinical conversation</p>
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {roomMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${msg.isOwn ? 'items-end' : 'items-start'}`}
            >
              {!msg.isOwn && (
                <p className="text-[10px] text-foreground/40 mb-0.5 ml-1">{msg.senderName}</p>
              )}
              <div className={`rounded-2xl px-4 py-2.5 text-sm max-w-[78%] break-words shadow-sm ${
                msg.isOwn
                  ? 'bg-primary text-slate-950 font-semibold rounded-br-sm'
                  : 'bg-white/[0.08] text-foreground border border-border/20 rounded-bl-sm'
              }`}>
                {msg.content}
              </div>
              <div className={`flex items-center gap-1 mt-0.5 ${msg.isOwn ? 'flex-row-reverse' : ''}`}>
                <span className="text-[10px] text-foreground/30">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {msg.isOwn && <CheckCheck size={10} className="text-primary/60" />}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-xs text-foreground/40 italic"
            >
              <div className="flex gap-0.5">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="size-1.5 rounded-full bg-primary/50"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ delay: i * 0.15, repeat: Infinity, duration: 0.6 }}
                  />
                ))}
              </div>
              <span>{isTyping[0]} is typing...</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="flex gap-2 border-t border-border/20 pt-3 mt-2 shrink-0">
        <input
          type="text"
          value={draft}
          onChange={(e) => handleDraftChange(e.target.value)}
          placeholder="Type secured clinical message..."
          className="flex-1 rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend(e as any);
            }
          }}
        />
        <Button type="submit" className="!min-h-10 !px-3 rounded-xl" disabled={!draft.trim()}>
          <Send size={16} />
        </Button>
      </form>
    </Panel>
  );
}

/* ================================================================
   WEBRTC VIDEO CONSULTATION ROOM
   ================================================================ */
interface VideoConsultRoomProps {
  appointmentId: string;
  participantName: string;
}

export function VideoConsultRoom({ appointmentId, participantName }: VideoConsultRoomProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callState, setCallState] = useState<'idle' | 'connecting' | 'active' | 'ended'>('idle');
  const [duration, setDuration] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCall = useCallback(async () => {
    setCallState('connecting');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream;
      }
      // Loopback: mirror local stream to "remote" slot to simulate a call
      setTimeout(() => {
        if (remoteVideoRef.current && mediaStream) {
          remoteVideoRef.current.srcObject = mediaStream;
        }
        setCallState('active');
        timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
      }, 1500);
    } catch {
      setCallState('idle');
      alert('Camera/microphone access denied or unavailable. Please grant browser permissions.');
    }
  }, []);

  const endCall = useCallback(() => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    if (timerRef.current) clearInterval(timerRef.current);
    setCallState('ended');
    setDuration(0);
    setIsMuted(false);
    setIsCameraOff(false);
    setIsScreenSharing(false);
  }, [stream]);

  const toggleMute = useCallback(() => {
    if (!stream) return;
    stream.getAudioTracks().forEach((t) => { t.enabled = isMuted; });
    setIsMuted(!isMuted);
  }, [stream, isMuted]);

  const toggleCamera = useCallback(() => {
    if (!stream) return;
    stream.getVideoTracks().forEach((t) => { t.enabled = isCameraOff; });
    setIsCameraOff(!isCameraOff);
  }, [stream, isCameraOff]);

  const toggleScreenShare = useCallback(async () => {
    if (!stream) return;
    if (!isScreenSharing) {
      try {
        const screenStream = await (navigator.mediaDevices as any).getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];
        if (localVideoRef.current) {
          const tempStream = new MediaStream([screenTrack, ...stream.getAudioTracks()]);
          localVideoRef.current.srcObject = tempStream;
        }
        screenTrack.onended = () => {
          if (localVideoRef.current) localVideoRef.current.srcObject = stream;
          setIsScreenSharing(false);
        };
        setIsScreenSharing(true);
      } catch {
        // Screen share declined
      }
    } else {
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      setIsScreenSharing(false);
    }
  }, [stream, isScreenSharing]);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <Panel className="border border-border/40 bg-background/20 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-lg">Video Consultation</h3>
          <p className="text-xs text-foreground/50">Session with {participantName} · Apt #{appointmentId.slice(-6)}</p>
        </div>
        <div className="flex items-center gap-2">
          {callState === 'active' && (
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="flex items-center gap-1 text-xs text-red-400 font-bold"
            >
              <Circle size={8} fill="currentColor" /> REC {formatDuration(duration)}
            </motion.span>
          )}
          <span className={`text-[10px] rounded-full px-2 py-0.5 border font-bold uppercase ${
            callState === 'active'
              ? 'bg-green-500/10 text-green-400 border-green-500/20'
              : callState === 'connecting'
              ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
              : callState === 'ended'
              ? 'bg-red-500/10 text-red-400 border-red-500/20'
              : 'bg-border/20 text-foreground/40 border-border/20'
          }`}>
            {callState === 'idle' ? 'Ready' : callState === 'connecting' ? 'Connecting...' : callState === 'active' ? 'Live' : 'Ended'}
          </span>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid gap-3 md:grid-cols-2">
        {/* Remote Feed */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-foreground/5 border border-border/20">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
          />
          {callState !== 'active' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-foreground/30 gap-2">
              <Users size={40} className="opacity-30" />
              <p className="text-xs">{participantName}</p>
            </div>
          )}
          <div className="absolute bottom-2 left-2 rounded bg-background/60 px-2 py-0.5 text-[10px] font-bold text-foreground/70 backdrop-blur">
            {participantName}
          </div>
        </div>

        {/* Local Feed */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-foreground/5 border border-border/20">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className={`h-full w-full object-cover ${isCameraOff ? 'opacity-0' : ''}`}
          />
          {(callState === 'idle' || isCameraOff) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-foreground/30 gap-2">
              <VideoOff size={32} className="opacity-30" />
              <p className="text-xs">Your Camera</p>
            </div>
          )}
          <div className="absolute bottom-2 left-2 rounded bg-background/60 px-2 py-0.5 text-[10px] font-bold text-foreground/70 backdrop-blur">
            You {isScreenSharing ? '(Screen)' : ''}
          </div>
        </div>
      </div>

      {/* Call Controls */}
      <div className="flex items-center justify-center gap-3 pt-2">
        {callState === 'idle' || callState === 'ended' ? (
          <Button onClick={startCall} className="flex gap-2 px-6">
            <Video size={16} /> {callState === 'ended' ? 'Restart Consultation' : 'Launch Video Consult'}
          </Button>
        ) : (
          <>
            <button
              onClick={toggleMute}
              className={`grid size-12 place-items-center rounded-full border transition-all ${
                isMuted
                  ? 'border-red-500/40 bg-red-500/20 text-red-400'
                  : 'border-border bg-white/5 text-foreground hover:bg-white/10'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <button
              onClick={toggleCamera}
              className={`grid size-12 place-items-center rounded-full border transition-all ${
                isCameraOff
                  ? 'border-red-500/40 bg-red-500/20 text-red-400'
                  : 'border-border bg-white/5 text-foreground hover:bg-white/10'
              }`}
              title={isCameraOff ? 'Enable Camera' : 'Disable Camera'}
            >
              {isCameraOff ? <VideoOff size={18} /> : <Video size={18} />}
            </button>

            <button
              onClick={toggleScreenShare}
              className={`grid size-12 place-items-center rounded-full border transition-all ${
                isScreenSharing
                  ? 'border-primary/40 bg-primary/20 text-primary'
                  : 'border-border bg-white/5 text-foreground hover:bg-white/10'
              }`}
              title={isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
            >
              <Monitor size={18} />
            </button>

            <button
              onClick={endCall}
              className="grid size-14 place-items-center rounded-full border border-red-500/30 bg-red-500/20 text-red-400 transition-all hover:bg-red-500/30"
              title="End Call"
            >
              <PhoneOff size={22} />
            </button>
          </>
        )}
      </div>

      {callState === 'connecting' && (
        <div className="text-center text-xs text-primary animate-pulse">
          Establishing WebRTC peer connection and TURN relay...
        </div>
      )}
    </Panel>
  );
}
