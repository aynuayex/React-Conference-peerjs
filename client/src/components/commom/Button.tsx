import classNames from "classnames";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className: string;
  type?: "submit" | "button" | "reset";
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className, type="submit" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      //   onClick={createRoom}
      className={classNames(
        "bg-rose-400 p-2 rounded-lg hover:bg-rose-600 text-white",
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
