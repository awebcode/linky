// export interface Message{
//     id: string
//     content: string
//     timestamp: Date
//     sender: {
//         id: string
//         name: string
//         avatar: string
//     }
// }

interface MessageUser {
  id: string;
  name: string;
  image: string;
  status: string;
  lastActive: string;
}

interface Reaction {
  emoji: string;
  count: number;
}

export interface MessageResponse {
  id: string;
  tempId: string;
  content: string;
  sentAt: string;
  status: string;
  sender: MessageUser;
  media?: { id: string; type: string; url: string }[];
  reactions?: Reaction[];
  totalReactionsCount?: number;
  seenUsers?: MessageUser[];
  totalSeenUsersCount?: number;
  totalMediaCount?: number;
}


// Interface for the response from the `getMessages` function

// Interface for the query parameters passed to `getMessages`
export interface GetMessagesParams {
  chatId: string;
  cursor: string | null;
  limit: number;
}

export interface CreateMessageInput {
  content: string;
  senderId: string;
  chatId: string;
  files?: 
    {
      secure_url: string;
    }[]
  
}
