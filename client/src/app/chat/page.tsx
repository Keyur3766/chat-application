"use client";
import Input from "@/components/input";
import ChatItem from "@/components/Chat/ChatItem";
import { classNames, getChatObjectMetadata, requestHandler } from "@/utils";
import { PaperAirplaneIcon, PaperClipIcon } from "@heroicons/react/16/solid";
import { useEffect, useRef, useState } from "react";
import AddChatModal from "@/components/Chat/AddChatModel";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import { ChatListItemInterface, ChatMessageInterface } from "@/interface/chatInterface";
import Userservices from '@/services/index';
import MessageItem from "@/components/Chat/MessageItem";

export default function Chat() {
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [openAddChat, setOpenAddChat] = useState(false); 
    const [isConnected, setConnected] = useState(false); 
    const currentChat = useRef<ChatListItemInterface | null>(null);
    const [message, setMessage] = useState("");
    const [chats, setChats] = useState<ChatListItemInterface[]>([]);
    const [messages, setMessages] = useState<ChatMessageInterface[]>([]); 
    const [unreadMessages, setUnreadMessages] = useState<ChatMessageInterface[]>([]); 

    const { logout, user, userId } = useAuth();
    const CONNECTED_EVENT = "connected";
    const DISCONNECT_EVENT = "disconnect";
    const JOIN_CHAT_EVENT = "joinChat";
    const NEW_CHAT_EVENT = "newChat";
    const TYPING_EVENT = "typing";
    const STOP_TYPING_EVENT = "stopTyping";
    const MESSAGE_RECEIVED_EVENT = "messageReceived";
    const LEAVE_CHAT_EVENT = "leaveChat";
    const UPDATE_GROUP_NAME_EVENT = "updateGroupName";
    const MESSAGE_DELETE_EVENT = "messageDeleted";
    const UPDATE_UNREAD_MESSAGE = "UpdateUnreadMessage";

    const { socket } = useSocket();

    const getunreadMessages = async() => {
      requestHandler(
        async () => await Userservices.getUnreadMessages(),
        null,
        (res) => {
          const { data } = res;

          setUnreadMessages(data);
        },
        alert
      );
    }

    const getChats = async () => {
      requestHandler(
        async () => await Userservices.getChats(),
        null,
        (res) => {
          const { data } = res;

          setChats(data);

          getunreadMessages();
        },
        alert
      );
    };


    const getMessages = async() => {
      // Emit the event in the roomId: chatId
      // 1. Typing event 2. unreadMessages Event
      if(!currentChat.current?._id) return alert("No chat is selected");;

      // if(!socket) return alert("socket not available");

      socket?.emit(JOIN_CHAT_EVENT, currentChat.current?._id.toString());

      // Get the messages from the corresponding chatId
      requestHandler(
        async () => await Userservices.getMessages(currentChat.current?._id || ""),
        null,
        (res) => {
          const {data} = res;
          setMessages(data || []);
        },
        alert
      );
    }

    const updateLastChatMessage = async(chatToUpdateId: string, message: ChatMessageInterface) => {
      const chatToUpdate = chats.find((chat)=> chat._id===chatToUpdateId)!;

      chatToUpdate.lastMessage = message;

      chatToUpdate.updatedAt = message?.updatedAt;

      setChats([
        chatToUpdate,
        ...chats.filter((chat) => chat._id !== chatToUpdateId)
      ]);

    }

    const sendChatMessage = () => {
      if (!currentChat.current?._id || !socket) return;

        // Emit event for sending the data(i.e. typing event).

        // store the data to MongoDB
        requestHandler(
          async () => await Userservices.sendMessages(currentChat.current?._id || "", message),
          null,
          (res) => {
            setMessage("");
            setMessages((prev)=>[res.data, ...prev]);
            updateLastChatMessage(currentChat.current?._id || "", res.data);
          },
          alert
        );
    }

    const markMessagetoRead = (messageId: string) => {
      requestHandler(
        async () => await Userservices.markMessageRead(messageId || ""),
        null,
        (res) => {
          if(res.data){
            console.log("message marked as read");
          }
        },
        alert
      );
    }

    const handleOnMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setMessage(e.target.value);
    }

    useEffect(() => {
      if(!socket) return;
      socket.on(CONNECTED_EVENT, OnConnect);
      socket.on(DISCONNECT_EVENT, OnDisconnect);
      socket.on(NEW_CHAT_EVENT, OnNewChat);
      socket.on(MESSAGE_RECEIVED_EVENT, OnMessageReceived);
      socket.on(UPDATE_UNREAD_MESSAGE, OnUpdateUnreadMessage);


      return () => {
        socket.off(CONNECTED_EVENT, OnConnect);
        socket.off(DISCONNECT_EVENT, OnDisconnect);
        socket.off(NEW_CHAT_EVENT, OnNewChat);
        socket.off(MESSAGE_RECEIVED_EVENT, OnMessageReceived);
        socket.off(UPDATE_UNREAD_MESSAGE, OnUpdateUnreadMessage);
      }
    }, [socket, chats]);

    useEffect(() => {
      getChats();

      /* Get all the messages from the chat */
      const _currentChat = localStorage.getItem("currentChat");
      
      if(_currentChat) {
        currentChat.current = JSON.parse(_currentChat);

        socket?.emit(JOIN_CHAT_EVENT, currentChat.current?._id.toString());

        getMessages();
      }
      
    }, [])



    const OnConnect = () => {
      setConnected(true);
    }
    const OnDisconnect = () => {
      setConnected(false);
    }
    const OnNewChat = (chatItem: ChatListItemInterface) => {
      setChats((prev) => [chatItem, ...prev]);
    }

    const OnMessageReceived = (message: ChatMessageInterface) => {
      if(message.chat === currentChat.current?._id){
        setMessages((prev) => [message, ...prev]);
        
        markMessagetoRead(message._id);
      }
      else{
        setUnreadMessages((prev) => [message, ...prev]);
      }
      updateLastChatMessage(message.chat || "", message);
    }

    const OnUpdateUnreadMessage = (chatId: string) => {
      setUnreadMessages([...unreadMessages.filter((x) => x.chat !== chatId)]);
    }
  return (
    <div>
      <AddChatModal
        open={openAddChat}
        onClose={() => {
          setOpenAddChat(false);
        }}
        onSuccess={() => {
          console.warn("success");
          getChats();
        }}
      />

      <div className="w-full justify-between items-stretch h-screen flex flex-shrink-0">
        <div className="w-1/3 relative ring-white overflow-y-auto px-4">
          <div className="z-10 w-full sticky top-0 bg-dark py-4 flex justify-between items-center gap-4">
            <button
              type="button"
              className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-xl text-sm px-5 py-4 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 flex-shrink-0"
              onClick={logout}
            >
              Log Out
            </button>

            <Input
              placeholder="Search user or group..."
              // value={localSearchQuery}
              // onChange={(e) => setLocalSearchQuery(e.target.value.toLowerCase())}
            />
            <button
              onClick={() => setOpenAddChat(true)}
              className="rounded-xl border-none bg-primary text-white py-4 px-5 flex flex-shrink-0"
            >
              + Add chat
            </button>
          </div>

          {chats.map((chat, index) => {
            return <ChatItem 
              key={index} 
              isActive={true} 
              unreadCount={
                unreadMessages.filter((x) => x.chat === chat._id).length
              }
              chat={chat}
              onClick = {(chat) => {
                if(currentChat.current?._id && currentChat.current?._id === chat._id){
                  return;
                }
                localStorage.setItem("currentChat", JSON.stringify(chat));
                currentChat.current = chat;
                setMessage("");
                getMessages();
              }}  />;
          })}
        </div>
        <div className="w-2/3 border-l-[0.1px] border-secondary">
          {currentChat.current && currentChat.current?._id ? (
            <>
              <div className="p-4 sticky top-0 bg-dark z-20 flex justify-between items-center w-full border-b-[0.1px] border-secondary">
                <div className="flex justify-start items-center w-max gap-3">
                  <img
                    className="h-14 w-14 rounded-full flex flex-shrink-0 object-cover"
                    src={
                      getChatObjectMetadata(currentChat.current, userId!).avatar
                    }
                  />
                  <div>
                    <p className="font-bold">
                      {getChatObjectMetadata(currentChat.current, userId!).title}
                    </p>
                    <small className="text-zinc-400">
                      {
                        getChatObjectMetadata(currentChat.current, userId!)
                          .description
                      }
                    </small>
                  </div>
                </div>
              </div>
              <div
                className={classNames(
                  "p-8 overflow-y-auto flex flex-col-reverse gap-6 w-full",
                  // attachedFiles.length > 0
                    // ? "h-[calc(100vh-336px)]"
                    "h-[calc(100vh-176px)]"
                )}
                id="message-window"
              >
                {/* {loadingMessages ? (
                  <div className="flex justify-center items-center h-[calc(100%-88px)]">
                    <Typing />
                  </div>
                ) : ( */}

                    {/* {isTyping ? <Typing /> : null} */}
                    {messages?.map((msg) => {
                      
                      return (
                        <MessageItem
                          key={msg._id}
                          isOwnMessage={msg.sender?._id === userId}
                          isGroupChatMessage={false}
                          message={msg}
                          deleteChatMessage={() => "Implement deleting the chat"}
                        />
                      );
                    })}

                
              </div>
              <div className="sticky top-full p-4 flex justify-between items-center w-full gap-2 border-t-[0.1px] border-secondary">
                {/* <input
                  hidden
                  id="attachments"
                  type="file"
                  value=""
                  multiple
                  max={5}
                  onChange={(e) => {
                    if (e.target.files) {
                      setAttachedFiles([...e.target.files]);
                    }
                  }}
                /> */}
                <label
                  htmlFor="attachments"
                  className="p-4 rounded-full bg-dark hover:bg-secondary"
                >
                  <PaperClipIcon className="w-6 h-6" />
                </label>

                <Input
                  placeholder="Message"
                  value={message}
                  onChange={handleOnMessageChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendChatMessage();
                    }
                  }}
                />
                <button
                  onClick={sendChatMessage}
                  disabled={!message}
                  className="p-4 rounded-full bg-dark hover:bg-secondary disabled:opacity-50"
                >
                  <PaperAirplaneIcon className="w-6 h-6" />
                </button>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              No chat selected
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
