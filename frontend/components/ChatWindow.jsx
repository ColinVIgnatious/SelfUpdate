"use client";

import { createChatMessage, getMessages, makeReaction } from "@/api/chat";
import {
  Avatar,
  Button,
  Input,
  Skeleton,
  Spinner,
  Tooltip,
} from "@nextui-org/react";
import { Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
// import { useSocket } from "@/providers/SocketProvider";

export default function ChatWindow({ chat, setChat, socket }) {
  const { user } = useSelector((state) => state.user);
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(10);
  const queryClient = useQueryClient();
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0 rounded-none";
  //   const socket = useSocket();
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatRef = useRef(null);
  const [attachmentType, setAttachmentType] = useState("text");
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    inputRef.current.focus();
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
    return () => {
      socket?.emit("LEAVE_CHAT", { chatId: chat?._id });
    };
  }, []);

  const getLiveMessages = () => {
    if (!chat) return;
    if (!socket) return;
    socket.emit("JOIN_CHAT", { chatId: chat?._id });
    socket.on("GET_MESSAGE", () => {
      queryClient.invalidateQueries(["messages", { chatId: chat?._id }]);
      queryClient.invalidateQueries(["chats", user?._id]);
    });
  };

  useEffect(() => {
    getLiveMessages();
  }, [socket]);

  const {
    data: messages,
    isPending,
    isError,
    isRefetching,
  } = useQuery({
    queryKey: ["messages", { chatId: chat?._id, page: 1, limit: count }],
    queryFn: () => getMessages({ chatId: chat?._id, page: 1, limit: count }),
    keepPreviousData: true,
    enabled: true,
    staleTime: Infinity,
  });

  const { isLoading: isLoadingSendMessage, mutate: mutateSendMessage } =
    useMutation({
      mutationFn: createChatMessage,
      onSuccess: () => {
        setMessage("");
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
        setAttachmentType("text");
        queryClient.invalidateQueries(["messages", { chatId: chat?._id }]);
      },
      onError: (error) => {
        toast.error(
          error?.response?.data?.message ||
            error?.response?.data?.errors?.toast ||
            "Something went wrong"
        );
      },
    });

  const handleSendMessage = () => {
    // mutateMarkAsRead({ role, chatId: chat?._id });
    if (!message || !message.trim()) return;
    mutateSendMessage({ chatId: chat?._id, content: message });
    // if (!socket) return toast.error('Socket not connected')
    // socket.emit('SEND_MESSAGE', { chatId: chat?._id, content: message })
  };
  const {  mutate: mutateSendReaction } =
  useMutation({
    mutationFn: makeReaction,
    onSuccess: () => {
      
      queryClient.invalidateQueries(["messages", { chatId: chat?._id }]);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.errors?.toast ||
          "Something went wrong"
      );
    },
  });
  const emojis = ["✌️", "❤️", "😎", "😊", "👍", "😘"];
  const handleReaction = (id, item) => {
    mutateSendReaction({role:"user",chatId:chat._id,id,item})
  };
  if (!chat) return null;

  return (
    <>
      <div className="flex items-center gap-3 cursor-pointer">
        <div onClick={() => setChat(null)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-arrow-left"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
        </div>
        <Avatar
          size="sm"
          className="w-8 h-8"
          src={chat.sender[0]?.user?.profileImage}
        />
        <p className="text-md font-medium">{chat?.sender[0]?.user?.name}</p>
      </div>

      <div className="relative py-0 ps-0">
        {isPending && <Spinner className="absolute inset-0" />}
        {isError && <p className="text-center">Error</p>}
        <div
          className="flex gap-2 px-3 h-[225px] flex-col-reverse overflow-auto"
          ref={chatRef}
        >
          {isRefetching && !isLoadingSendMessage && (
            <div>
              <Skeleton className="w-[80px] h-10 bg-default-50" />
            </div>
          )}
          {messages?.map((message, index) => (
            <div
              key={index}
              className={
                message.sender === user._id
                  ? "self-end bg-default-100 max-w-[90%] min-w-[80px] rounded-lg"
                  : "self-start bg-default-100 max-w-[90%] min-w-[80px] rounded-lg"
              }
            >
              {message?.attachmentType === "text" && (
                <Tooltip
                  content={
                    <div className="flex gap-2 text-md p-2">
                      {emojis.map((item, index) => {
                        return (
                          <span
                            key={index}
                            className="cursor-pointer"
                            onClick={() => handleReaction(message._id, item)}
                          >
                            {item}
                          </span>
                        );
                      })}
                    </div>
                  }
                >
                  <span className="block text-sm text-left px-2 py-1">
                    {message.content}
                  </span>
                </Tooltip>
              )}
<div className="flex justify-between">
  <span>{message?.reaction || ""}</span>
              <span className="block text-[10px] text-default-500 text-right pe-2 py-1">
                {new Date(message.createdAt).toLocaleTimeString("en-IN", {
                  hour: "numeric",
                  minute: "numeric",
                })}
              </span>
              </div>
            </div>
          ))}

          {!isPending && (
            <div className="flex items-center gap-2 justify-center mt-1">
              {isRefetching && <Spinner size="sm" />}
              <span
                className="text-center cursor-pointer hover:text-default-800 text-default-500 p-2 select-none border rounded-lg"
                onClick={() => {
                  setCount((prev) => prev + 10);
                }}
              >
                Load more
              </span>
            </div>
          )}
        </div>
      </div>
      <div>
        <div className="flex justify-between gap-3 h-10 w-full py-0 mt-2">
          <Input
            label=""
            variant="flat"
            classNames={{
              inputWrapper: "text-default-500 h-full",
            }}
            onChange={(e) => setMessage(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
            ref={inputRef}
            value={message}
            size="md"
            className="flex-grow h-10"
          />
          <Button
            isLoading={isLoadingSendMessage}
            isDisabled={
              isPending || isLoadingSendMessage || !message || !message.trim()
            }
            isIconOnly
            className="h-10"
            color="primary"
            variant="flat"
            onClick={handleSendMessage}
          >
            <Send />
          </Button>
        </div>
      </div>
    </>
  );
}
