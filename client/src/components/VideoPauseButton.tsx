import { Video, VideoOff } from "lucide-react";
import Button from "./commom/Button";

const VideoPauseButton: React.FC<{isVideoEnabled: boolean ,onClick: () => void }> = ({isVideoEnabled, onClick}) => {
  return (
    <Button className="p-4 mx-2" onClick={onClick} >
      {isVideoEnabled ? <VideoOff /> : <Video />}
    </Button>
  );
};

export default VideoPauseButton;
