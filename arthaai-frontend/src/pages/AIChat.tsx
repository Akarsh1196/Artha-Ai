import { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { AIService } from '../services/ai.service';
import { useGeminiStream } from '../hooks/useGeminiStream';
import type { ChatMessage } from '../types/ai.types';
import { PaperAirplaneIcon, TrashIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(true);
  
  const { streamChat, isStreaming, streamedResponse, setStreamedResponse } = useGeminiStream();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadHistory = async () => {
    try {
      const history = await AIService.getHistory();
      setMessages(history.reverse()); // Show oldest first
    } catch (error) {
      console.error('Failed to load history', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadInitialHistory = async () => {
      try {
        const history = await AIService.getHistory();
        if (isMounted) {
          setMessages([...history].reverse());
        }
      } catch (error) {
        console.error('Failed to load history', error);
      } finally {
        if (isMounted) {
          setLoadingHistory(false);
        }
      }
    };

    void loadInitialHistory();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamedResponse]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMsg = input.trim();
    setInput('');
    
    // Optimistically add user message
    const tempUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMsg,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);

    await streamChat(userMsg, () => {
      // Re-fetch history to get the persisted model response
      loadHistory();
      setStreamedResponse('');
    });
  };

  const handleClear = async () => {
    if (confirm('Clear all chat history?')) {
      await AIService.clearHistory();
      setMessages([]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto p-4 md:p-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center text-text-primary dark:text-text-primary-dark">
            <SparklesIcon className="h-6 w-6 mr-2 text-primary" />
            ArthaAI Assistant
          </h1>
          <p className="text-sm text-text-muted dark:text-text-muted-dark">Your personalized financial advisor</p>
        </div>
        <button 
          onClick={handleClear}
          className="p-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
          title="Clear History"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto bg-surface dark:bg-surface-dark rounded-2xl border border-border dark:border-border-dark shadow-sm mb-4 p-4 md:p-6 space-y-6">
        {loadingHistory ? (
          <div className="text-center text-text-muted mt-10">Loading conversation...</div>
        ) : messages.length === 0 && !isStreaming ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <SparklesIcon className="h-12 w-12 text-primary opacity-50" />
            <h2 className="text-xl font-medium text-text-primary dark:text-text-primary-dark">How can I help you today?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full max-w-2xl">
               <button onClick={() => setInput('How can I improve my savings score?')} className="p-4 border border-border dark:border-border-dark rounded-xl text-left hover:border-primary text-sm text-text-muted dark:text-text-muted-dark transition-colors">
                 "How can I improve my savings score?"
               </button>
               <button onClick={() => setInput('What is a good emergency fund size?')} className="p-4 border border-border dark:border-border-dark rounded-xl text-left hover:border-primary text-sm text-text-muted dark:text-text-muted-dark transition-colors">
                 "What is a good emergency fund size?"
               </button>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-4 ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-br-none' 
                    : 'bg-surface-2 dark:bg-surface-2-dark text-text-primary dark:text-text-primary-dark rounded-bl-none'
                }`}>
                  {msg.role === 'user' ? (
                    msg.content
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Streaming message */}
            {isStreaming && (
              <div className="flex justify-start">
                <div className="max-w-[85%] bg-surface-2 dark:bg-surface-2-dark text-text-primary dark:text-text-primary-dark rounded-2xl rounded-bl-none p-4 prose prose-sm dark:prose-invert">
                  <ReactMarkdown>{streamedResponse || 'Thinking...'}</ReactMarkdown>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isStreaming}
          placeholder="Ask anything about your finances..."
          className="w-full pl-6 pr-14 py-4 rounded-full border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark focus:ring-2 focus:ring-primary focus:border-primary shadow-sm disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isStreaming}
          className="absolute right-2 top-2 p-2.5 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:bg-surface-2 disabled:text-text-muted"
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
