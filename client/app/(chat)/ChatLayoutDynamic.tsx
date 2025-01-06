// import ChatMainLayout from "./ChatMainLayout";
"use client";
import dynamic from "next/dynamic";
import Queries from "./Queries";
const Events = dynamic(() => import("./Events"), { ssr: false });
const ChatMainLayout = dynamic(() => import("./ChatMainLayout"), { ssr: false });
export default function ChatLayoutDynamic({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ChatMainLayout>{children} </ChatMainLayout>
      <Events />
      <Queries/>
    </>
  );
}
