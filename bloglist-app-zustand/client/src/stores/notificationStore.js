import { create } from 'zustand'

const useNotificationStore = create((set) => ({
  message: null,
  type: "",
  actions: {
    setMessage: (notif) => {
      if (!notif){
        set(() => ({message: null, type: ""}))
      } else {
      set(() => ({ message: notif.text, type: notif.type }))
    }
  }
}
}))

export const useNotification = () => useNotificationStore(state => state.message)
export const useNotificationType = () => useNotificationStore(state => state.type)
export const useNotificationActions = () => useNotificationStore(state => state.actions)