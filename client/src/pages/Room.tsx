import { useContext, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { ws } from "../ws";
import { RoomContext } from "../context/RoomContext";
import VideoPlayer from "../components/VideoPlayer";
import { PeerState } from "../reducers/peerReducer";
import ShareScreenButton from "../components/ShareScreenButton";
import ChatButton from "../components/ChatButton";
import Chat from "../components/chat/Chat";
import NameInput from "../common/Name";
// import { UserContext } from "../context/UserContext";
import { ChatContext } from "../context/ChatContext";

const Room = () => {
  const { id } = useParams();
  const emittedEvent = useRef(false);
  const {me,
    userName,
    stream,
    peers,
    shareScreen,
    screenSharingId,
    setRoomId,
  } = useContext(RoomContext);
  const userId = me?.id;
  // const { userName } = useContext(UserContext);
  const { chats, toggleChat } = useContext(ChatContext);

  useEffect(() => {
    if (userId && !emittedEvent.current) {
      ws.emit("join-room", { roomId: id, peerId: userId, userName });
      emittedEvent.current = true;
    }
    // if(userId) ws.emit("join-room", { roomId: id, peerId: userId, userName });
  }, [userId, id, userName]);

  useEffect(() => {
    setRoomId(id || "");
  }, [id, setRoomId]);

  // console.log(screenSharingId);
  const screenSharingVideo =
    screenSharingId === userId ? stream : peers[screenSharingId]?.stream;

  const { [screenSharingId]: sharing, ...peersToShow } = peers;
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-red-500 text-white p-4"> Room id {id}</div>
      <div className="flex grow">
        {screenSharingVideo && (
          <div className="w-4/5 pr-4">
            <VideoPlayer stream={screenSharingVideo} />
          </div>
        )}
        <div
          className={`grid gap-4 ${
            screenSharingVideo ? "w-1/5 grid-col-1" : "grid-cols-4"
          }`}
        >
          {screenSharingId !== userId && (
            <div>
              <VideoPlayer stream={stream} />
              <NameInput />
            </div>
          )}
          {Object.entries(peersToShow as PeerState)
            .filter((peer) => !!peer[1].stream)
            .map((peer) => (
              <div key={peer[0]}>
                <VideoPlayer stream={peer[1].stream} />
                <div>{peer[1].userName}</div>
              </div>
            ))}
        </div>
        {chats.isChatOpen && (
          <div className="border-l-2 pb-28">
            <Chat />
          </div>
        )}
      </div>
      <div className="fixed bottom-0 p-6 w-full h-28 flex justify-center items-center space-x-2 border-t-2 bg-white">
        <ShareScreenButton onClick={shareScreen} />
        <ChatButton onClick={toggleChat} />
      </div>
    </div>
  );
};

export default Room;
