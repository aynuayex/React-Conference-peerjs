import Peer, { MediaConnection } from "peerjs";
import {
  createContext,
  // useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { ws } from "../ws";
import { peersReducer } from "../reducers/peerReducer";
import {
  addAllPeersAction,
  addPeerNameAction,
  addPeerStreamAction,
  removePeerStreamAction,
} from "../reducers/peerActions";
// import { UserContext } from "./UserContext";
import { User } from "../type/user";
import { v4 as uuidV4 } from "uuid";

// interface RoomValue {
//   me: Peer | null,
//   // userId: string;
//   userName: string,
//   setUserName: React.Dispatch<React.SetStateAction<string>>,
//   peers: PeerState;
//   stream?: MediaStream;
//   roomId: string;
//   setRoomId: React.Dispatch<React.SetStateAction<string>>;
//   shareScreen: () => void;
//   screenSharingId: string;
// }

export const RoomContext = createContext<any | null>({
  me: null,
  peers: {},
  // userId: "",
  roomId: "",
  setRoomId: () => {},
  shareScreen: () => {},
  screenSharingId: "",
});

export const RoomProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  // const [me, setMe] = useState<Peer>();
  const meRef = useRef<Peer>();
  const connectionsRef = useRef<Record<string, MediaConnection[]>>({});
  // const { userName, userId } = useContext(UserContext);
  const [userName, setUserName] = useState("");
  const [stream, setStream] = useState<MediaStream>();
  const [screenSharingId, setScreenSharingId] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [peers, dispatch] = useReducer(peersReducer, {});

  const enterRoom = ({ roomId }: { roomId: string }) => {
    // console.log({ roomId });
    navigate(`/room/${roomId}`);
  };

  const getUsers = ({
    roomId,
    participants,
  }: {
    roomId: string;
    // participants: string[];
    participants: Record<string, User>;
  }) => {
    console.log({ roomId, participants });
    dispatch(addAllPeersAction(participants));
  };

  const removePeer = (peerId: string) => {
  // Close all connections to this peer
    if (connectionsRef.current[peerId]) {
      connectionsRef.current[peerId].forEach((conn) => conn.close());
      delete connectionsRef.current[peerId];
    }

    // dispatch(removePeerAction(peerId));
    dispatch(removePeerStreamAction(peerId));
  };

  const switchStream = (newStream: MediaStream, id: string) => {
    // Stop all tracks of the current stream before switching
    screenSharingId &&
      stream &&
      stream.getTracks().forEach((track) => track.stop());

    setStream(newStream);
    setScreenSharingId(id);

    // Get the video track from the new stream
    const videoTrack = newStream
      .getTracks()
      .find((track) => track.kind === "video");

    // If video track exists, add an event listener to handle 'ended' event
    // if (videoTrack) {
    //   videoTrack.onended = () => {
    //     console.log("Screen sharing stopped by user.");
    //     // Switch back to the default camera stream
    //     navigator.mediaDevices
    //       .getUserMedia({ video: true, audio: true })
    //       .then((cameraStream) => switchStream(cameraStream, ""))
    //       .catch((err) =>
    //         console.error(
    //           "Error accessing camera after stopping screen share:",
    //           err
    //         )
    //       );
    //   };
    // }

    Object.values(connectionsRef.current).forEach(
      (connectionArray: MediaConnection[]) => {
        // Update all active connections with the new video track
        connectionArray.forEach((connection) => {
          connection.peerConnection.getSenders().forEach((sender) => {
            if (sender.track && sender.track.kind === "video") {
              sender
                .replaceTrack(videoTrack!)
                .catch((err: any) =>
                  console.error("Error replacing track:", err)
                );
            }
          });
        });
      }
    );
  };

  // const switchStream = (stream: MediaStream, id: string) => {
  //   setStream(stream);
  //   setScreenSharingId(id);
  //   Object.values(me?.connections).forEach((connection: any) => {
  //     const videoTrack = stream
  //       ?.getTracks()
  //       .find((track) => track.kind === "video");
  //     console.log({ connection });
  //     connection[0].peerConnection
  //       .getSenders()[1]
  //       .replaceTrack(videoTrack)
  //       .catch((err: any) => console.log(err));
  //   });
  // };

  // const shareScreen = () => {
  //   if (screenSharingId) {
  //     navigator.mediaDevices
  //       .getUserMedia({ video: true, audio: true })
  //       .then((stream) => switchStream(stream, ""));
  //   } else {
  //     navigator.mediaDevices
  //       .getDisplayMedia({})
  //       .then((stream) => switchStream(stream, userId || ""));
  //   }
  // };

  const shareScreen = () => {
    if (screenSharingId) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((cameraStream) => switchStream(cameraStream, ""));
    }
    // else {
    //   navigator.mediaDevices
    //     .getDisplayMedia({})
    //     .then((screenStream) => switchStream(screenStream, meRef.current?.id || ""))
    //     .catch(console.log);
    // }
    else {
      // Start screen sharing
      navigator.mediaDevices
        .getDisplayMedia({ video: true, audio: true })
        .then((screenStream) => {
          // Listen for the user stopping the screen share using the browser-provided button
          screenStream.getVideoTracks()[0].onended = () => {
            console.log("Screen sharing stopped by user.");
            navigator.mediaDevices
              .getUserMedia({ video: true, audio: true })
              .then((cameraStream) => switchStream(cameraStream, ""))
              .catch((err) =>
                console.error(
                  "Error accessing camera after stopping screen share:",
                  err
                )
              );
          };
          switchStream(screenStream, meRef.current?.id || "");
        })
        .catch((err) => console.error("Error starting screen share:", err));
    }
  };

  const nameChangedHandler = ({ peerId, userName }: User) => {
    console.log({ peerId });
    dispatch(addPeerNameAction(peerId, userName));
  };

  useEffect(() => {
    const userId = uuidV4();

    const peer = new Peer(
    userId,
     {
      // host: "localhost",
      // port: 9000,
      // path: "/myapp",
    }
    );
    meRef.current = peer;
    // console.log(peer);
    // peer && setMe(peer);
    // Register event handlers for the peer
    peer.on("open", () => {
      console.log("Peer connection is open with ID:", peer.id);
    });

    peer.on("error", (err) => {
      console.error({ err });
    });
    peer.on("disconnected", () => peer.reconnect());
    peer.on("call", (call) => {
      const { userName: remoteName } = call.metadata;
      if (call) {
        // Store the connection
        if (!connectionsRef.current[call.peer]) {
          connectionsRef.current[call.peer] = [];
        }
        connectionsRef.current[call.peer].push(call);
        if (stream) {
          dispatch(addPeerNameAction(call.peer, remoteName));
          call.answer(stream);
          call.on("stream", (peerStream) => {
            console.log("Received stream from peer:", call.peer);
            dispatch(addPeerStreamAction(call.peer, peerStream));
          });
        } else {
          // Set up media stream
          navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
              setStream(stream);
              dispatch(addPeerNameAction(call.peer, remoteName));

              call.answer(stream);
              call.on("stream", (peerStream) => {
                console.log("Received stream from peer:", call.peer);
                dispatch(addPeerStreamAction(call.peer, peerStream));
              });
            })
            .catch((err) => {
              console.error("Error accessing media devices.", err);
            });
        }
      }
    });

    // Set up media stream
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
      })
      .catch((err) => {
        console.error("Error accessing media devices.", err);
      });
    ws.on("room-created", enterRoom);
    ws.on("get-users", getUsers);
    ws.on("user-disconnected", removePeer);
    ws.on("user-started-sharing", (peerId) => setScreenSharingId(peerId));
    ws.on("user-stopped-sharing", () => setScreenSharingId(""));
    ws.on("name-changed", nameChangedHandler);

    return () => {
      ws.off("room-created");
      ws.off("get-users");
      ws.off("user-disconnected");
      ws.off("user-started-sharing");
      ws.off("user-stopped-sharing");
      ws.off("name-changed");
    };
  }, []);

  useEffect(() => {
    if (screenSharingId) {
      ws.emit("start-sharing", { roomId, peerId: screenSharingId });
    } else {
      ws.emit("stop-sharing", roomId);
    }
  }, [screenSharingId, roomId]);

  // useEffect(() => {
  //   console.log({ me, stream });
  //   if (!me || !stream) return;
  //   ws.on("user-joined", ({ peerId, userName: name }) => {
  //     dispatch(addPeerNameAction(peerId, name));
  //     console.log("user joined a room!", peerId, name);
  //     // me.on("open", () => {
  //     setTimeout(() => {
  //       const call = me.call(peerId, stream, {
  //         metadata: { userName },
  //       });
  //       call.on("stream", (peerStream) => {
  //         console.log("hi inside");
  //         dispatch(addPeerStreamAction(peerId, peerStream));
  //       });
  //       call.on("error", (err: any) => console.error({ err }));
  //     }, 1000);
  //     // })
  //   });
  //   // me.on("open", () => {

  //   me.on("call", (call) => {
  //     const { userName } = call.metadata;
  //     dispatch(addPeerNameAction(call.peer, userName));
  //     call.answer(stream);
  //     call.on("stream", (peerStream) => {
  //       dispatch(addPeerStreamAction(call.peer, peerStream));
  //     });
  //   });
  //   me.on("disconnected", () => me.reconnect());
  //   // })
  // }, [me, stream, userName]);

  useEffect(() => {
    if (!meRef.current || !stream) return;

    function attemptCall(
      peerId: string,
      remoteName: string,
      stream: MediaStream,
      retries = 3
    ) {
      if (retries <= 0) {
        console.error("Failed to connect to peer after multiple attempts.");
        return;
      }
      dispatch(addPeerNameAction(peerId, remoteName));
      const call = meRef.current?.call(peerId, stream, {
        metadata: { userName },
      });

      if (call) {
        // Store the connection
        if (!connectionsRef.current[peerId]) {
          connectionsRef.current[peerId] = [];
        }
        connectionsRef.current[peerId].push(call);

        call.on("stream", (peerStream) => {
          console.log("Received stream from peer:", peerId);
          dispatch(addPeerStreamAction(peerId, peerStream));
        });

        call.on("close", () => {
          console.log("Call closed with peer:", peerId);
          // Remove closed connections
          connectionsRef.current[peerId] = connectionsRef.current[
            peerId
          ].filter((c) => c !== call);
        });

        call.on("error", (err) => console.log("Call error with peer:", err));
      }

      meRef.current?.on("error", (err) => {
        console.error("Error while calling peer:", err);
        if (err.type === "peer-unavailable") {
          console.log("Retrying call...");
          setTimeout(
            () => attemptCall(peerId, remoteName, stream, retries - 1),
            1000
          ); // Retry after 1 second
        }
      });
    }

    ws.on("user-joined", ({ peerId, userName: remoteName }) => {
      console.log("User joined a room!", peerId);
      attemptCall(peerId, remoteName, stream);
    });

    return () => {
      ws.off("user-joined");
    };
  }, [meRef.current, stream]);

  console.log({ peers });

  return (
    <RoomContext.Provider
      value={{
        // me,
        userName,
        setUserName,
        me: meRef.current,
        peers,
        stream,
        roomId,
        setRoomId,
        shareScreen,
        screenSharingId,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
