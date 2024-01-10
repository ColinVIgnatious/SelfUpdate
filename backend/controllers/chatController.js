const mongoose = require("mongoose");
const Chat = require("../models/Chat");
const ChatMessage = require("../models/ChatMessage");

module.exports = {
  // Get chat with ID
  getChat: async (req, res, next) => {
    try {
      const chat = await Chat.findById(req.params.chatId)
        .populate("participants")
        .populate({
          path: "lastMessage",
          populate: {
            path: "sender",
          },
        });
      if (!chat)
        return res
          .status(404)
          .json({ success: false, message: "Chat not found" });

      res.status(200).json({ success: true, chat });
    } catch (error) {
      next(error);
    }
  },

  // Get chats of user
  getChats: async (req, res, next) => {
    try {
      let chats = await Chat.find({ "participants.user": req.user._id })
        .populate("participants.user", "name profileImage")
        .populate("lastMessage")
        .sort({ "lastMessage.createdAt": -1 })
        .skip(0)
        .limit(30)
        .lean();

      chats = chats.map((chat) => {
        const sender = chat.participants.filter(
          (participant) =>
            participant.user._id.toString() !== req.user._id.toString()
        );
        const unreadCount = chat.participants.find(
          (participant) =>
            participant.user._id.toString() === req.user._id.toString()
        ).unreadCount;

        delete chat.participants;
        chat.sender = sender;
        chat.unreadCount = unreadCount;
        return chat;
      });

      res.status(200).json({ success: true, chats });
    } catch (error) {
      next(error);
    }
  },

  // Create a chat
  createChat: async (req, res, next) => {
    try {
      const { receiver } = req.body;
      const userId = new mongoose.Types.ObjectId(req.user._id);
      const receiverId = new mongoose.Types.ObjectId(receiver);

      let chat = await Chat.findOne({
        participants: {
          $all: [
            { $elemMatch: { user: userId } },
            { $elemMatch: { user: receiverId } },
          ],
        },
      })
        .populate("participants.user", "name profileImage")
        .lean();

      if (!chat)
        chat = await Chat.create({
          participants: [{ user: userId }, { user: receiverId }],
        });

      chat = await Chat.findById(chat._id)
        .populate("participants.user", "name profileImage")
        .lean();

      const sender = chat.participants.filter(
        (participant) =>
          participant.user._id.toString() !== req.user._id.toString()
      );
      const unreadCount = chat.participants.find(
        (participant) =>
          participant.user._id.toString() === req.user._id.toString()
      ).unreadCount;

      delete chat.participants;
      chat.sender = sender;
      chat.unreadCount = unreadCount;

      res.status(201).json({ success: true, chat });
    } catch (error) {
      next(error);
    }
  },

  // Create a chat message
  createChatMessage: async (req, res, next) => {
    try {
      let { content, attachmentType } = req.body;

      const chat = await Chat.findById(req.params.chatId);
      if (!chat)
        return res
          .status(404)
          .json({ success: false, message: "Chat not found" });

      if (!content)
        return res.status(400).json({
          success: false,
          message: "Content or attachment is missing",
        });

      const chatMessage = await ChatMessage.create({
        chat: chat._id,
        sender: req.user._id,
        content,
        attachment: null,
        attachmentType: attachmentType || "text",
      });

      chat.lastMessage = chatMessage._id;
      let receiver = null;
      chat.participants.forEach((participant) => {
        if (participant.user.toString() !== req.user._id.toString()) {
          receiver = participant.user.toString();
          participant.unreadCount += 1;
        }
      });

      await chat.save();

      //  Emit socket event
      req.app
        .get("io")
        .in(chat._id.toString())
        .emit("GET_MESSAGE", chatMessage);
      req.app.get("io").in(receiver).emit("NEW_MESSAGE", chatMessage);

      res.status(201).json({ success: true, chatMessage });
    } catch (error) {
      next(error);
    }
  },

  // Mark chat as read
  markChatRead: async (req, res, next) => {
    try {
      const chat = await Chat.findByIdAndUpdate(
        req.params.chatId,
        { $set: { "participants.$[elem].unreadCount": 0 } },
        { arrayFilters: [{ "elem.user": req.user._id }] }
      );
      res.status(200).json({ success: true, chat });
    } catch (error) {
      next(error);
    }
  },

  // Get chat messages
  getMessages: async (req, res, next) => {
    try {
      const chat = await Chat.findById(req.params.chatId);
      if (!chat)
        return res
          .status(404)
          .json({ success: false, message: "Chat not found" });
      const page = req.query.page || 1;
      const limit = req.query.limit || 20;
      const chatMessages = await ChatMessage.find({ chat: req.params.chatId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      res.status(200).json({ success: true, chatMessages });
    } catch (error) {
      next(error);
    }
  },

  // makereaction
  makeReaction: async (req, res, next) => {
    try {
      const { id, item: emoji } = req.body;

      const chat = await ChatMessage.findByIdAndUpdate(id, { reaction: emoji });
      res.status(200).json({ success: true, chat });
      req.app
        .get("io")
        .in(req.params.chatId)
        .emit("GET_MESSAGE", chat);
    } catch (error) {
      next(error);
    }
  },
};
