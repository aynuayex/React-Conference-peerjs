import Peer from "peerjs";
import { createContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import socketIO from "socket.io-client";
import { v4 as uuidV4 } from "uuid";
import { peersReducer } from "./peerReducer";
import { addPeerAction, removePeerAction } from "./peerActions";

const server = "http://localhost:8080";
const ws = socketIO(server);

export const RoomContext = createContext<any | null>(null);

export const RoomProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [me, setMe] = useState<Peer>();
  const [stream, setStream] = useState<MediaStream>();
  const [peers, dispatch] = useReducer(peersReducer, {});

  const enterRoom = ({ roomId }: { roomId: string }) => {
    console.log({ roomId });
    navigate(`/room/${roomId}`);
  };
  const getUsers = ({
    roomId,
    participants,
  }: {
    roomId: string;
    participants: string[];
  }) => {
    console.log({ roomId, participants });
    // navigate(`/room/${roomId}`);
  };

  const removePeer = (peerId: string) => {
    dispatch(removePeerAction(peerId));
  }

  useEffect(() => {
    const meId = uuidV4();
    const peer = new Peer(meId);
    // console.log(peer);
    peer && setMe(peer);
    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => setStream(stream));
    } catch (err) {
      console.error("Error accessing media devices.", err);
    }
    ws.on("room-created", enterRoom);
    ws.on("get-users", getUsers);
    ws.on("user-disconnected", removePeer);
  }, []);

  useEffect(() => {
    console.log({ me, stream });
    if (!me || !stream) return;
    ws.on("user-joined", (peerId) => {
      setTimeout(() => {
        console.log("user joined a room!", peerId);
        const call = me.call(peerId, stream);
        call.on("stream", (peerStream) => {
          dispatch(addPeerAction(peerId, peerStream));
        });
      },1000);
    });
    me.on("call", (call) => {
      console.log({ call });
      call.answer(stream);
      call.on("stream", (peerStream) => {
        console.log("hi");
        dispatch(addPeerAction(call.peer, peerStream));
      });
    });
  }, [me, stream]);

  console.log({ peers });

  return (
    <RoomContext.Provider value={{ ws, me, stream, peers }}>
      {children}
    </RoomContext.Provider>
  );
};
