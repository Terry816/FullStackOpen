import { create } from "zustand";

const useNotificationStore = create((set) => ({
  notification: null,
  actions: {
    setMessage: (notification) => set({ notification }),
  },
}));

export const useNotification = () =>
  useNotificationStore((state) => state.notification);
export const useNotificationActions = () =>
  useNotificationStore((state) => state.actions);
