import { Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";

const rooms: Record<string, string[]> = {};
interface RoomParams {
  roomId: string;
  peerId: string;
}

export const roomHandler = (socket: Socket) => {

  const createRoom = () => {
    const roomId = uuidV4();
    rooms[roomId] = [];
    socket.emit("room-created", { roomId });
    console.log("user created a room!", roomId);
  };

  const joinRoom = ({ roomId, peerId }: RoomParams) => {
    if (rooms[roomId]) {
      socket.join(roomId);
      rooms[roomId].push(peerId);
      socket.to(roomId).emit("user-joined", peerId);
      console.log("user joined a room!", roomId, peerId);
      socket.emit("get-users", {
        roomId,
        participants: rooms[roomId],
      });
    }
    socket.on("disconnect", () => {
      console.log("user left the room!", peerId);
      leaveRoom({ roomId, peerId });
    });
  };

  const leaveRoom = ({ roomId, peerId }: RoomParams) => {
    rooms[roomId] = rooms[roomId]?.filter((id) => id !== peerId);

    socket.to(roomId).emit("user-disconnected", peerId);
  };

  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
};
