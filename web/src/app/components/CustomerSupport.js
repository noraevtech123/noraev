"use client";
import React, { useState, useEffect } from "react";
import { LiveKitRoom, RoomAudioRenderer, useVoiceAssistant } from "@livekit/components-react";
import "@livekit/components-styles";

const VoiceInterface = ({ onClose }) => {
  const { state, audioTrack } = useVoiceAssistant();

  return (
    <div className="text-center space-y-6">
      {/* Voice indicator */}
      <div className="flex justify-center mb-6">
        <div
          className={`w-32 h-32 rounded-full flex items-center justify-center transition-all shadow-lg ${
            state === "listening"
              ? "bg-lime-400 animate-pulse scale-110"
              : state === "speaking"
              ? "bg-lime-400"
              : "bg-gray-100 border-4 border-lime-400"
          }`}
        >
          <svg
            className={`w-16 h-16 transition-colors ${
              state === "listening" || state === "speaking" ? "text-black" : "text-lime-400"
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
        {state === "listening" && (
          <p className="text-lime-500 text-lg font-semibold">Listening...</p>
        )}
        {state === "thinking" && (
          <p className="text-gray-600 text-lg font-semibold">Thinking...</p>
        )}
        {state === "speaking" && (
          <p className="text-lime-500 text-lg font-semibold">Speaking...</p>
        )}
        {state === "idle" && (
          <p className="text-gray-500 text-sm">Voice assistant is ready</p>
        )}
      </div>

      {/* Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-gray-700 text-sm">
          The AI assistant will ask you three questions in Urdu/English:
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

const CustomerSupport = ({ isOpen, onClose }) => {
  const [token, setToken] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState("");

  const startCall = async () => {
    setIsConnecting(true);
    setError("");

    try {
      const response = await fetch("/api/livekit-token");
      if (!response.ok) {
        throw new Error("Failed to get token");
      }

      const data = await response.json();
      setToken(data.token);
    } catch (err) {
      console.error("Error starting call:", err);
      setError("Failed to connect. Please try again.");
      setIsConnecting(false);
    }
  };

  const handleClose = () => {
    setToken(null);
    setIsConnecting(false);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
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
            AI-powered voice assistant in Urdu/English
          </p>
        </div>

        {/* Content */}
        <div className="p-8 bg-white">
          {!token ? (
            /* Initial Screen */
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
                  Click Start to begin a voice conversation with our AI assistant.
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
            /* Voice Call Active */
            <LiveKitRoom
              token={token}
              serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
              connect={true}
              audio={true}
              video={false}
              onDisconnected={handleClose}
              className="h-full"
            >
              <VoiceInterface onClose={handleClose} />
              <RoomAudioRenderer />
            </LiveKitRoom>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;
