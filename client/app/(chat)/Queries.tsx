import axiosInstance from "@/config/axiosInstance";
import { useCountStore } from "@/hooks/countStore";
import { useFetchData } from "@/hooks/use-fetch-data";
import { ChatsCount } from "@/types/chat";
import React, { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
/**
 * Global queries handler for the app
 */
const Queries = () => {
  const { setChatsCount } = useCountStore(useShallow((state) => state));
  const { data: chatCounts,isLoading: chatCountsLoading,error: chatCountsError } = useFetchData<ChatsCount>({
    queryKey: ["chatCounts"],
    queryFn: async () => {
      return (await axiosInstance.get(`/chat/chats-counts`)).data;
    },
    staleTime: 1000 * 60 * 25, // 25 minutes store data on the cache and no api call
  });

  useEffect(() => {
    if (chatCounts) {
      setChatsCount(chatCounts);
    }
  }, [chatCounts, setChatsCount]);

  if (chatCountsLoading) {
    return <></>;
  }

  // if (chatCountsError) {
  //   return <p className="text-red-500">Error: {chatCountsError?.message||"Something went wrong"}</p>;
  // }

  // const { data, isLoading, isError, error } = useQuery(["chats"], getChats)
  return <></>;
};

export default Queries;
