import express, { urlencoded } from "express";
import dotenv from "dotenv";
import session from "express-session";
import cors from "cors";
import http from "http";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import postRoutes from "./routes/postRoutes";
import connectionRoutes from "./routes/connectionRoutes";
import chatRoutes from "./routes/chatRoutes";
import assistantRoutes from "./routes/assistantRoutes"
import paymentRoutes from "./routes/paymentRoutes"
import { errorHandler } from "./middleware/errorHandling";
import { Server } from "socket.io";
import socketConfig from "./utils/socket";

dotenv.config();

const app = express();
const port = process.env.PORT;
declare module "express-session" {
  interface Session {
    userDetails?: {
      name?: string;
      email?: string;
      password?: string;
    };
    otp?: string;
    otpGeneratedTime?: number;
    email: string;
    history: {
      [key: string]: { role: string, parts: { text: string }[] }[]
    };
  }
}
interface UserPayload {
  userId?: string,
  role?: string
}
declare module 'express-serve-static-core' {
  interface Request {
    user?: UserPayload; 
  }
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

connectDB();

//create HTTP Server

const server = http.createServer(app);

const io: Server = new Server(server, {
  cors: { origin: "*" },
});
// io.on("connect", (socket) => {
//     console.log(`User connected ${socket.id}`);

//     socket.on("chat message", (message) => {
//       console.log(`Received message from client: ${message}`);
//       socket.broadcast.emit("message_received", message);
//     });

//     // Handle disconnection
//     socket.on("disconnect", () => {
//       console.log(`User disconnected ${socket.id}`);
//     });
//   });

socketConfig(io);

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/post", postRoutes);
app.use("/api/connection", connectionRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/assistant",assistantRoutes);
app.use("/api/payment",paymentRoutes)
app.use(errorHandler);

server.listen(port, () => {
  console.log(`Server started on ${port}`);
});
