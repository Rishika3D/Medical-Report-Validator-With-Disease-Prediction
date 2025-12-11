import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Minimize2, Sparkles, Bot } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your Medical AI Assistant. How can I help you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickPrompts = [
    'Explain diabetes risk factors',
    'What are normal blood pressure ranges?',
    'Interpret lab results',
    'Common cardiovascular symptoms'
  ];

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputValue),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const getAIResponse = (prompt: string): string => {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('diabetes')) {
      return 'Diabetes risk factors include: high blood glucose levels, family history, obesity (BMI > 30), sedentary lifestyle, age over 45, and high blood pressure. Regular monitoring and lifestyle modifications are key for management.';
    } else if (lowerPrompt.includes('blood pressure')) {
      return 'Normal blood pressure ranges:\n• Normal: < 120/80 mmHg\n• Elevated: 120-129/<80 mmHg\n• Hypertension Stage 1: 130-139/80-89 mmHg\n• Hypertension Stage 2: ≥140/≥90 mmHg\n\nConsult a healthcare provider for personalized advice.';
    } else if (lowerPrompt.includes('lab') || lowerPrompt.includes('results')) {
      return 'I can help interpret common lab results. Please provide specific values or ask about particular tests like glucose, cholesterol, or blood count. Remember, always consult your healthcare provider for official interpretation.';
    } else if (lowerPrompt.includes('cardiovascular') || lowerPrompt.includes('heart')) {
      return 'Common cardiovascular symptoms include:\n• Chest pain or discomfort\n• Shortness of breath\n• Irregular heartbeat\n• Fatigue\n• Swelling in legs/ankles\n• Dizziness\n\nSeek immediate medical attention for severe symptoms!';
    } else {
      return 'I understand your question. For specific medical concerns, I recommend:\n1. Reviewing relevant patient reports\n2. Consulting medical literature\n3. Discussing with healthcare professionals\n\nHow else can I assist you?';
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputValue(prompt);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center neon-glow-purple hover:scale-110 transition-all shadow-2xl z-40 animate-neon-pulse"
      >
        <MessageSquare size={28} className="text-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full animate-pulse neon-glow-pink" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 bg-black/95 backdrop-blur-xl rounded-2xl border neon-border-purple shadow-2xl z-40 transition-all ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-purple-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center neon-glow-purple">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h4 className="text-white flex items-center gap-2">
              AI Assistant
              <Sparkles size={14} className="text-pink-400 animate-pulse" />
            </h4>
            <p className="text-xs text-gray-400">Always available</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-purple-500/10 rounded-lg transition-all"
          >
            <Minimize2 size={16} className="text-gray-400 hover:text-purple-400" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-purple-500/10 rounded-lg transition-all"
          >
            <X size={16} className="text-gray-400 hover:text-purple-400" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="h-[400px] overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white neon-glow-purple'
                      : 'bg-black/60 border border-purple-500/30 text-gray-300'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <p className="text-xs mt-1 opacity-60">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-400 mb-2">Quick prompts:</p>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="text-xs px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-full hover:bg-purple-500/20 transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-purple-500/20">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 bg-black/60 border border-purple-500/30 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-400 focus:neon-glow-purple transition-all text-sm"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl neon-glow-purple hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} className="text-white" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
