import { useContext, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";
import VideoPlayer from "../components/VideoPlayer";
import { PeerState } from "../context/peerReducer";

const Room = () => {
  const { id } = useParams();
  const emittedEvent = useRef(false);
  const { me, ws, stream, peers } = useContext(RoomContext);

  useEffect(() => {
    if (me && !emittedEvent.current) {
      ws.emit("join-room", { roomId: id, peerId: me._id });
      emittedEvent.current = true;
    }
    // if(me) ws.emit("join-room", { roomId: id, peerId: me._id });
  }, [me, id, ws]);

  return (
    <div>
      Room id {id}
      <div className="grid grid-cols-4 gap-4">
        <VideoPlayer stream={stream} />
        {Object.entries(peers as PeerState).map((peer) => (
          <VideoPlayer key={peer[0]} stream={peer[1].stream} />
        ))}
      </div>
    </div>
  );
};

export default Room;
