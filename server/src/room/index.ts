import { Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";

const rooms: Record<string, Record<string, User>> = {};
const chats: Record<string, IMessage[]> = {};

interface User {
  peerId: string;
  userName: string;
}

interface RoomParams {
  roomId: string;
  peerId: string;
}

interface JoinRoomParams extends RoomParams {
  userName: string;
}

interface IMessage {
  content: string;
  author?: string;
  timestamp: number;
}

export const roomHandler = (socket: Socket) => {

  const createRoom = () => {
    const roomId = uuidV4();
    rooms[roomId] = {};
    socket.emit("room-created", { roomId });
    console.log("user created a room!", roomId);
  };

  const joinRoom = ({ roomId, peerId, userName }: JoinRoomParams) => {
    if (!rooms[roomId]) rooms[roomId] = {};
    if (!chats[roomId]) chats[roomId] = [];
    socket.emit("get-messages", chats[roomId]);

    socket.join(roomId);
    rooms[roomId][peerId] = {peerId, userName};
    socket.to(roomId).emit("user-joined",{ peerId, userName});
    console.log("user joined a room!", roomId, peerId, userName);

    socket.on("disconnect", () => {
      console.log("user left the room!", peerId);
      leaveRoom({ roomId, peerId });
    });
  };

  const leaveRoom = ({ roomId, peerId }: RoomParams) => {
    // rooms[roomId] = rooms[roomId]?.filter((id) => id !== peerId);

    const {peerId: deleted, ...rest} = rooms[roomId];
    rooms[roomId] = rest;

    socket.to(roomId).emit("user-disconnected", peerId);
  };

  const startSharing = ({ roomId, peerId }: RoomParams) => {
    socket.to(roomId).emit("user-started-sharing", peerId);
  };

  const stopSharing = (roomId: string) => {
    socket.to(roomId).emit("user-stopped-sharing");
  };

  const addMessage = (roomId: string, message: IMessage) => {
    console.log({ message });
    if(!chats[roomId]) chats[roomId] = [];
    chats[roomId].push(message);
    socket.to(roomId).emit("add-message", message);
  };

  const changeName = ({ peerId, userName, roomId}: JoinRoomParams) => {
    if (rooms[roomId] && rooms[roomId][peerId]) {
      rooms[roomId][peerId].userName = userName;
      socket.to(roomId).emit("name-changed", { peerId, userName});
    }
  }

  // const requestJoin = ({peerId, roomId}: RoomParams) => {
  //   socket.to(roomId).emit("requested-to-join", peerId)
  // }

  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
  socket.on("start-sharing", startSharing);
  socket.on("stop-sharing", stopSharing);
  socket.on("send-message", addMessage);
  socket.on("change-name", changeName);
  // socket.on("ask-to-join", requestJoin);
  // Handle the custom "user-left-room" event
  socket.on("user-left-room", ({ roomId, peerId }: RoomParams) => {
    console.log("User triggered leaving room:", roomId, peerId);
    leaveRoom({ roomId, peerId });
  });
};
