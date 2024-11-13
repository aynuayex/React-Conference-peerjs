import 'dotenv/config';
import express from "express";
import http from 'http';
import {Server} from "socket.io";
// import cors, { CorsOptions }  from "cors";
import { roomHandler } from "./room";

const port = process.env.PORT || 8080;
const app = express();

// const whitelist = ["http://localhost:5173", "http://192.168.8.3:5173", "https://react-conference-peerjs.netlify.app"]
// const corsOptions: CorsOptions = {
//     origin: function (origin, callback) {
//       if (origin && whitelist.indexOf(origin) !== -1) {
//         callback(null, true)
//       } else {
//         callback(new Error('Not allowed by CORS'))
//       }
//     },
//     optionsSuccessStatus: 200
//   }
// app.use(cors(corsOptions));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://192.168.8.3:5173", "https://react-conference-peerjs.netlify.app"],
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    console.log("user is connected!")

    roomHandler(socket);

    socket.on("disconnect", () => {
        console.log("user is disconnected!");
    })
})

server.listen(port, () => console.log(`Server is running on port ${port}`))


