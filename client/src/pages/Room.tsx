import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ws } from "../ws";
import { RoomContext } from "../context/RoomContext";
import VideoPlayer from "../components/VideoPlayer";
import { PeerState } from "../reducers/peerReducer";
import ShareScreenButton from "../components/ShareScreenButton";
import ChatButton from "../components/ChatButton";
import Chat from "../components/chat/Chat";
import NameInput from "../common/Name";
import { ChatContext } from "../context/ChatContext";
import HangButton from "@/components/HangButton";
import MuteButton from "@/components/MuteButton";
import VideoPauseButton from "@/components/VideoPauseButton";
import { Dialog, DialogContent } from "../components/ui/dialog";

const Room = () => {
  const { id } = useParams();
  const emittedEvent = useRef(false);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const {
    me,
    hangUp,
    isVideoEnabled,
    isAudioEnabled,
    toggleVideo,
    toggleAudio,
    userName,
    stream,
    setStream,
    peers,
    shareScreen,
    screenSharingId,
    setRoomId,
  } = useContext(RoomContext);
  const userId = me?.id;
  const { chats, toggleChat } = useContext(ChatContext);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        console.log(`Camera permission: ${cameraPermission.state}`);
  
        const microphonePermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        console.log(`Microphone permission: ${microphonePermission.state}`);
  
        if (cameraPermission.state !== 'granted' || microphonePermission.state !== 'granted') {
          console.log("Access to camera or microphone denied or not yet granted.");
          // Request camera and microphone access
          setOpen(true);
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          setStream(stream);
          setOpen(false);
          return;
        } 
      } catch (err) {
        console.error("Error accessing media devices or permissions.", err);
        setOpen(false); 
      }
    };
  
    checkPermissions(); 
  }, []);
  

  useEffect(() => {
    if (userId && !emittedEvent.current) {
      ws.emit("join-room", { roomId: id, peerId: userId, userName });
      emittedEvent.current = true;
    }
    // if(userId) ws.emit("join-room", { roomId: id, peerId: userId, userName });
    return () => {
      ws.off("join-room");
    };
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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <img
            src="https://www.gstatic.com/meet/permissions_flow_allow_ltr_478239240996514edc5a278a3a08fa6f.svg"
            alt="Arrow pointing towards the browser's permission dialogue."
          />
          <div className="text-xl text-center font-semibold">Click Allow</div>
          <div className="text-center">
            You can still turn off your camera and mic at any time during the
            meeting.
          </div>
        </DialogContent>
      </Dialog>
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
        <MuteButton isAudioEnabled={isAudioEnabled} onClick={toggleAudio} />
        <VideoPauseButton
          isVideoEnabled={isVideoEnabled}
          onClick={toggleVideo}
        />
        <ShareScreenButton onClick={shareScreen} />
        <ChatButton onClick={toggleChat} />
        <HangButton onClick={hangUp} />
      </div>
    </div>
  );
};

export default Room;
