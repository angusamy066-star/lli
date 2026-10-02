import { useState, useEffect, useRef, useCallback } from 'react';

export interface PeerMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
}

export interface WhiteboardStroke {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  color: string;
  size: number;
  isEraser: boolean;
}

export function useWebRTCRoom(
  roomCode: string,
  localStream: MediaStream | null,
  userName: string,
  onRemoteStroke?: (stroke: WhiteboardStroke) => void,
  onRemoteClear?: () => void
) {
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'waiting' | 'connected' | 'disconnected'
  >('waiting');
  const [peerMessages, setPeerMessages] = useState<PeerMessage[]>([]);
  const [peerName, setPeerName] = useState<string>('');

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const isInitiatorRef = useRef<boolean>(false);

  // Initialize WebRTC and Signaling Channel
  useEffect(() => {
    if (!roomCode) return;

    let isDisposed = false;
    const channelName = `learnx_signaling_${roomCode}`;
    const channel = new BroadcastChannel(channelName);
    channelRef.current = channel;

    // Create RTCPeerConnection
    const rtcConfig: RTCConfiguration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    const pc = new RTCPeerConnection(rtcConfig);
    peerConnectionRef.current = pc;

    // Attach local tracks if stream is ready
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    }

    // Remote track listener
    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
        setConnectionStatus('connected');
      }
    };

    // ICE Candidate handler
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        channel.postMessage({
          type: 'candidate',
          candidate: event.candidate,
          senderName: userName
        });
      }
    };

    // Connection state changes
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') {
        setConnectionStatus('connected');
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        setConnectionStatus('disconnected');
      }
    };

    // Handle incoming messages on signaling channel
    channel.onmessage = async (event) => {
      const data = event.data;
      if (!data || isDisposed) return;

      if (data.type === 'peer_join') {
        // Someone joined! If we are here first, we act as initiator and send offer
        setPeerName(data.userName);
        isInitiatorRef.current = true;
        setConnectionStatus('connecting');

        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          channel.postMessage({
            type: 'offer',
            sdp: offer,
            userName
          });
        } catch (err) {
          console.warn('Error creating WebRTC offer:', err);
        }
      } else if (data.type === 'offer') {
        // Received offer from peer
        if (data.userName) setPeerName(data.userName);
        setConnectionStatus('connecting');

        try {
          await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          channel.postMessage({
            type: 'answer',
            sdp: answer,
            userName
          });
        } catch (err) {
          console.warn('Error handling WebRTC offer:', err);
        }
      } else if (data.type === 'answer') {
        // Received answer from peer
        if (data.userName) setPeerName(data.userName);
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
          setConnectionStatus('connected');
        } catch (err) {
          console.warn('Error setting remote description from answer:', err);
        }
      } else if (data.type === 'candidate') {
        // Received ICE candidate
        try {
          if (data.candidate) {
            await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
          }
        } catch (err) {
          console.warn('Error adding ICE candidate:', err);
        }
      } else if (data.type === 'chat') {
        // Chat message from peer
        setPeerMessages((prev) => [
          ...prev,
          {
            id: `msg-peer-${Date.now()}-${Math.random()}`,
            sender: data.sender || 'Partner',
            text: data.text,
            time: data.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else if (data.type === 'whiteboard_stroke') {
        if (onRemoteStroke && data.stroke) {
          onRemoteStroke(data.stroke);
        }
      } else if (data.type === 'whiteboard_clear') {
        if (onRemoteClear) {
          onRemoteClear();
        }
      } else if (data.type === 'peer_leave') {
        setConnectionStatus('disconnected');
        setRemoteStream(null);
      }
    };

    // Announce our presence to the room
    channel.postMessage({
      type: 'peer_join',
      userName
    });

    return () => {
      isDisposed = true;
      channel.postMessage({ type: 'peer_leave', userName });
      channel.close();
      pc.close();
    };
  }, [roomCode, userName]);

  // Update tracks if localStream changes dynamically
  useEffect(() => {
    const pc = peerConnectionRef.current;
    if (!pc || !localStream) return;

    localStream.getTracks().forEach((track) => {
      const senders = pc.getSenders();
      const existingSender = senders.find((s) => s.track?.kind === track.kind);
      if (existingSender) {
        existingSender.replaceTrack(track);
      } else {
        pc.addTrack(track, localStream);
      }
    });
  }, [localStream]);

  // Send real chat message
  const sendChatMessage = useCallback(
    (text: string) => {
      const channel = channelRef.current;
      const msg: PeerMessage = {
        id: `msg-local-${Date.now()}`,
        sender: userName,
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setPeerMessages((prev) => [...prev, msg]);

      if (channel) {
        channel.postMessage({
          type: 'chat',
          sender: userName,
          text,
          time: msg.time
        });
      }
    },
    [userName]
  );

  // Broadcast whiteboard stroke
  const broadcastStroke = useCallback((stroke: WhiteboardStroke) => {
    const channel = channelRef.current;
    if (channel) {
      channel.postMessage({
        type: 'whiteboard_stroke',
        stroke
      });
    }
  }, []);

  // Broadcast whiteboard clear
  const broadcastClear = useCallback(() => {
    const channel = channelRef.current;
    if (channel) {
      channel.postMessage({
        type: 'whiteboard_clear'
      });
    }
  }, []);

  return {
    remoteStream,
    connectionStatus,
    peerName,
    peerMessages,
    sendChatMessage,
    broadcastStroke,
    broadcastClear
  };
}
