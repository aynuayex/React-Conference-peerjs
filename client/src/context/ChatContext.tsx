import { createContext, useEffect, useReducer } from "react";
import { IMessage } from "../type/chat";
import { chatsReducer, ChatState } from "../reducers/chatReducer";
import {
  addHistoryAction,
  addMessageAction,
  toggleChatAction,
} from "../reducers/chatActions";
import { ws } from "../ws";

interface ChatValue {
  chats: ChatState;
  toggleChat: () => void;
  sendMessage: (message: string, roomId: string, author: string) => void;
}
export const ChatContext = createContext<ChatValue>({
  chats: { messages: [], isChatOpen: false },
  toggleChat: () => {},
  sendMessage: () => {},
});

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [chats, chatDispatch] = useReducer(chatsReducer, {
    messages: [],
    isChatOpen: false,
  });

  useEffect(() => {
    ws.on("add-message", addMessage);
    ws.on("get-messages", addHistory);
    return () => {
      ws.off("add-message");
      ws.off("get-messages");
    };
  }, []);

  const sendMessage = (message: string, roomId: string, author: string) => {
    console.log(author);
    const messageData: IMessage = {
      content: message,
      author,
      timestamp: new Date().getTime(),
    };
    chatDispatch(addMessageAction(messageData));
    ws.emit("send-message", roomId, messageData);
  };

  const addMessage = (message: IMessage) => {
    console.log("new-message", message);
    chatDispatch(addMessageAction(message));
  };

  const addHistory = (messages: IMessage[]) => {
    chatDispatch(addHistoryAction(messages));
  };

  const toggleChat = () => {
    chatDispatch(toggleChatAction(chats.isChatOpen));
  };
  return (
    <ChatContext.Provider value={{ chats, toggleChat, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};
