
import React, { useState, useRef } from 'react';
import { SendIcon } from './IconComponents';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    adjustTextareaHeight();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end space-x-3 bg-gray-800 border border-gray-700 rounded-2xl p-2">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        rows={1}
        className="flex-1 bg-transparent text-gray-100 placeholder-gray-400 resize-none focus:outline-none px-2 max-h-40"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !message.trim()}
        className="w-10 h-10 flex-shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
      >
        <SendIcon />
      </button>
    </form>
  );
};

export default ChatInput;
