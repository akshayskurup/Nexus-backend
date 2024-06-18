"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const db_1 = __importDefault(require("./config/db"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const connectionRoutes_1 = __importDefault(require("./routes/connectionRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const assistantRoutes_1 = __importDefault(require("./routes/assistantRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const errorHandling_1 = require("./middleware/errorHandling");
const socket_io_1 = require("socket.io");
const socket_1 = __importDefault(require("./utils/socket"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
}));
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
}));
(0, db_1.default)();
//create HTTP Server
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
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
(0, socket_1.default)(io);
app.use("/api/user", userRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
app.use("/api/post", postRoutes_1.default);
app.use("/api/connection", connectionRoutes_1.default);
app.use("/api/chat", chatRoutes_1.default);
app.use("/api/assistant", assistantRoutes_1.default);
app.use("/api/payment", paymentRoutes_1.default);
app.use(errorHandling_1.errorHandler);
server.listen(port, () => {
    console.log(`Server started on ${port}`);
});
