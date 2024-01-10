import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  User,
  Avatar,
  Spacer,
} from "@nextui-org/react";
import { useSelector } from "react-redux";
import { QueryClient, useQuery } from "react-query";
import { getChatsTeacher, getChatsUser } from "@/api/chat";
import ChatWindow from "./ChatWindow";
import io from "socket.io-client";
import toast from "react-hot-toast";

export default function Chat() {
  const { teacher: user } = useSelector((state) => state.teacher);
  const [chat, setChat] = useState(null);
  const [socket, setSocket] = useState();
  const queryClient = new QueryClient();
  const {
    data: chats,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["chats", { userId: user?._id }],
    queryFn: () => getChatsTeacher({ page: 1, limit: 10 }),
    keepPreviousData: true,
    enabled: !!user,
  });
  useEffect(() => {
    if (!user) return;
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL, {
      withCredentials: true,
      auth: {
        token: user?.accessToken || "error",
      },
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionAttempts: Infinity,
      transports: ["websocket"],
    });
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [user]);

  useEffect(() => {
    if (!socket) return;
    socket?.on("connected", () => {
      console.log("soc connectd");
    });
    socket?.on("NEW_MESSAGE", (data) => {
      refetch()
    });
  }, [socket]);

  return (
    <Popover showArrow placement="bottom" backdrop="blur">
      <PopoverTrigger>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-message-square-text"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M13 8H7" />
          <path d="M17 12H7" />
        </svg>
      </PopoverTrigger>
      <PopoverContent className="p-1">
        <div className="w-72 h-80 p-2">
          {chat == null ? (
            <>
              <p className="text-lg font-semibold">Chat</p>
              <Spacer y={2} />
              <div className="flex flex-col gap-3">
                {chats?.map((chat, index) => (
                  <div
                    key={index}
                    className="flex gap-2 h-16 items-center hover:bg-default-200 rounded-lg p-2 px-3 cursor-pointer w-full"
                    onClick={() => {
                      setChat(chat);
                      // if (chat?.unreadCount > 0)
                      //   mutateMarkAsRead({ role, chatId: chat._id });
                    }}
                  >
                    <Avatar
                      size="md"
                      src={chat?.sender[0]?.user?.profileImage}
                      className="w-10 overflow-hidden"
                    />
                    <div className="flex flex-col ">
                      <div className="flex flex-col items-start gap-1">
                        <p className="text-sm font-normal">
                          {chat?.sender[0]?.user?.name}
                        </p>
                        <p className="text-tiny">
                          {chat?.lastMessage?.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <ChatWindow chat={chat} setChat={setChat} socket={socket} />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
