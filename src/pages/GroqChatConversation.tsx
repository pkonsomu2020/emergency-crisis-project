import React, { useState, useRef } from 'react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const GroqChatConversation = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Speak the text
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

  // Emergency response generation
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

  // Voice input
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support speech recognition.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const spokenText = event.results[0][0].transcript;
      setInput(spokenText);
      handleSend(spokenText);
    };

    recognition.start();
  };

  const handleSend = (customInput?: string) => {
    const userInput = customInput || input.trim();
    if (!userInput) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: 'user', text: userInput }]);
    setInput('');

    // Generate bot response
    const botResponse = generateEmergencyResponse(userInput);
    setMessages((prev) => [...prev, { sender: 'user', text: userInput }, { sender: 'bot', text: botResponse }]);
    speakText(botResponse);
  };

  const handleNewChat = () => {
    setMessages([]);
    stopSpeaking();
    setInput('');
  };

  return (
    <div className="p-4 border rounded-md max-w-md mx-auto mt-8 shadow-md flex flex-col h-[80vh]">
      <h2 className="text-lg font-semibold mb-4 text-center">🛟 Emergency Assistant (Conversation)</h2>

      {/* Conversation Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-gray-50 p-2 rounded">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded max-w-xs ${
              msg.sender === 'user' ? 'bg-blue-100 self-end text-right' : 'bg-green-100 self-start text-left'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex gap-2 mb-2">
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

      <div className="flex gap-2">
        <button
          onClick={() => handleSend()}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
        <button
          onClick={handleNewChat}
          className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          New Chat
        </button>
      </div>

      {/* Speaking controls */}
      {isSpeaking && (
        <div className="flex gap-2 mt-4">
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
        </div>
      )}
    </div>
  );
};

export default GroqChatConversation;
