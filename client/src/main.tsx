import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import App from "./App.tsx";
import "./index.css";
import { RoomProvider } from "./context/RoomContext.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Room from "./pages/Room.tsx";
import { UserProvider } from "./context/UserContext.tsx";
import { ChatProvider } from "./context/ChatContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <RoomProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/room/:id" element={<ChatProvider><Room /></ChatProvider>} />
          </Routes>
        </RoomProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);                        
