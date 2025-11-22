"use client";
import React, { useState, useEffect, useRef } from "react";
import Button from "./Button";

const CustomerSupport = ({ isOpen, onClose }) => {
  const [step, setStep] = useState("initial"); // initial, listening, confirmation, success
  const [isListening, setIsListening] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    query: "",
  });
  const [error, setError] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState("");

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  const questions = [
    { field: "name", prompt: "What's your name?", placeholder: "Your name" },
    {
      field: "phone",
      prompt: "What's your phone number?",
      placeholder: "+92 300 1234567",
    },
    {
      field: "query",
      prompt: "How can we help you today?",
      placeholder: "Your question or query",
    },
  ];

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Speak a prompt using text-to-speech
  const speak = (text) => {
    if (synthRef.current) {
      // Cancel any ongoing speech
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => {
        // Start listening after speech ends
        setTimeout(() => startListening(), 500);
      };

      synthRef.current.speak(utterance);
    } else {
      // Fallback: start listening immediately if TTS not available
      setTimeout(() => startListening(), 500);
    }
  };

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event) => {
          let interimTranscript = "";
          let finalTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptPiece = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcriptPiece;
            } else {
              interimTranscript += transcriptPiece;
            }
          }

          setTranscript(interimTranscript || finalTranscript);

          if (finalTranscript) {
            handleVoiceInput(finalTranscript);
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          setError(
            "Could not understand. Please try speaking again."
          );
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      } else {
        setError("Voice recognition is not supported in your browser.");
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Format phone number for Pakistan
  const formatPakistaniPhone = (text) => {
    let digits = text.replace(/\D/g, "");

    const voiceReplacements = {
      zero: "0", one: "1", two: "2", three: "3", four: "4",
      five: "5", six: "6", seven: "7", eight: "8", nine: "9",
    };

    let processedText = text.toLowerCase();
    Object.entries(voiceReplacements).forEach(([word, digit]) => {
      processedText = processedText.replace(new RegExp(word, "g"), digit);
    });

    digits = processedText.replace(/\D/g, "");

    if (digits.startsWith("0")) {
      digits = "92" + digits.substring(1);
    }

    if (!digits.startsWith("92")) {
      digits = "92" + digits;
    }

    if (digits.length >= 12) {
      digits = digits.substring(0, 12);
    }

    if (digits.length >= 12) {
      return `+${digits.substring(0, 2)} ${digits.substring(2, 5)} ${digits.substring(5, 12)}`;
    } else if (digits.length >= 5) {
      return `+${digits.substring(0, 2)} ${digits.substring(2)}`;
    } else if (digits.length >= 2) {
      return `+${digits}`;
    }

    return text;
  };

  // Handle voice input
  const handleVoiceInput = (text) => {
    const currentField = questions[currentQuestion].field;
    let processedText = text.trim();

    if (currentField === "phone") {
      processedText = formatPakistaniPhone(text);
    }

    setFormData((prev) => ({
      ...prev,
      [currentField]: processedText,
    }));

    // Move to next question or confirmation
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setTranscript("");
        setError("");
        const nextPrompt = questions[currentQuestion + 1].prompt;
        setCurrentPrompt(nextPrompt);
        speak(nextPrompt);
      } else {
        setStep("confirmation");
        setTranscript("");
        setCurrentPrompt("");
      }
    }, 1500);
  };

  // Start listening
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setError("");
      setTranscript("");
      setIsListening(true);
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Error starting recognition:", e);
      }
    }
  };

  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Start voice flow
  const handleStart = () => {
    setStep("listening");
    setCurrentQuestion(0);
    setFormData({ name: "", phone: "", query: "" });
    setError("");
    setTranscript("");
    const firstPrompt = questions[0].prompt;
    setCurrentPrompt(firstPrompt);
    speak(firstPrompt);
  };

  // Retry current question
  const handleRetry = () => {
    setError("");
    setTranscript("");
    const currentPromptText = questions[currentQuestion].prompt;
    setCurrentPrompt(currentPromptText);
    speak(currentPromptText);
  };

  // Submit form
  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/customer-support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setStep("success");
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        setError("Failed to submit. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  // Handle manual input change
  const handleInputChange = (field, value) => {
    if (field === "phone") {
      value = formatPakistaniPhone(value);
    }
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Close modal
  const handleClose = () => {
    stopListening();
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setStep("initial");
    setCurrentQuestion(0);
    setFormData({ name: "", phone: "", query: "" });
    setTranscript("");
    setError("");
    setCurrentPrompt("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black opacity-90"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="relative z-10 bg-black border-2 border-lime-400 rounded-lg w-full max-w-lg">
        {/* Header */}
        <div className="p-6 border-b border-lime-400">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:text-lime-400 transition-colors text-2xl"
          >
            ×
          </button>
          <h2 className="font-conthrax text-2xl text-lime-400">
            Customer Support
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            We're here to help. Ask us anything about NoRa EV.
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Initial Screen */}
          {step === "initial" && (
            <div className="text-center space-y-6">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-lime-400 rounded-full flex items-center justify-center">
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
                <h3 className="text-white text-xl font-semibold mb-2">
                  Voice Assistant Ready
                </h3>
                <p className="text-gray-400 text-sm">
                  Click Start and I'll ask you three questions.
                </p>
              </div>

              {error && (
                <div className="bg-red-900 bg-opacity-30 border border-red-500 rounded p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleStart}
                className="bg-lime-400 text-black font-semibold px-8 py-3 rounded hover:bg-lime-500 transition-colors"
              >
                Start
              </button>
            </div>
          )}

          {/* Listening Screen */}
          {step === "listening" && (
            <div className="text-center space-y-6">
              {/* Progress dots */}
              <div className="flex justify-center gap-2 mb-6">
                {questions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 w-2 rounded-full ${
                      idx < currentQuestion
                        ? "bg-lime-400"
                        : idx === currentQuestion
                        ? "bg-lime-400 animate-pulse"
                        : "bg-gray-600"
                    }`}
                  ></div>
                ))}
              </div>

              {/* Microphone Visualization */}
              <div className="flex justify-center mb-6">
                <div
                  className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                    isListening
                      ? "bg-lime-400 animate-pulse"
                      : "bg-gray-800 border-2 border-lime-400"
                  }`}
                >
                  <svg
                    className={`w-16 h-16 ${
                      isListening ? "text-black" : "text-lime-400"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                  </svg>
                </div>
              </div>

              {/* Status Text */}
              <div className="min-h-[80px]">
                {isListening ? (
                  <>
                    <p className="text-lime-400 text-lg font-semibold mb-2">
                      Listening...
                    </p>
                    {transcript && (
                      <p className="text-white text-base">"{transcript}"</p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-400 text-sm">
                    {currentPrompt}
                  </p>
                )}
              </div>

              {error && (
                <div className="bg-red-900 bg-opacity-30 border border-red-500 rounded p-3">
                  <p className="text-red-400 text-sm mb-2">{error}</p>
                  <button
                    onClick={handleRetry}
                    className="text-lime-400 text-sm underline hover:text-lime-300"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Confirmation Screen */}
          {step === "confirmation" && (
            <div className="space-y-6">
              <h3 className="text-lime-400 text-xl font-semibold text-center mb-6">
                Please Confirm Your Information
              </h3>

              <div className="space-y-4">
                {/* Name */}
                <div className="border border-gray-700 rounded p-4">
                  <label className="block text-gray-400 text-sm mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full bg-transparent text-white text-lg focus:outline-none"
                  />
                </div>

                {/* Phone */}
                <div className="border border-gray-700 rounded p-4">
                  <label className="block text-gray-400 text-sm mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full bg-transparent text-white text-lg focus:outline-none"
                  />
                </div>

                {/* Query */}
                <div className="border border-gray-700 rounded p-4">
                  <label className="block text-gray-400 text-sm mb-2">
                    Your Query
                  </label>
                  <textarea
                    value={formData.query}
                    onChange={(e) => handleInputChange("query", e.target.value)}
                    rows={3}
                    className="w-full bg-transparent text-white text-lg focus:outline-none resize-none"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-900 bg-opacity-30 border border-red-500 rounded p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleSubmit}
                  className="bg-lime-400 text-black font-semibold px-8 py-3 rounded hover:bg-lime-500 transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          )}

          {/* Success Screen */}
          {step === "success" && (
            <div className="text-center space-y-6 py-8">
              <div className="w-20 h-20 mx-auto bg-lime-400 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lime-400 text-2xl font-semibold">
                Thank You!
              </h3>
              <p className="text-white text-lg">
                We'll get back to you shortly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;
