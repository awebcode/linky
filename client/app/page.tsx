"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNetworkStatus } from "@/hooks/use-online";
import { useSocket } from "@/hooks/use-socket";
import React, { useEffect } from "react";

interface Message {
  sender: string;
  message: string;
}

const ChatApp = () => {
  const socket = useSocket();
  const isOnline = useNetworkStatus();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [name, setName] = React.useState("");
  const [message, setMessage] = React.useState("");

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  }, []);

  const sendMessage = () => {
    if (name && message) {
      socket.emit("message", { sender: name, message });
      setMessage(""); // Clear the input field after sending
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h2 className="text-emerald-400">
        {isOnline ? "You are online"   : "You are offline"}
      </h2>
      ;
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6">
        <h1 className="text-xl font-bold text-center mb-4">Chat Application</h1>

        <div className="mb-4">
          <Input
            placeholder="Enter your name"
            className="mb-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Enter your message"
            className="mb-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <Button className="w-full" onClick={sendMessage}>
            Send Message
          </Button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-inner max-h-96 overflow-y-auto">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col mb-4 p-3 rounded-lg ${
                  msg.sender === name ? "bg-blue-100 self-end" : "bg-gray-100"
                }`}
              >
                <span className="font-medium text-gray-800">
                  {msg.sender === name ? "You" : msg.sender}
                </span>
                <span className="text-gray-600">{msg.message}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No messages yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
