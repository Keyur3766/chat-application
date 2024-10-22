"use client"
import {
    ArrowDownTrayIcon,
    EllipsisVerticalIcon,
    MagnifyingGlassPlusIcon,
    PaperClipIcon,
    TrashIcon,
    XMarkIcon,
  } from "@heroicons/react/20/solid";
  import moment from "moment";
  import { useState } from "react";
  import { classNames } from "../../utils";
import { ChatMessageInterface } from "@/interface/chatInterface";
  const MessageItem: React.FC<{
    isOwnMessage?: boolean;
    isGroupChatMessage?: boolean;
    message: ChatMessageInterface;
    deleteChatMessage: (message: ChatMessageInterface) => void;
  }> = ({ message, isOwnMessage, isGroupChatMessage, deleteChatMessage }) => {
    const [resizedImage, setResizedImage] = useState<string | null>(null);
    const [openOptions, setopenOptions] = useState<boolean>(false); //To open delete menu option on hover
  
    return (
      <>
      
        {resizedImage ? (
          <div className="h-full z-40 p-8 overflow-hidden w-full absolute inset-0 bg-black/70 flex justify-center items-center">
            <XMarkIcon
              className="absolute top-5 right-5 w-9 h-9 text-white cursor-pointer"
              onClick={() => setResizedImage(null)}
            />
            <img
              className="w-full h-full object-contain"
              src={resizedImage}
              alt="chat image"
            />
          </div>
        ) : null}
        <div
          className={classNames(
            "flex justify-start items-end gap-3 max-w-lg min-w-",
            isOwnMessage ? "ml-auto" : ""
          )}
        >
          <img
            src="https://avatar.iran.liara.run/public/boy"
            className={classNames(
              "h-7 w-7 object-cover rounded-full flex flex-shrink-0",
              isOwnMessage ? "order-2" : "order-1"
            )}
          />
          {/* message box have to add the icon onhover here */}
          <div
            onMouseLeave={() => setopenOptions(false)}
            className={classNames(
              " p-4 rounded-3xl flex flex-col cursor-pointer group hover:bg-secondary",
              isOwnMessage
                ? "order-1 rounded-br-none bg-primary"
                : "order-2 rounded-bl-none bg-secondary"
            )}
          >
            {isGroupChatMessage && !isOwnMessage ? (
              <p
                className={classNames(
                  "text-xs font-semibold mb-2",
                  ["text-success", "text-danger"][
                    message.sender.username.length % 2
                  ]
                )}
              >
                {message.sender?.username}
              </p>
            ) : null}
            {message.content ? (
              <div className="relative flex justify-between">
                {/*The option to delete message will only open in case of own messages*/}
                {isOwnMessage ? (
                  <button
                    className="self-center relative options-button"
                    onClick={() => setopenOptions(!openOptions)}
                  >
                    <EllipsisVerticalIcon className="group-hover:w-4 group-hover:opacity-100 w-0 opacity-0 transition-all ease-in-out duration-100 text-zinc-300" />
                    <div
                      className={classNames(
                        "delete-menu z-20 text-left -translate-x-24 -translate-y-4 absolute botom-0  text-[10px] w-auto bg-dark rounded-2xl  shadow-md border-[1px] border-secondary",
                        openOptions ? "block" : "hidden"
                      )}
                    >
                      <p
                        onClick={(e) => {
                          e.stopPropagation();
                          const ok = confirm(
                            "Are you sure you want to delete this message"
                          );
                          if (ok) {
                            deleteChatMessage(message);
                          }
                        }}
                        role="button"
                        className=" p-2 text-danger rounded-lg w-auto inline-flex items-center hover:bg-secondary"
                      >
                        <TrashIcon className="h-4 w-auto mr-1" />
                        Delete Message
                      </p>
                    </div>
                  </button>
                ) : null}
  
                <p className="text-sm">{message.content}</p>
              </div>
            ) : null}
            <p
              className={classNames(
                "mt-1.5 self-end text-[10px] inline-flex items-center",
                isOwnMessage ? "text-zinc-50" : "text-zinc-400"
              )}
            >
              {moment(message.updatedAt).add("TIME_ZONE", "hours").fromNow(true)}{" "}
              ago
            </p>
          </div>
        </div>
      </>
    );
  };
  
  export default MessageItem;
  