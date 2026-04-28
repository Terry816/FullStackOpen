import { create } from "zustand"
import loginService from "../services/login"

const userStore = create((set) => ({
  user: null,
  token: "",
  actions: {
    setToken: (token) => {
      set(() => ({ token }))
    },
    setUser: (user) => (() => { user }),
    login: async (username, password) => {
      const u = await loginService.login({username, password})
      console.log(u)
      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(u));
      set(() => ({ token: u.token }))
      set(() => ({user: u }))
    },
    retrieve: () => {
      const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
      if (loggedUserJSON) {
        const u = JSON.parse(loggedUserJSON);
        set(() => ({ token: u.token }))
        set(() => ({user: u}))
      }
    },
    logout: () => {
      window.localStorage.removeItem("loggedNoteappUser");
      set(() => ({ token: null }))
      set(() => ({user: null}))
    }
  }
}))

export const useUser = () => userStore(state => state.user)
export const useToken = () => userStore(state => state.token)
export const useUserAction = () => userStore(state => state.actions)