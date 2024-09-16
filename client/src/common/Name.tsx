import { useContext, useEffect } from "react";
import { RoomContext } from "../context/RoomContext";
import { ws } from "../ws";

const NameInput = () => {
  const { me, roomId, userName, setUserName } = useContext(RoomContext);
  const userId = me?.id;

  useEffect(() => {
    sessionStorage.setItem("userName", userName);
  }, [userName]);

  useEffect(() => {
    ws.emit("change-name", { peerId: userId, userName, roomId });
  }, [userName, userId, roomId]);

  return (
    <input
      value={userName}
      onChange={(e) => setUserName(e.target.value)}
      className="border rounded-md p-2 h-10 my-2 "
      placeholder="Enter your name"
    />
  );
};

export default NameInput;
