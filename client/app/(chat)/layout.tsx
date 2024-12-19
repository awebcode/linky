import React from "react";
interface Props {
  children: React.ReactNode;
}
const ChatLayout: React.FC<Props> = ({ children }) => {
  return <div> chat layout {children}</div>;
};

export default ChatLayout;
