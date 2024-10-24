"use client"
import { useAuth } from "@/context/AuthContext";
import { ChatListItemInterface } from "@/interface/chatInterface";
import { classNames, getChatObjectMetadata } from "@/utils";
import {
    EllipsisVerticalIcon,
    PaperClipIcon,
    TrashIcon,
  } from "@heroicons/react/20/solid";
import moment from "moment";
import { useState } from "react";

const ChatItem: React.FC<{
    isActive: boolean,
    unreadCount: number,
    chat: ChatListItemInterface,
    onClick: (chat: ChatListItemInterface) => void
}> = ({isActive, unreadCount = 0, chat, onClick}) => {
    const { userId } = useAuth();
    const [openOptions, setOpenOptions] = useState(false);
    return (

        <div
        role="button"
        onClick={() => onClick(chat)}
        onMouseLeave={() => setOpenOptions(false)}
        className={classNames(
          "group p-4 my-2 flex justify-between gap-3 items-start cursor-pointer rounded-3xl hover:bg-secondary",
          isActive ? "border-[1px] border-zinc-500 bg-secondary" : "",
          unreadCount > 0
            ? "border-[1px] border-success bg-success/20 font-bold"
            : ""
        )}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenOptions(!openOptions);
          }}
          className="self-center p-1 relative"
        >
          <EllipsisVerticalIcon className="h-6 group-hover:w-6 group-hover:opacity-100 w-0 opacity-0 transition-all ease-in-out duration-100 text-zinc-300" />
          <div
            className={classNames(
              "z-20 text-left absolute bottom-0 translate-y-full text-sm w-52 bg-dark rounded-2xl p-2 shadow-md border-[1px] border-secondary",
              openOptions ? "block" : "hidden"
            )}
          >
            
            <p
            onClick={(e) => {
              e.stopPropagation();
              const ok = confirm(
                "Are you sure you want to delete this chat?"
              );
              if (ok) {
                // deleteChat();
              }
            }}
            role="button"
            className="p-4 text-danger rounded-lg w-full inline-flex items-center hover:bg-secondary"
            >
            <TrashIcon className="h-4 w-4 mr-2" />
            Delete chat
            </p>
        
          </div>
        </button>
        <div className="flex justify-center items-center flex-shrink-0">
          {/* {chat.isGroupChat ? ( */}
            <img
              src={getChatObjectMetadata(chat, userId!).avatar}
              className="w-12 h-12 rounded-full"
            />
        </div>
        <div className="w-full">
          <p className="truncate-1">
            {getChatObjectMetadata(chat, userId!).title}
          </p>
          <div className="w-full inline-flex items-center text-left">
            {/* {chat.lastMessage && chat.lastMessage.attachments.length > 0 ? (
              // If last message is an attachment show paperclip
              <PaperClipIcon className="text-white/50 h-3 w-3 mr-2 flex flex-shrink-0" />
            ) : null} */}
            {/* <PaperClipIcon className="text-black/50 h-3 w-3 mr-2 flex flex-shrink-0" /> */}
            <small className="text-black/50 truncate-1 text-sm text-ellipsis inline-flex items-center">
              {getChatObjectMetadata(chat, userId!).lastMessage}
            </small>
          </div>
        </div>
        <div className="flex text-black/50 h-full text-sm flex-col justify-between items-end">
          <small className="mb-2 inline-flex flex-shrink-0 w-max">
            {moment(chat.updatedAt).add("TIME_ZONE", "hours").fromNow(true)}
          </small>

          {/* Unread count will be > 0 when user is on another chat and there is new message in a chat which is not currently active on user's screen */}
          {unreadCount <= 0 ? null : ( 
            <span className="bg-success h-2 w-2 aspect-square flex-shrink-0 p-2 text-black text-xs rounded-full inline-flex justify-center items-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )} 
        </div>
      </div>
    );
}


export default ChatItem;