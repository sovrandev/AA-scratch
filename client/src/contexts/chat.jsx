import React, { createContext, useState, useContext, useEffect } from 'react';
import { generalSocketService } from '../services/sockets/general.socket.service';
import useLocalStorage from '../hooks/useLocalStorage';

const ChatContext = createContext(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [chatOnline, setChatOnline] = useState(0);
  const [currentChatRoom, setCurrentChatRoom] = useState('en');
  const [chatHidden, setChatHidden] = useLocalStorage('chatHidden', false)

  useEffect(() => {
    const initChat = async () => {
      try {
        const response = await generalSocketService.getChatMessages(currentChatRoom);
        if (response.success) {
          setChatMessages(response.messages);
        }
      } catch (error) {
        console.error('Failed to get chat messages:', error);
      }
    };
    initChat();

    const chatMessageCleanup = generalSocketService.onChatMessage(({ message }) => {
      setChatMessages(prev => [...prev, message]);
    });

    const chatRemoveCleanup = generalSocketService.onChatRemove(({ messageId }) => {
      setChatMessages(prev => prev.filter(msg => msg._id !== messageId));
    });

    const chatClearCleanup = generalSocketService.onChatClear(() => {
      setChatMessages([]);
    });

    const chatOnlineCleanup = generalSocketService.onChatOnline(({ online }) => {
      setChatOnline(online[currentChatRoom])
    });

    return () => {
      chatMessageCleanup();
      chatRemoveCleanup();
      chatClearCleanup();
      chatOnlineCleanup();
    };
  }, [currentChatRoom]);

  const sendChatMessage = async (message) => {
    return generalSocketService.sendChatMessage(message);
  };

  const changeChatRoom = (room) => {
    setCurrentChatRoom(room);
  };

  const toggleChatVisibility = () => {
    setChatHidden(!chatHidden)
  };

  return (
    <ChatContext.Provider 
      value={{
        messages: chatMessages,
        currentRoom: currentChatRoom,
        sendMessage: sendChatMessage,
        changeRoom: changeChatRoom,
        online: chatOnline,
        chatHidden, 
        toggleChat: toggleChatVisibility
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}; 