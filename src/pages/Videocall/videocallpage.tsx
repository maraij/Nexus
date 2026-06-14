import { useState, useRef, useEffect } from "react";

export default function VideoCallPage() {
  const [callStarted, setCallStarted] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    stopTimer();
    setCallDuration(0);
    timerRef.current = setInterval(() => setCallDuration(prev => prev + 1), 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = stream;

      setCallStarted(true);
      setMicOn(true);
      setCamOn(true);
      startTimer();
    } catch (error) {
      alert("Camera or Microphone access denied. Please allow permissions.");
    }
  };

  const endCall = () => {
    if (localStreamRef.current) localStreamRef.current.getTracks().forEach(track => track.stop());
    if (screenStreamRef.current) screenStreamRef.current.getTracks().forEach(track => track.stop());

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    setCallStarted(false);
    setScreenSharing(false);
    stopTimer();
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !micOn;
        setMicOn(!micOn);
      }
    }
  };

  const toggleCam = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !camOn;
        setCamOn(!camOn);
      }
    }
  };

  const toggleScreenShare = async () => {
    if (!callStarted) return;
    if (screenSharing) {
      if (screenStreamRef.current) screenStreamRef.current.getTracks().forEach(track => track.stop());
      if (localStreamRef.current && localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
      setScreenSharing(false);
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
        screenStreamRef.current = screenStream;
        if (localVideoRef.current) localVideoRef.current.srcObject = screenStream;
        screenStream.getVideoTracks()[0].onended = () => setScreenSharing(false);
        setScreenSharing(true);
      } catch (err) {
        console.error("Screen share cancelled");
      }
    }
  };

  useEffect(() => {
    return () => {
      stopTimer();
      if (localStreamRef.current) localStreamRef.current.getTracks().forEach(track => track.stop());
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-white py-4 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow">
            🎥
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Video Call</h1>
            <p className="text-sm text-zinc-500">High Quality • Secure</p>
          </div>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2
          ${callStarted ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-500'}`}>
          <div className={`w-2.5 h-2.5 rounded-full ${callStarted ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`} />
          {callStarted ? "LIVE CALL" : "Not Connected"}
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col p-8">
          <div className="relative flex-1 bg-white rounded-3xl overflow-hidden border border-zinc-200 shadow-xl">
            {/* Remote Video */}
            <div className="absolute inset-0 bg-black">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              {!callStarted && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-100">
                  <div className="text-center">
                    <div className="w-36 h-36 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-zinc-200 to-white flex items-center justify-center text-7xl shadow-inner border border-zinc-200">
                      👤
                    </div>
                    <p className="text-2xl font-semibold text-zinc-800">Alex Rivera</p>
                    <p className="text-zinc-500 mt-1">Senior Designer</p>
                  </div>
                </div>
              )}
            </div>

            {/* Local Video (Picture-in-Picture) */}
            <div className="absolute bottom-8 right-8 w-80 aspect-video bg-black rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {!callStarted && (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200">
                  <div className="text-center">
                    <div className="text-5xl mb-2">You</div>
                    <p className="text-sm text-zinc-500">Local Camera</p>
                  </div>
                </div>
              )}
              <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                You {screenSharing && "• Screen Sharing"}
              </div>
            </div>

            {/* Call Timer */}
            {callStarted && (
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-2xl text-sm font-medium shadow flex items-center gap-2 border border-zinc-100">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                {formatTime(callDuration)}
              </div>
            )}
          </div>

          {/* Status */}
          <div className="mt-6 flex justify-center">
            <div className={`px-8 py-3 rounded-2xl text-sm font-medium flex items-center gap-2 shadow-sm
              ${callStarted ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-white text-zinc-500 border border-zinc-200'}`}>
              {callStarted ? "🟢 Connected • 1080p" : "🔴 Ready to start call"}
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="w-80 border-l border-zinc-200 bg-white p-8 flex flex-col shadow-sm">
          <h3 className="text-xl font-semibold mb-8 text-zinc-800">Call Controls</h3>

          <div className="space-y-6">
            {/* Start / End Call Button */}
            {!callStarted ? (
              <button
                onClick={startCall}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-4 rounded-2xl font-semibold text-lg transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-blue-500/30"
              >
                <span className="text-2xl">📞</span>
                Start Video Call
              </button>
            ) : (
              <button
                onClick={endCall}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-semibold text-lg transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                End Call
              </button>
            )}

            {/* Media Controls - Content Box */}
            <div className="border border-zinc-200 rounded-3xl p-6 bg-white">
              <h4 className="text-sm font-medium text-zinc-500 mb-4 text-center">MEDIA CONTROLS</h4>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={toggleMic}
                  disabled={!callStarted}
                  className={`h-24 rounded-3xl flex flex-col items-center justify-center gap-2 transition-all font-medium border
                    ${micOn ? 'bg-white hover:bg-zinc-50 border-zinc-200' : 'bg-red-50 text-red-600 border-red-200'}`}
                >
                  <span className="text-4xl">{micOn ? "🎤" : "🤫"}</span>
                  <span className="text-sm">{micOn ? "Mute Microphone" : "Unmute"}</span>
                </button>

                <button
                  onClick={toggleCam}
                  disabled={!callStarted}
                  className={`h-24 rounded-3xl flex flex-col items-center justify-center gap-2 transition-all font-medium border
                    ${camOn ? 'bg-white hover:bg-zinc-50 border-zinc-200' : 'bg-red-50 text-red-600 border-red-200'}`}
                >
                  <span className="text-4xl">{camOn ? "📷" : "🚫"}</span>
                  <span className="text-sm">{camOn ? "Turn Off Camera" : "Turn On Camera"}</span>
                </button>
              </div>
            </div>

            {/* Screen Share */}
            <button
              onClick={toggleScreenShare}
              disabled={!callStarted}
              className={`w-full py-4 rounded-3xl flex items-center justify-center gap-3 text-lg font-medium transition-all border
                ${screenSharing ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-white hover:bg-zinc-50 border-zinc-200'}`}
            >
              🖥 {screenSharing ? "Stop Screen Share" : "Share Screen"}
            </button>
          </div>

          {/* Participants */}
          <div className="mt-auto pt-10">
            <div className="text-sm text-zinc-500 mb-4 font-medium">PARTICIPANTS (2)</div>
            <div className="flex items-center gap-4 bg-zinc-50 rounded-2xl p-4 border border-zinc-100">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center text-3xl text-white">
                👤
              </div>
              <div>
                <div className="font-semibold">Alex Rivera</div>
                <div className="text-emerald-600 text-sm">Speaking now...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}