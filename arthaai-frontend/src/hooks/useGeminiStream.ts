import { useState, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';

export function useGeminiStream() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedResponse, setStreamedResponse] = useState('');
  const { token } = useAuthStore();

  const streamChat = useCallback(async (message: string, onComplete?: () => void) => {
    setIsStreaming(true);
    setStreamedResponse('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');

      if (!reader) throw new Error('No reader available');

      let done = false;
      let buffer = '';

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          
          // SSE messages are separated by double newlines
          const messages = buffer.split('\n\n');
          // Keep the last partial chunk in the buffer
          buffer = messages.pop() || '';

          for (const msg of messages) {
            if (msg.startsWith('data: ')) {
              let text = msg.substring(6);
              text = text.replace(/\\n/g, '\n');
              setStreamedResponse(prev => prev + text);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in SSE stream', error);
      setStreamedResponse('An error occurred while communicating with the AI.');
    } finally {
      setIsStreaming(false);
      if (onComplete) onComplete();
    }
  }, [token]);

  return { streamChat, isStreaming, streamedResponse, setStreamedResponse };
}
