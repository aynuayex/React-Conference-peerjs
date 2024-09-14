import React, { useContext } from "react";
import { IMessage } from "../../type/chat";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import { ChatContext } from "../../context/ChatContext";

const Chat: React.FC<{}> = ({}) => {
  const { chats } = useContext(ChatContext);
  
  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        {chats?.messages?.map((message: IMessage) => (
          <ChatBubble message={message} key={message.timestamp + (message?.author || "Anonymous")} />
        ))}
      </div>
      <ChatInput />
    </div>
  );
};

export default Chat;
