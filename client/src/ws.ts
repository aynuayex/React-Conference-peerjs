import socketIO from "socket.io-client";


// const server = "https://react-conference-peerjs.onrender.com";
const server = "https://react-conference-peerjs-backend.vercel.app/";

// const server = "http://localhost:8080";
export const ws = socketIO(server);

