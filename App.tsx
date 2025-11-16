import React, { useState, useEffect, useCallback } from 'react';
import type { Chat } from '@google/genai';
import { startChat, sendMessageToAI } from './services/geminiService';
import type { Message } from './types';
import { Role } from './types';
import Header from './components/Header';
import ChatHistory from './components/ChatHistory';
import ChatInput from './components/ChatInput';

const App: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeChat = () => {
      const newChat = startChat();
      setChat(newChat);
      setMessages([
        { role: Role.AI, content: "Hello! I'm Hamza, your AI Agent with tools! I can search the web and check the time. How can I assist you today?" }
      ]);
    };
    initializeChat();
  }, []);

  const handleSendMessage = useCallback(async (userMessage: string) => {
    if (!chat || isLoading || !userMessage.trim()) return;

    setIsLoading(true);
    setError(null);

    const newUserMessage: Message = { role: Role.USER, content: userMessage };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      const { text: aiResponse, sources } = await sendMessageToAI(chat, userMessage);
      const aiMessage: Message = { role: Role.AI, content: aiResponse, sources };
      setMessages(prev => [...prev, aiMessage]);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Error: ${errorMessage}`);
      const errorMessageObject: Message = { role: Role.AI, content: `Sorry, I encountered an error: ${errorMessage}` };
      setMessages(prev => [...prev, errorMessageObject]);
    } finally {
      setIsLoading(false);
    }
  }, [chat, isLoading]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="flex-1 overflow-hidden">
        <ChatHistory messages={messages} isLoading={isLoading} />
      </main>
      <footer className="w-full max-w-3xl mx-auto p-4 bg-gray-900">
        {error && <p className="text-red-500 text-center text-sm mb-2">{error}</p>}
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </footer>
    </div>
  );
};

export default App;