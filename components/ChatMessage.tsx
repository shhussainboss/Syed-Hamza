import React from 'react';
import type { Message } from '../types';
import { Role } from '../types';
import { UserIcon, AiIcon, LinkIcon } from './IconComponents';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  const wrapperClasses = isUser ? 'flex justify-end' : 'flex justify-start';
  const bubbleClasses = isUser
    ? 'bg-blue-600 text-white'
    : 'bg-gray-700 text-gray-200';
  
  const IconComponent = isUser ? UserIcon : AiIcon;

  return (
    <div className={`my-4 ${wrapperClasses}`}>
        <div className="flex items-start space-x-4 max-w-xl">
            {!isUser && (
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                    <IconComponent />
                </div>
            )}
            <div
                className={`px-4 py-3 rounded-2xl ${bubbleClasses}`}
                style={{
                borderRadius: isUser ? '1.25rem 1.25rem 0.25rem 1.25rem' : '1.25rem 1.25rem 1.25rem 0.25rem',
                }}
            >
                <div className="whitespace-pre-wrap">{message.content}</div>
                {!isUser && message.sources && message.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-600/50">
                        <h4 className="text-xs font-semibold text-gray-400 mb-2">Sources:</h4>
                        <ul className="space-y-1.5">
                            {message.sources.map((source, i) => (
                                <li key={i}>
                                <a 
                                    href={source.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-blue-400 hover:text-blue-300 text-sm flex items-start group"
                                    title={source.title}
                                >
                                    <LinkIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-400" />
                                    <span className="truncate group-hover:underline">{source.title || source.uri}</span>
                                </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
             {isUser && (
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-600 flex items-center justify-center text-white">
                    <IconComponent />
                </div>
            )}
        </div>
    </div>
  );
};

export default ChatMessage;
