import { useContext, useState } from "react";
import Button from "../commom/Button";
import { ChatContext } from "../../context/ChatContext";
import { RoomContext } from "../../context/RoomContext";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const { sendMessage } = useContext(ChatContext);
  const { me, roomId } = useContext(RoomContext);
  const userId = me?.id;

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(message, roomId, userId);
          setMessage("");
        }}
      >
        <div className="flex space-x-2">
          <textarea
            className="border rounded"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button className="p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
