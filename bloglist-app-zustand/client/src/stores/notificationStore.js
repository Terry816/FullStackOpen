import { create } from 'zustand'

const useNotificationStore = create((set) => ({
  message: null,
  actions: {
    setMessage: (msg) => set(() => ({ message: msg }))
  }
}))

export const useNotification = () => useNotificationStore(state => state.message)
export const useNotificationActions = () => useNotificationStore(state => state.actions)