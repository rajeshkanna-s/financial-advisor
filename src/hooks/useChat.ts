import { useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Chat, Message, AppSettings } from '../types';
import { sendMessage } from '../services/ai-service';
import { saveChat, loadChats, deleteChat as removeChat } from '../services/storage-service';

export function useChat(settings: AppSettings) {
  const [chats, setChats] = useState<Chat[]>(() => loadChats());
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  const createNewChat = useCallback((category: string = 'general') => {
    const chat: Chat = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
      category,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setActiveChat(chat);
    return chat;
  }, []);

  const sendUserMessage = useCallback(async (content: string, category?: string) => {
    let chat = activeChat;
    if (!chat) {
      chat = createNewChat(category || 'general');
    }

    if (category && chat.messages.length === 0) {
      chat = { ...chat, category };
    }

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: Date.now(),
      category: chat.category,
    };

    const updatedChat: Chat = {
      ...chat,
      messages: [...chat.messages, userMessage],
      updatedAt: Date.now(),
      title: chat.messages.length === 0 ? content.slice(0, 60) + (content.length > 60 ? '...' : '') : chat.title,
    };

    setActiveChat(updatedChat);
    saveChat(updatedChat);
    setChats(loadChats());
    setIsLoading(true);
    setStreamingContent('');

    const abortController = new AbortController();
    abortRef.current = abortController;

    try {
      const conversationMessages = updatedChat.messages.filter(m => m.role !== 'system');
      const response = await sendMessage(
        conversationMessages,
        settings,
        updatedChat.category,
        (chunk: string) => {
          setStreamingContent(chunk);
        },
        abortController.signal,
      );

      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
        category: updatedChat.category,
      };

      const finalChat: Chat = {
        ...updatedChat,
        messages: [...updatedChat.messages, assistantMessage],
        updatedAt: Date.now(),
      };

      setActiveChat(finalChat);
      saveChat(finalChat);
      setChats(loadChats());
    } catch (error: any) {
      if (error.name === 'AbortError') {
        const partialContent = streamingContent || 'Response stopped by user.';
        const partialMessage: Message = {
          id: uuidv4(),
          role: 'assistant',
          content: partialContent + '\n\n⏹️ *Response stopped*',
          timestamp: Date.now(),
          category: updatedChat.category,
        };

        const stoppedChat: Chat = {
          ...updatedChat,
          messages: [...updatedChat.messages, partialMessage],
          updatedAt: Date.now(),
        };

        setActiveChat(stoppedChat);
        saveChat(stoppedChat);
        setChats(loadChats());
      } else {
        const errorMessage: Message = {
          id: uuidv4(),
          role: 'assistant',
          content: `❌ **Error:** ${error.message || 'Something went wrong. Please try again.'}`,
          timestamp: Date.now(),
        };

        const errorChat: Chat = {
          ...updatedChat,
          messages: [...updatedChat.messages, errorMessage],
          updatedAt: Date.now(),
        };

        setActiveChat(errorChat);
        saveChat(errorChat);
        setChats(loadChats());
      }
    } finally {
      setIsLoading(false);
      setStreamingContent('');
      abortRef.current = null;
    }
  }, [activeChat, createNewChat, settings, streamingContent]);

  const selectChat = useCallback((chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) setActiveChat(chat);
  }, [chats]);

  const deleteExistingChat = useCallback((chatId: string) => {
    removeChat(chatId);
    const updated = loadChats();
    setChats(updated);
    if (activeChat?.id === chatId) {
      setActiveChat(null);
    }
  }, [activeChat]);

  const refreshChats = useCallback(() => {
    setChats(loadChats());
  }, []);

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return {
    chats,
    activeChat,
    isLoading,
    streamingContent,
    createNewChat,
    sendUserMessage,
    selectChat,
    deleteChat: deleteExistingChat,
    refreshChats,
    setActiveChat,
    stopGeneration,
  };
}
