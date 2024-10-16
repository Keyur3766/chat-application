"use client";
import Input from "@/components/input";
import ChatItem from "@/components/Chat/ChatItem";
import { classNames, requestHandler } from "@/utils";
import { PaperAirplaneIcon, PaperClipIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import AddChatModal from "@/components/Chat/AddChatModel";
import { useAuth } from "@/context/AuthContext";

export default function Chat() {
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [openAddChat, setOpenAddChat] = useState(false); 

    const { logout } = useAuth();

    const getChats = async () => {
      // requestHandler(
      //   async () => await getUserChats(),
      //   () => {},
      //   (res) => {
      //     const { data } = res;
      //     setChats(data || []);
      //   },
      //   alert
      // );
    };
  return (
    <div>
    <AddChatModal
      open={openAddChat}
      onClose={() => {
        setOpenAddChat(false);
      }}
      onSuccess={() => {
        console.warn("success");
        // getChats();
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
    
        <ChatItem
            isActive={true}
            unreadCount= {0}
        />
      </div>
      <div className="w-2/3 border-l-[0.1px] border-secondary">
         </div>
    </div>
    </div>
  );
}
