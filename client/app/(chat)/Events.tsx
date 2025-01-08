"use client";
import useMessageCallbacks from "./socket-callbacks/message.callbacks";
import useTypingCallbacks from "./socket-callbacks/typing.callbacks";
import useUserCallbacks from "./socket-callbacks/user.callbacks";

/**
 * Global Socket events handler for the app
 */
const Events = () => {
  // Handling online/offline etc events
  useUserCallbacks()
  //  Handling Message Typing Events
  useTypingCallbacks()
  // Handling  Message Events
  useMessageCallbacks()
  return null
};

export default Events;
