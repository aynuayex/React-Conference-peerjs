import { PhoneOff } from "lucide-react";
import Button from "./commom/Button";

const HangButton: React.FC<{onClick: () => void }> = ({onClick}) => {
  return (
    <Button className="p-4 mx-2" onClick={onClick} >
      <PhoneOff />
    </Button>
  );
};

export default HangButton;
