import { UserInterface } from "./userInterface";


export interface ChatListItemInterface {
  admin: string;
  createdAt: string;
  // isGroupChat: true;
  lastMessage?: ChatMessageInterface;
  // name: string;
  participants: UserInterface[];
  updatedAt: string;
  _id: string;
}

export interface ChatMessageInterface {
  _id: string;
  sender: Pick<UserInterface, "_id" | "username" | "email">;
  content: string;
  chat: string;
  // attachments: {
  //   url: string;
  //   localPath: string;
  //   _id: string;
  // }[];
  createdAt: string;
  updatedAt: string;
}
