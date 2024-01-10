const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { Server } = require("socket.io");
const { createServer } = require("http");
const User = require('./models/User.js')
const jwt = require('jsonwebtoken')

const adminRouter = require("./routes/adminRouter");
const usersRouter = require("./routes/userRouter");
const courseRouter = require("./routes/courseRouter");
const categoryRouter = require("./routes/categoryRouter");
const chapterRouter = require("./routes/chapterRouter");
const segmentRouter = require("./routes/segmentRouter");
const enrollmentRouter = require("./routes/enrollmentRouter");
const webhookRouter = require("./routes/webhookRouter");
const errorHandler = require("./middlewares/errorHandler");
const wishlistRouter = require("./routes/wishlistRouter");
const chatRouter = require("./routes/chatRouter");
const cors = require("cors");
const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

app.set("io", io);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

io.on("connection", async (socket) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      // throw new ApiError(401, 'Un-authorized handshake. Token is missing')
      console.log("Un-authorized handshake. Token is missing");
      return;
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // decode the token

    if (!decodedToken?.userId) {
      console.log("Un-authorized handshake. Token is invalid");
      // throw new ApiError(401, 'Un-authorized handshake. Token is invalid')
    }

    const user = await User.findById(decodedToken?.userId);
    if (!user) {
      // throw new ApiError(401, 'Un-authorized handshake. Token is invalid')
      console.log("Un-authorized handshake. Token is invalid");
    }
    socket.user = user._id; // mount te user object to the socket

    const roomId = user._id.toString();
    socket.join(roomId);
    socket.emit('connected'); // emit the connected event so that client is aware
    console.log("User connected Id: ", user._id.toString());

    // mountJoinChatEvent(socket);
    // mountParticipantTypingEvent(socket)
    // mountParticipantStoppedTypingEvent(socket)

    socket.on('disconnect', () => {
      console.log("user has disconnected 🚫. userId: " + socket.user?._id);
      if (socket.user?._id) {
        socket.leave(socket.user._id);
      }
    });

    socket.on("JOIN_CHAT", ({ chatId }) => {
      socket.join(chatId);
      console.log(user._id.toString(), " joined room: ", chatId);
    });

    socket.on("LEAVE_CHAT", ({ chatId }) => {
      socket.leave(chatId);
      console.log(user._id.toString(), " left room: ", chatId);
    });

    socket.on("SEND_MESSAGE", ({ chatId, content }) => {
      socket.to(chatId).emit("GET_MESSAGE", content);
    });

    socket.on("LEAVE_VIDEO", ({ roomId, senderId }) => {
      socket.to(senderId).emit("VIDEO_CALL_CANCELLED", roomId);
    });

    socket.onAny((eventName, (...args)=>{
      console.log('event: ', eventName)
    }))

  } catch (error) {
    socket.emit(
      'socketError',
      error?.message || "Something went wrong while connecting to the socket."
    );
  }
});
// app.use(logger('dev'))
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/webhook", webhookRouter);

app.use(express.json());
app.use("/api", usersRouter);
app.use("/api", courseRouter);
app.use("/api", categoryRouter);
app.use("/api", chapterRouter);
app.use("/api", segmentRouter);
app.use("/api/admin", adminRouter);
app.use("/api", enrollmentRouter);
app.use("/api", wishlistRouter);
app.use("/api", chatRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log("route not found");
  res
    .status(404)
    .json({ message: "The resource you have been requesting not found" });
});

// Middleware For Error Handling
app.use(errorHandler);

module.exports = httpServer;
