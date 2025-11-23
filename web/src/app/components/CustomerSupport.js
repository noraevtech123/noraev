"use client";
import React, { useState, useEffect, useCallback } from "react";
import { LiveKitRoom, RoomAudioRenderer, useVoiceAssistant, useRoomContext } from "@livekit/components-react";
import { RoomEvent, ConnectionState } from "livekit-client";
import "@livekit/components-styles";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Simple Toast Component
const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-[100] bg-lime-400 text-black px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      <span className="font-semibold">{message}</span>
    </div>
  );
};

// Loading Spinner Component
const LoadingSpinner = ({ message = "Connecting to voice assistant..." }) => (
  <div className="flex flex-col items-center justify-center space-y-4 py-8">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-lime-400 rounded-full border-t-transparent animate-spin"></div>
    </div>
    <p className="text-gray-600 text-sm text-center px-4">{message}</p>
  </div>
);

const VoiceInterface = ({ onClose, onDataReceived, language, assistantState }) => {
  const room = useRoomContext();
  const [hasSignaledReady, setHasSignaledReady] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [sentLanguage, setSentLanguage] = useState(null);

  const notifyClientReady = useCallback(async () => {
    if (!room || hasSignaledReady || !audioReady || room.state !== ConnectionState.Connected) {
      return;
    }

    try {
      const data = {
        type: "client_ready",
        language: language
      };
      await room.localParticipant.publishData(
        JSON.stringify(data),
        { reliable: true }
      );
      setHasSignaledReady(true);
    } catch (error) {
      console.error("Error sending readiness message:", error);
    }
  }, [room, language, hasSignaledReady, audioReady]);

  // Track when the browser has allowed audio playback
  useEffect(() => {
    if (!room) return;

    setAudioReady(room.canPlaybackAudio);

    const handleAudioStatus = () => {
      setAudioReady(room.canPlaybackAudio);
    };

    room.on(RoomEvent.AudioPlaybackStatusChanged, handleAudioStatus);

    return () => {
      room.off(RoomEvent.AudioPlaybackStatusChanged, handleAudioStatus);
    };
  }, [room]);

  // Inform the agent when the client is ready (language preference + audio ready)
  useEffect(() => {
    if (audioReady) {
      notifyClientReady();
    }
  }, [audioReady, notifyClientReady]);

  useEffect(() => {
    if (!room) return;
    const handleSignalConnected = () => {
      if (audioReady) {
        notifyClientReady();
      }
    };

    room.on(RoomEvent.SignalConnected, handleSignalConnected);
    return () => {
      room.off(RoomEvent.SignalConnected, handleSignalConnected);
    };
  }, [room, audioReady, notifyClientReady]);

  // Send language selection as soon as the room is connected
  useEffect(() => {
    if (!room || !language) return;
    if (sentLanguage === language) return;

    const sendLanguagePreference = async () => {
      try {
        const data = {
          type: "language_preference",
          language,
        };
        await room.localParticipant.publishData(
          JSON.stringify(data),
          { reliable: true }
        );
        setSentLanguage(language);
      } catch (error) {
        console.error("Error sending language preference:", error);
      }
    };

    if (room.state === ConnectionState.Connected) {
      sendLanguagePreference();
    } else {
      const handleSignalConnected = () => {
        sendLanguagePreference();
      };
      room.on(RoomEvent.SignalConnected, handleSignalConnected);
      return () => {
        room.off(RoomEvent.SignalConnected, handleSignalConnected);
      };
    }
  }, [room, language, sentLanguage]);

  // Listen for data messages from the agent
  useEffect(() => {
    if (!room) return;

    const handleDataReceived = (payload, participant) => {
      try {
        const decoder = new TextDecoder();
        const message = JSON.parse(decoder.decode(payload));

        if (message.type === "conversation_complete") {
          onDataReceived(message.data);
        }
      } catch (error) {
        console.error("Error parsing data message:", error);
      }
    };

    room.on("dataReceived", handleDataReceived);

    return () => {
      room.off("dataReceived", handleDataReceived);
    };
  }, [room, onDataReceived]);

  return (
    <div className="text-center space-y-6">
      {!audioReady && (
        <button
          onClick={async () => {
            if (!room) return;
            try {
              if (typeof room.startAudio === "function") {
                await room.startAudio();
              }
            } catch (err) {
              console.warn("startAudio failed", err);
            }
            setAudioReady(true);
            notifyClientReady();
          }}
          className="w-full bg-lime-400 text-black font-semibold py-2 rounded-lg shadow-md hover:bg-lime-500"
        >
          Tap to enable audio
        </button>
      )}

      {/* Voice indicator */}
      <div className="flex justify-center mb-6">
        <div
          className={`w-32 h-32 rounded-full flex items-center justify-center transition-all shadow-lg ${
            assistantState === "listening"
              ? "bg-lime-400 animate-pulse scale-110"
              : assistantState === "speaking"
              ? "bg-lime-400"
              : "bg-gray-100 border-4 border-lime-400"
          }`}
        >
          <svg
            className={`w-16 h-16 transition-colors ${
              assistantState === "listening" || assistantState === "speaking" ? "text-black" : "text-lime-400"
            }`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        </div>
      </div>

      {/* Status */}
      <div className="min-h-[80px]">
        {assistantState === "listening" && (
          <p className="text-lime-500 text-lg font-semibold">Listening...</p>
        )}
        {assistantState === "thinking" && (
          <p className="text-gray-600 text-lg font-semibold">Thinking...</p>
        )}
        {assistantState === "speaking" && (
          <p className="text-lime-500 text-lg font-semibold">Speaking...</p>
        )}
        {assistantState === "idle" && (
          <p className="text-gray-500 text-sm">Voice assistant is ready</p>
        )}
      </div>

      {/* Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-gray-700 text-sm">
          The AI assistant will ask you three questions in English:
        </p>
        <ul className="text-gray-600 text-xs mt-2 space-y-1">
          <li>• Your name</li>
          <li>• Your phone number</li>
          <li>• Your question about NoRa EV</li>
        </ul>
      </div>

      <button
        onClick={onClose}
        className="text-gray-500 text-sm underline hover:text-gray-700"
      >
        End Call
      </button>
    </div>
  );
};

const VoiceSession = ({ onClose, onDataReceived, language, isConnecting }) => {
  const voiceAssistant = useVoiceAssistant();
  const room = useRoomContext();
  const agentConnecting = !voiceAssistant.state || voiceAssistant.state === "connecting";
  const showSpinner = isConnecting || agentConnecting;
  const spinnerMessage = isConnecting
    ? "Connecting to voice assistant..."
    : "Agent is getting ready...";

  return (
    <div className="relative">
      {showSpinner && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/90 backdrop-blur-sm">
          <LoadingSpinner message={spinnerMessage} />
          {room && typeof room.startAudio === "function" && !room.canPlaybackAudio && (
            <button
              onClick={async () => {
                try {
                  await room.startAudio();
                } catch (err) {
                  console.warn("startAudio failed", err);
                }
              }}
              className="px-6 py-2 rounded-lg bg-lime-400 text-black font-semibold shadow-md hover:bg-lime-500"
            >
              Tap to enable audio
            </button>
          )}
        </div>
      )}
      <VoiceInterface
        onClose={onClose}
        onDataReceived={onDataReceived}
        language={language}
        assistantState={voiceAssistant.state}
      />
      <RoomAudioRenderer />
    </div>
  );
};

const CustomerSupport = ({ isOpen, onClose }) => {
  const [token, setToken] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const language = "english";

  const handleClose = useCallback(() => {
    setToken(null);
    setIsConnecting(false);
    setError("");
    onClose();
  }, [onClose]);

  const startCall = async () => {
    setIsConnecting(true);
    setError("");

    try {
      const response = await fetch(`/api/livekit-token?language=${language}`);
      if (!response.ok) {
        throw new Error("Failed to get token");
      }

      const data = await response.json();
      setToken(data.token);
      // Keep isConnecting true until room connects
    } catch (err) {
      console.error("Error starting call:", err);
      setError("Failed to connect. Please try again.");
      setIsConnecting(false);
    }
  };

  const handleDataReceived = useCallback(async (data) => {
    console.log("Received conversation data:", data);

    if (!API_BASE_URL) {
      console.error("NEXT_PUBLIC_API_BASE_URL is not set; cannot send support request.");
      setError("Support service unavailable. Please try again later.");
      setTimeout(() => setError(""), 4000);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/customer-support`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          query: data.query,
        }),
      });

      if (!response.ok) {
        let message = "Failed to send support request.";
        try {
          const body = await response.json();
          if (Array.isArray(body?.detail)) {
            message = body.detail
              .map((item) => item.msg || JSON.stringify(item))
              .join(", ");
          } else if (typeof body?.detail === "string") {
            message = body.detail;
          } else if (body?.message) {
            message = body.message;
          }
        } catch {
          // ignore parsing failures
        }
        throw new Error(message);
      }

      setShowToast(true);

      // close voice session after toast
      setTimeout(() => {
        setShowToast(false);
        handleClose();
      }, 1500);
    } catch (error) {
      console.error("Error sending data to backend:", error);
      const message =
        error instanceof Error ? error.message : "Failed to send support request.";
      setError(message);
      setTimeout(() => setError(""), 4000);
    }
  }, [handleClose]);

  if (!isOpen) return null;

  return (
    <>
      {showToast && <Toast message="Email sent successfully!" onClose={() => setShowToast(false)} />}

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
          onClick={handleClose}
        ></div>

        {/* Modal */}
        <div className="relative z-10 bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-200">
            <div className="absolute top-0 left-0 w-full h-1 bg-lime-400"></div>
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors text-2xl"
            >
              ×
            </button>
            <h2 className="font-conthrax text-2xl text-gray-900">
              Voice Support
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              AI-powered voice assistant
            </p>
          </div>

          {/* Content */}
          <div className="p-8 bg-white">
            {!token ? (
              <div className="text-center space-y-6">
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 bg-lime-400 rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      className="w-12 h-12 text-black"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                    </svg>
                  </div>
                </div>

                <div>
                  <h3 className="text-gray-900 text-xl font-semibold mb-2">
                    Voice Assistant Ready
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Start an English conversation with our AI assistant.
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <button
                  onClick={startCall}
                  disabled={isConnecting}
                  className={`font-semibold px-8 py-3 rounded-lg transition-all shadow-md ${
                    isConnecting
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-lime-400 text-black hover:bg-lime-500 hover:shadow-lg"
                  }`}
                >
                  {isConnecting ? "Connecting..." : "Start Voice Call"}
                </button>
              </div>
            ) : (
              /* Voice Call Active - Show spinner while connecting, then voice interface */
              <LiveKitRoom
                token={token}
                serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
                connect={true}
                audio={true}
                video={false}
                onConnected={() => setIsConnecting(false)}
                onDisconnected={handleClose}
                className="h-full"
              >
                <VoiceSession
                  onClose={handleClose}
                  onDataReceived={handleDataReceived}
                  language={language}
                  isConnecting={isConnecting}
                />
              </LiveKitRoom>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerSupport;
