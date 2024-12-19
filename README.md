# Linky 

A real-time chat application built with Express.js, Socket.io, and Next.js. This application allows users to send and receive messages instantly, mimicking the behavior of WhatsApp & Messenger.

## Features

- **Real-time Messaging**: 
  - Users can send and receive messages instantly using WebSockets (Socket.io).
  - Supports both direct (one-on-one) and group messaging.
  
- **User Authentication**:
  - Users can sign in and start chatting immediately using JWT (JSON Web Tokens).
  - The app supports user registration, login, and token-based authentication.

- **Responsive UI**:
  - Built with Next.js and Tailwind CSS for a modern, responsive design.
  - UI is mobile-first and adjusts to different screen sizes.

- **Multi-room Support**:
  - Users can join different chat rooms and chat with multiple users simultaneously.
  - Each room (chat) can be a private conversation or a group chat.
  - Users can be part of multiple rooms (chats) at the same time.

- **Client-Server Communication**:
  - The server uses Express.js for API routes and Socket.io for real-time communication.
  - The frontend communicates with the backend via RESTful API and WebSockets for live updates.

- **User Status**:
  - Tracks users' online, offline, and idle status.
  - Status changes are broadcasted in real-time to all users in the same chat room.
  - Users can see who is online, offline, or idle in the chat room.

- **Message Reactions**:
  - Users can react to messages with emojis (e.g., thumbs up, heart, etc.).
  - Reactions are stored in the `Reaction` model and can be accessed by other users in real-time.
  - Each user can only react to a message once.

- **Message Seen Tracking**:
  - Tracks when a user has seen a message.
  - Each user’s read status is tracked via the `MessageSeen` model.
  - Useful for showing read receipts, so users know when their messages have been read.

- **Multi-media Support in Messages**:
  - Messages can have media attachments like images, videos, and audio files.
  - Media files are stored in the `Media` model, linked to messages.
  - Supports file uploads with metadata (e.g., file size, type, URL).

- **Message Status**:
  - Tracks message status (sent, delivered, read).
  - This information is stored in the `MessageStatus` model and is updated in real-time.

- **Chat Admin Management**:
  - Admins can manage chat memberships.
  - Admins can remove users or change roles in a group chat.

- **Message History**:
  - The app supports the history of messages.
  - All messages sent in a chat are stored and can be fetched in order by time.

- **User Roles**:
  - Users can have roles such as **GUEST**, **USER**, and **ADMIN**.
  - Admins have more privileges, such as deleting messages and managing users in the chat.

- **Real-time Notifications**:
  - Users receive notifications for new messages, reactions, or when someone joins/left the chat.
  - Notifications are broadcasted in real-time using Socket.io.

- **Typing Indicator**:
  - Shows when a user is typing a message in real-time.

- **Chat Creation and Management**:
  - Users can create new chats (group or private).
  - Admins have the ability to manage chat settings like names, descriptions, and members.

- **Chat History Search**:
  - Users can search through past messages in a chat.
  - The search function uses the message's content, media, and reactions for filtering.

- **Direct and Group Chats**:
  - Users can send messages in private (direct) or public (group) chats.
  - Group chats can have multiple members, while direct chats involve only two users.

- **Message Deletion**:
  - Users can delete their own messages (within certain time limits).
  - Admins can delete any message in a group chat.

- **Message Forwarding**:
  - Users can forward messages to another chat.
  - Forwarding allows users to share information with others without typing it out.

- **Custom Emojis and Stickers**:
  - Users can send custom emojis or stickers within the chat messages.
  - Emoji reactions can be customized.

These features leverage the following models:
- **User**: User authentication, roles, and status tracking.
- **Chat**: Chat creation, membership management, and history.
- **Message**: Real-time messaging, message content, and attachments.
- **Media**: Media files attached to messages (images, videos, etc.).
- **Reaction**: Emoji reactions to messages.
- **MessageSeen**: Tracks which users have seen each message.
- **MessageStatus**: Tracks the status of messages (sent, delivered, read).
- **ChatMember**: User memberships and roles in chats.

This comprehensive feature set ensures that your application supports all the critical functionalities necessary for a modern real-time chat platform.


## Tech Stack
- **Backend**: Express.js, Socket.io
- **Frontend**: Next.js, React.js, Tailwind CSS
- **Database**: MongoDB (or use any database as per your choice)
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time Communication**: Socket.io

## Project Structure

/client # Next.js client-side code /components # React components /styles # Tailwind CSS styles

/server # Express server-side code /modules # API controllers (chat, auth) /models # Database models (User, Message) /routes # API routes /server/modules/socket # Socket.io event handlers /config # Configuration (DB, Auth)

### 1. Clone the repository
```bash
git clone https://github.com/awebcode/linky.git
cd linky
```

# 2. Install dependencies for both client and server
```bash
cd client && bun install
cd server && bun install
```
# 3. Setup the environment variables
Copy everything from .env.test and In the root directory, create a .env file for your environment variables:

# 4. Running the Application
Start the backend server (Express + Socket.io):
```bash
cd /server
npm start || bun start
```

Start the Client: 
```bash
cd /client
npm run dev || bun run dev
```


# How It Works
### Backend (Express + Socket.io)

Socket.io Integration: We use Socket.io to establish a WebSocket connection between the client and server. This allows for real-time communication without needing to refresh the page.
Rooms: Socket.io supports creating rooms where clients can join specific groups. Each room is dedicated to a chat session.
Message Handling: The server listens for messages from clients and broadcasts them to all users in the same room.
User Status: The backend tracks users' online, offline, and idle statuses, updating them in real-time using Socket.io.
Message Seen Tracking: The backend tracks when a message has been seen by a user, allowing for read receipts.
Message Reactions: Users can send reactions (like emojis) to messages, which are broadcasted to other users in the same room.

# Frontend (Next.js)
### Socket.io Client: On the client side, Socket.io is integrated with React to send and receive messages in real-time.
User Interface: The UI is built with React components and styled with Tailwind CSS to ensure responsiveness and ease of customization.
Message Reactions and Status: Users can interact with messages through reactions and view other users' online status.
Contributing
Feel free to fork and submit issues or pull requests. Contributions are always welcome!

# Steps to contribute:
Fork the repository.
Create a new branch (git checkout -b feature/your-feature-name).
Commit your changes (git commit -am 'Add new feature').
Push to your branch (git push origin feature/your-feature-name).
Create a new Pull Request.

# License
Distributed under the MIT License. See LICENSE for more information.