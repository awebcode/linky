import React, { useState, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
const EmojiInput = () => {
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLDivElement>(null);

  const toggleEmojiPicker = () => {
    setEmojiPickerVisible((prev) => !prev);
  };

  const handleEmojiClick = (event: any, emojiObject: any) => {
    const emoji = emojiObject.emoji;
    const newValue = inputValue + emoji;
    setInputValue(newValue);
    setEmojiPickerVisible(false);
  };

  const handleInputChange = (event: React.FormEvent<HTMLDivElement>) => {
    if (inputRef.current) {
      setInputValue(inputRef.current.innerText);
    }
  };

  return (
    <div className="relative">
      <div
        ref={inputRef}
        contentEditable
        className="border p-2 rounded-lg min-h-[50px] w-full"
        onInput={handleInputChange}
        placeholder="Type something..."
      >
        {inputValue}
      </div>

      <button
        onClick={toggleEmojiPicker}
        className="mt-2 p-2 border rounded-lg bg-gray-200"
      >
        😊
      </button>

      {emojiPickerVisible && (
        <div className="absolute bottom-12 left-0">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default EmojiInput;
