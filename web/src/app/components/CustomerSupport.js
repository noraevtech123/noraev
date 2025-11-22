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
  const [isEditing, setIsEditing] = useState(false);

  const recognitionRef = useRef(null);
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
            "Could not understand. Please try again or type your response."
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
    };
  }, []);

  // Format phone number for Pakistan
  const formatPakistaniPhone = (text) => {
    // Remove all non-digit characters first
    let digits = text.replace(/\D/g, "");

    // Handle common voice inputs
    const voiceReplacements = {
      zero: "0",
      one: "1",
      two: "2",
      three: "3",
      four: "4",
      five: "5",
      six: "6",
      seven: "7",
      eight: "8",
      nine: "9",
    };

    let processedText = text.toLowerCase();
    Object.entries(voiceReplacements).forEach(([word, digit]) => {
      processedText = processedText.replace(new RegExp(word, "g"), digit);
    });

    digits = processedText.replace(/\D/g, "");

    // If starts with 0, assume Pakistani local format
    if (digits.startsWith("0")) {
      digits = "92" + digits.substring(1);
    }

    // If doesn't start with 92, prepend it
    if (!digits.startsWith("92")) {
      digits = "92" + digits;
    }

    // Ensure it has correct length (92 + 10 digits = 12 total)
    if (digits.length >= 12) {
      digits = digits.substring(0, 12);
    }

    // Format as +92 XXX XXXXXXX
    if (digits.length >= 12) {
      return `+${digits.substring(0, 2)} ${digits.substring(
        2,
        5
      )} ${digits.substring(5, 12)}`;
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
        startListening();
      } else {
        setStep("confirmation");
        setTranscript("");
      }
    }, 1500);
  };

  // Start listening
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setError("");
      setTranscript("");
      setIsListening(true);
      recognitionRef.current.start();
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
    setTimeout(() => startListening(), 500);
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

  // Close modal
  const handleClose = () => {
    stopListening();
    setStep("initial");
    setCurrentQuestion(0);
    setFormData({ name: "", phone: "", query: "" });
    setTranscript("");
    setError("");
    setIsEditing(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black opacity-85"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="relative z-10 bg-black border-2 border-lime-400 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-black p-6 border-b-2 border-lime-400">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:text-lime-400 transition-colors"
          >
            <span className="text-2xl">×</span>
          </button>
          <h2 className="font-conthrax text-2xl md:text-3xl text-lime-400">
            Customer Support
          </h2>
          <p className="text-gray-300 text-sm mt-2">
            We're here to help. Ask us anything about NoRa EV.
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Initial Screen */}
          {step === "initial" && (
            <div className="text-center space-y-6">
              <div className="bg-lime-400 bg-opacity-10 border border-lime-400 rounded-lg p-6">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-lime-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
                <h3 className="text-white text-xl font-semibold mb-2">
                  Voice-Powered Support
                </h3>
                <p className="text-gray-300 text-sm">
                  Click Start to begin. We'll ask for your name, phone number,
                  and your question. You can speak or type your responses.
                </p>
              </div>

              {error && (
                <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <Button bgColor="lime" onClick={handleStart}>
                Start
              </Button>
            </div>
          )}

          {/* Listening Screen */}
          {step === "listening" && (
            <div className="space-y-6">
              {/* Progress indicator */}
              <div className="flex justify-center space-x-2 mb-6">
                {questions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 w-12 rounded-full ${
                      idx <= currentQuestion ? "bg-lime-400" : "bg-gray-600"
                    }`}
                  ></div>
                ))}
              </div>

              {/* Current Question */}
              <div className="text-center">
                <h3 className="text-lime-400 text-xl font-semibold mb-4">
                  {questions[currentQuestion].prompt}
                </h3>

                {/* Voice indicator */}
                {isListening && (
                  <div className="flex justify-center mb-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-12 bg-lime-400 rounded animate-pulse"></div>
                      <div
                        className="w-3 h-16 bg-lime-400 rounded animate-pulse"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-3 h-12 bg-lime-400 rounded animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Transcript / Input */}
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 min-h-[100px] mb-4">
                  <p className="text-white text-lg">
                    {transcript ||
                      formData[questions[currentQuestion].field] ||
                      "Listening..."}
                  </p>
                </div>

                {/* Manual Input Option */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder={questions[currentQuestion].placeholder}
                    value={formData[questions[currentQuestion].field]}
                    onChange={(e) =>
                      handleInputChange(
                        questions[currentQuestion].field,
                        e.target.value
                      )
                    }
                    className="w-full bg-transparent border-b border-gray-600 pb-2 text-white placeholder-gray-400 focus:border-lime-400 focus:outline-none transition-colors"
                  />
                  <p className="text-gray-400 text-xs mt-2">
                    Or type your response above
                  </p>
                </div>

                {/* Controls */}
                <div className="flex justify-center space-x-4">
                  {isListening ? (
                    <button
                      onClick={stopListening}
                      className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Stop
                    </button>
                  ) : (
                    <button
                      onClick={startListening}
                      className="px-6 py-2 bg-lime-400 text-black rounded hover:bg-lime-500 transition-colors"
                    >
                      Speak
                    </button>
                  )}

                  {formData[questions[currentQuestion].field] && (
                    <button
                      onClick={() => {
                        if (currentQuestion < questions.length - 1) {
                          setCurrentQuestion(currentQuestion + 1);
                          setTranscript("");
                        } else {
                          setStep("confirmation");
                        }
                      }}
                      className="px-6 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Confirmation Screen */}
          {step === "confirmation" && (
            <div className="space-y-6">
              <h3 className="text-lime-400 text-xl font-semibold text-center">
                Please Confirm Your Information
              </h3>

              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="w-full bg-transparent border-b border-gray-600 pb-2 text-white focus:border-lime-400 focus:outline-none transition-colors"
                    />
                  ) : (
                    <p className="text-white text-lg">{formData.name}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="w-full bg-transparent border-b border-gray-600 pb-2 text-white focus:border-lime-400 focus:outline-none transition-colors"
                    />
                  ) : (
                    <p className="text-white text-lg">{formData.phone}</p>
                  )}
                </div>

                {/* Query */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Your Query
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.query}
                      onChange={(e) =>
                        handleInputChange("query", e.target.value)
                      }
                      rows={3}
                      className="w-full bg-transparent border border-gray-600 rounded p-2 text-white focus:border-lime-400 focus:outline-none transition-colors"
                    />
                  ) : (
                    <p className="text-white text-lg">{formData.query}</p>
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  {isEditing ? "Done Editing" : "Edit"}
                </button>
                <Button bgColor="lime" onClick={handleSubmit}>
                  Submit
                </Button>
              </div>
            </div>
          )}

          {/* Success Screen */}
          {step === "success" && (
            <div className="text-center space-y-6 py-8">
              <div className="w-16 h-16 mx-auto bg-lime-400 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-black"
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
                We've received your query and will get back to you shortly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;
