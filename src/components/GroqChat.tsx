import React, { useState, useRef } from 'react';
// Commenting out askGroq import for now since we're using our manual steps
// import { askGroq } from '../lib/groq';

const GroqChat = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Function to speak the response text
  const speakText = (text: string) => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.onend = () => setIsSpeaking(false);
    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const pauseSpeaking = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
    }
  };

  const resumeSpeaking = () => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
    }
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Function to generate emergency response steps
  const generateEmergencyResponse = (issue: string): string => {
    return `
Emergency detected: ${issue}.
Here are the steps you should follow:
1. Stay calm.
2. Move to a safe location.
3. Contact emergency services immediately (e.g., 911).
4. If safe, alert others nearby.
5. Remain safe — help is on the way!
    `.trim();
  };

  // Handle voice input
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const spokenText = event.results[0][0].transcript;
      setInput(spokenText);

      const emergencyResponse = generateEmergencyResponse(spokenText);
      setResponse(emergencyResponse);
      speakText(emergencyResponse);
    };

    recognition.start();
  };

  // Handle sending the input and generating response
  const handleSend = async () => {
    if (!input.trim()) return;

    const emergencyResponse = generateEmergencyResponse(input);
    setResponse(emergencyResponse);
    speakText(emergencyResponse);
  };

  return (
    <div className="p-4 border rounded-md max-w-md mx-auto mt-8 shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-center">🛟 Emergency Assistant (Groq)</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your emergency..."
          className="border p-2 flex-grow rounded"
        />
        <button onClick={handleVoiceInput} className="bg-gray-300 px-3 py-2 rounded hover:bg-gray-400">
          🎤
        </button>
      </div>

      <button
        onClick={handleSend}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Send
      </button>

      {response && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <strong className="block mb-2 text-gray-700">Groq says:</strong>
          <p className="whitespace-pre-line">{response}</p>

          <div className="mt-4 flex gap-2">
            {!isSpeaking ? (
              <button
                onClick={() => speakText(response)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                🔊 Listen
              </button>
            ) : (
              <>
                <button
                  onClick={pauseSpeaking}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  ⏸ Pause
                </button>
                <button
                  onClick={resumeSpeaking}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  ▶️ Resume
                </button>
                <button
                  onClick={stopSpeaking}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  🔇 Stop
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroqChat;
