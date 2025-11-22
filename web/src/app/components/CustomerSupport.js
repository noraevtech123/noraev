"use client";
import React, { useState, useEffect, useRef } from "react";
import { pipeline } from "@xenova/transformers";

const CustomerSupport = ({ isOpen, onClose }) => {
  const [step, setStep] = useState("initial");
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
  const [isModelLoading, setIsModelLoading] = useState(false);

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const nerPipelineRef = useRef(null);

  const questions = [
    { field: "name", prompt: "آپ کا نام کیا ہے؟", promptEn: "What's your name?", placeholder: "Your name" },
    {
      field: "phone",
      prompt: "آپ کا فون نمبر کیا ہے؟",
      promptEn: "What's your phone number?",
      placeholder: "+92 300 1234567",
    },
    {
      field: "query",
      prompt: "ہم آپ کی کیسے مدد کر سکتے ہیں؟",
      promptEn: "How can we help you today?",
      placeholder: "Your question or query",
    },
  ];

  // Initialize NER model
  useEffect(() => {
    const loadNERModel = async () => {
      try {
        setIsModelLoading(true);
        // Load NER pipeline for extracting person names
        nerPipelineRef.current = await pipeline(
          "token-classification",
          "Xenova/bert-base-NER"
        );
        setIsModelLoading(false);
      } catch (error) {
        console.error("Error loading NER model:", error);
        setIsModelLoading(false);
      }
    };

    loadNERModel();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Extract name from text using NER
  const extractName = async (text) => {
    if (!nerPipelineRef.current) {
      // Fallback: return the text as-is if model not loaded
      return text.trim();
    }

    try {
      const result = await nerPipelineRef.current(text);

      // Filter for PERSON entities
      const personEntities = result.filter(
        (entity) => entity.entity.includes("PER")
      );

      if (personEntities.length > 0) {
        // Combine consecutive person tokens into full name
        let fullName = "";
        let currentName = "";

        for (let i = 0; i < personEntities.length; i++) {
          const entity = personEntities[i];

          if (entity.entity.startsWith("B-")) {
            // Beginning of a new name
            if (currentName) {
              fullName += currentName + " ";
            }
            currentName = entity.word.replace("##", "");
          } else if (entity.entity.startsWith("I-")) {
            // Continuation of current name
            currentName += entity.word.replace("##", "");
          }
        }

        if (currentName) {
          fullName += currentName;
        }

        return fullName.trim() || text.trim();
      }

      // No person entity found, return original text
      return text.trim();
    } catch (error) {
      console.error("Error extracting name:", error);
      return text.trim();
    }
  };

  const speak = (text) => {
    if (synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ur-PK"; // Urdu language
      utterance.rate = 0.85;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.onend = () => {
        setTimeout(() => startListening(), 500);
      };
      synthRef.current.speak(utterance);
    } else {
      setTimeout(() => startListening(), 500);
    }
  };

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
          setError("Could not understand. Please try speaking again.");
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

  const handleVoiceInput = async (text) => {
    // Stop listening immediately to prevent multiple captures
    stopListening();

    const currentField = questions[currentQuestion].field;
    let processedText = text.trim();

    // Use NER to extract name from natural language
    if (currentField === "name") {
      processedText = await extractName(text);
    } else if (currentField === "phone") {
      processedText = formatPakistaniPhone(text);
    }

    setFormData((prev) => ({
      ...prev,
      [currentField]: processedText,
    }));

    // Wait before moving to next question
    setTimeout(() => {
      const nextQuestionIndex = currentQuestion + 1;

      if (nextQuestionIndex < questions.length) {
        // Move to next question
        setCurrentQuestion(nextQuestionIndex);
        setTranscript("");
        setError("");
        const nextPrompt = questions[nextQuestionIndex].prompt;
        setCurrentPrompt(nextPrompt);
        speak(nextPrompt);
      } else {
        // All questions answered, show confirmation
        setStep("confirmation");
        setTranscript("");
        setCurrentPrompt("");
      }
    }, 1500);
  };

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

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

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

  const handleRetry = () => {
    setError("");
    setTranscript("");
    const currentPromptText = questions[currentQuestion].prompt;
    setCurrentPrompt(currentPromptText);
    speak(currentPromptText);
  };

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

  const handleInputChange = (field, value) => {
    if (field === "phone") {
      value = formatPakistaniPhone(value);
    }
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="relative z-10 bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header with lime accent */}
        <div className="relative bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-200">
          <div className="absolute top-0 left-0 w-full h-1 bg-lime-400"></div>
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors text-2xl"
          >
            ×
          </button>
          <h2 className="font-conthrax text-2xl text-gray-900">
            Customer Support
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            We're here to help. Ask us anything about NoRa EV.
          </p>
        </div>

        {/* Content */}
        <div className="p-8 bg-white">
          {/* Initial Screen */}
          {step === "initial" && (
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
                  {isModelLoading ? "Loading AI Model..." : "Voice Assistant Ready"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {isModelLoading
                    ? "Please wait while we prepare the AI assistant"
                    : "Click Start and I'll ask you three questions in Urdu."}
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleStart}
                disabled={isModelLoading}
                className={`font-semibold px-8 py-3 rounded-lg transition-all shadow-md ${
                  isModelLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-lime-400 text-black hover:bg-lime-500 hover:shadow-lg"
                }`}
              >
                {isModelLoading ? "Loading..." : "Start"}
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
                    className={`h-2 w-2 rounded-full transition-all ${
                      idx < currentQuestion
                        ? "bg-lime-400"
                        : idx === currentQuestion
                        ? "bg-lime-400 animate-pulse scale-125"
                        : "bg-gray-300"
                    }`}
                  ></div>
                ))}
              </div>

              {/* Microphone Visualization */}
              <div className="flex justify-center mb-6">
                <div
                  className={`w-32 h-32 rounded-full flex items-center justify-center transition-all shadow-lg ${
                    isListening
                      ? "bg-lime-400 animate-pulse scale-110"
                      : "bg-gray-100 border-4 border-lime-400"
                  }`}
                >
                  <svg
                    className={`w-16 h-16 transition-colors ${
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
                    <p className="text-lime-500 text-lg font-semibold mb-2">
                      Listening...
                    </p>
                    {transcript && (
                      <p className="text-gray-700 text-base italic">"{transcript}"</p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500 text-sm">{currentPrompt}</p>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm mb-2">{error}</p>
                  <button
                    onClick={handleRetry}
                    className="text-lime-500 text-sm font-medium underline hover:text-lime-600"
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
              <h3 className="text-gray-900 text-xl font-semibold text-center mb-6">
                Please Confirm Your Information
              </h3>

              <div className="space-y-4">
                {/* Name */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 focus-within:border-lime-400 transition-colors">
                  <label className="block text-gray-500 text-xs font-medium mb-2 uppercase tracking-wide">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full bg-transparent text-gray-900 text-lg focus:outline-none"
                  />
                </div>

                {/* Phone */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 focus-within:border-lime-400 transition-colors">
                  <label className="block text-gray-500 text-xs font-medium mb-2 uppercase tracking-wide">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full bg-transparent text-gray-900 text-lg focus:outline-none"
                  />
                </div>

                {/* Query */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 focus-within:border-lime-400 transition-colors">
                  <label className="block text-gray-500 text-xs font-medium mb-2 uppercase tracking-wide">
                    Your Query
                  </label>
                  <textarea
                    value={formData.query}
                    onChange={(e) => handleInputChange("query", e.target.value)}
                    rows={3}
                    className="w-full bg-transparent text-gray-900 text-lg focus:outline-none resize-none"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleSubmit}
                  className="bg-lime-400 text-black font-semibold px-8 py-3 rounded-lg hover:bg-lime-500 transition-all shadow-md hover:shadow-lg"
                >
                  Submit
                </button>
              </div>
            </div>
          )}

          {/* Success Screen */}
          {step === "success" && (
            <div className="text-center space-y-6 py-8">
              <div className="w-20 h-20 mx-auto bg-lime-400 rounded-full flex items-center justify-center shadow-lg">
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
              <h3 className="text-gray-900 text-2xl font-semibold">
                Thank You!
              </h3>
              <p className="text-gray-600 text-lg">
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
