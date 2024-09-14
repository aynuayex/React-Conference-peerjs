import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NameInput from "../common/Name";
import Button from "./commom/Button";
import { ws } from "../ws";

const CreateRoom = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();
  const createRoom = () => {
    ws.emit("create-room");
  };

  return (
    <div className="flex flex-col gap-2">
      <NameInput />
      <div className="flex gap-2">
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="p-2 rounded border border-black outline-1 bg-gray-200 focus:bg-gray-100"
        />
        <button
          onClick={() => navigate(`room/${roomId}`)}
          className="bg-rose-400 px-2 rounded-lg text-xl hover:bg-rose-600 text-white"
        >
          Join a meeting
        </button>
      </div>
      <Button
        onClick={createRoom}
        className="py-2 px-8 text-xl"
      >
        Start new meeting
      </Button>
    </div>
  );
};

export default CreateRoom;
