import { AppError } from "../../middlewares/errors-handle.middleware";
import { fetchBatchAllOnlineConversationsByChatId, fetchBatchAllOnlineConversationsByUserId } from "../chat/chat.utils";
// import { getRoomMembersR } from "./redis.services";

/**
 * @title  Get online conversations ids only in your chat by userId
 * @param userId 
 * @returns Array of conversationIds
 */
export const getOnlineConversationIdsByUserId = async (userId: string) => {
  try { 
    const onlineConversations = await fetchBatchAllOnlineConversationsByUserId(userId, 250); // Fetch in larger batches if possible
    const onlineConversationsIds = onlineConversations.map((chatId) => {
      return chatId;
    });
    return onlineConversationsIds;
  } catch (error) {
    throw new AppError("Error fetching online users", 500);
  }
}

/**
 * @title   Get online users/Friends ids only in your chat by userId 
 * @param userId 
 * @returns Array of userIds
 */
// export const getOnlineUsersIdsByUserId = async (userId: string) => {
//   try { 
//     const onlineUsers = await fetchBatchAllOnlineConversationsByUserId(userId, 250); // Fetch in larger batches if possible
//     const onlineUsersIds = onlineUsers.map((user) => {
//       return user.user.id;
//     });
//     return onlineUsersIds;
//   } catch (error) {
//     throw new AppError("Error fetching online users", 500);
//   }
// }
/**
 * @title Get online users/Friends ids only in your chat by chatId
 * 
 * @param chatId 
 * @returns  Array of UserIds
 */
// export const getOnlineUsersIDsByChatId = async (chatId: string) => {
//   try { 
//     const onlineUsers = await fetchBatchAllOnlineConversationsByChatId(chatId, 250); // Fetch in larger batches if possible
//     const onlineUsersIds = onlineUsers.map((user) => {
//       return user.user.id;
//     });
//     return onlineUsersIds;
//   } catch (error) {
//     throw new AppError("Error fetching online users", 500);
//   }
  
// }
