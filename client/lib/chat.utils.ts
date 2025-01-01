/**
 * Utility function to get the heading of the chat list
 * @param searchValue 
 * @param chats 
 * @param unlistedUsers 
 * @returns 
 */
export const getChatsHeading = (searchValue: string, chats: any[], unlistedUsers: any[]) => {
  if (searchValue && chats?.length > 0) {
    return `Search Results (${chats.length})`;
  } else if (chats?.length > 0) {
    return `Chats (${chats.length})`;
  } else if (searchValue && unlistedUsers?.length > 0) {
    return `Unlisted Users (${unlistedUsers.length})`;
  } else {
    return "No Chats";
  }
};

/**
 * Utility function to get the count of chats
 * @param searchValue 
 * @param chats 
 * @param unlistedUsers 
 * @returns 
 */

export const getChatsCount= (searchValue: string, chats: any[], unlistedUsers: any[]) => {
  if (searchValue && chats?.length > 0) {
    return chats.length;
  } else if (chats?.length > 0) {
    return chats.length;
  } else if (searchValue && unlistedUsers?.length > 0) {
    return unlistedUsers.length;
  } else {
    return 0;
  }
}
