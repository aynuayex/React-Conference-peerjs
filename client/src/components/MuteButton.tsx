import { Mic, MicOff } from "lucide-react";
import Button from "./commom/Button";

const MuteButton: React.FC<{ isAudioEnabled: boolean; onClick: () => void }> = ({
  isAudioEnabled,
  onClick,
}) => {
  return (
    <Button className="p-4 mx-2" onClick={onClick}>
      {isAudioEnabled ? <MicOff /> : <Mic />}
    </Button>
  );
};

export default MuteButton;
