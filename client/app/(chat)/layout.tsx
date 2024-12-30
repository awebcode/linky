// import ChatMainLayout from "./ChatMainLayout";
import ChatLayoutDynamic from "./ChatLayoutDynamic";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ChatLayoutDynamic>{children}</ChatLayoutDynamic>
    </>
  );
}
