
import React, { useEffect, useRef } from 'react';
import type { Message } from '../types';
import ChatMessage from './ChatMessage';
import { AiIcon } from './IconComponents';

interface ChatHistoryProps {
  messages: Message[];
  isLoading: boolean;
}

const TypingIndicator: React.FC = () => (
  <div className="flex items-start space-x-4 p-4">
    <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
      <AiIcon />
    </div>
    <div className="flex items-center space-x-1 mt-2">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
    </div>
  </div>
);

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, isLoading }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <div className="max-w-3xl mx-auto">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  );
};

export default ChatHistory;
