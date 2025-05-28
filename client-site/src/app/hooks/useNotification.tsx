// hooks/useNotification.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "../services/api";

export const useNotification = () => {
  const queryClient = useQueryClient();

  const useGetNotifications = () => {
    return useQuery({
      queryKey: ["notifications"],
      queryFn: () => notificationApi.getUserNotifications(),
      staleTime: 0,
    });
  };

  const useMarkAsRead = () => {
    return useMutation({
      mutationFn: (notificationId: string) => 
        notificationApi.markNotificationAsRead(notificationId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
      },
    });
  };

  const useMarkAllAsRead = () => {
    return useMutation({
      mutationFn: () => notificationApi.markAllNotificationsAsRead(),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
      },
    });
  };

  return {
    useGetNotifications,
    useMarkAsRead,
    useMarkAllAsRead,
  };
};