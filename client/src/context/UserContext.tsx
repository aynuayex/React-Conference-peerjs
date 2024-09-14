import { createContext, useEffect, useRef, useState } from "react";
import { v4 as uuidV4 } from "uuid";

interface UserValue {
  userId: string;
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
}

export const UserContext = createContext<UserValue>({
    userId: "",
    userName: "",
    setUserName: () => {}
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  // const [userId, setUserId] = useState(uuidV4()
  // );
  const userId = useRef("");
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || ""
  );

  useEffect(() => {
    localStorage.setItem("userName", userName);
  }, [userName]);

  useEffect(() => {
    userId.current = uuidV4();
  }, []);

  // useEffect(() => {
  //   localStorage.setItem("userId", userId);
  // }, [userId]);

  return (
    <UserContext.Provider value={{ userId: userId.current, userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
};
