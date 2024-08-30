import { useContext, useState } from "react";
import { RoomContext } from "../context/RoomContext";
import { useNavigate } from "react-router-dom";

const CreateRoom = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();
  const { ws } = useContext(RoomContext);
  const createRoom = () => {
    ws.emit("create-room");
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="rounded border border-black outline-1 bg-gray-200 focus:bg-gray-100"
        />
        <button
          onClick={() => navigate(`room/${roomId}`)}
          className="bg-rose-400 px-2 rounded-lg text-xl hover:bg-rose-600 text-white"
        >
          Join a meeting
        </button>
      </div>
      <button
        onClick={createRoom}
        className="bg-rose-400 py-2 px-8 rounded-lg text-xl hover:bg-rose-600 text-white"
      >
        Start new meeting
      </button>
    </div>
  );
};

export default CreateRoom;
