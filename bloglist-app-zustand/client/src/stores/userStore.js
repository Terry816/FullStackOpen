import { create } from "zustand"
import loginService from "../services/login"
import Userservice from "../services/users"

const userStore = create((set) => ({
  user: null,
  token: null,
  users: [],
  actions: {
    setToken: (token) => {
      set(() => ({ token: `Bearer ${token}` }))
    },
    setUser: (user) => (() => { user }),
    login: async (username, password) => {
      try {
      const u = await loginService.login({username, password})
      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(u));
      set(() => ({ token: `Bearer ${u.token}` }))
      set(() => ({user: u }))
      } catch {
        throw new Error("Wrong username or password")
      }
    },
    retrieve: () => {
      const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
      if (loggedUserJSON) {
        const u = JSON.parse(loggedUserJSON);
        set(() => ({ token: `Bearer ${u.token}` }))
        set(() => ({user: u }))
      }
    },
    logout: () => {
      window.localStorage.removeItem("loggedNoteappUser");
      set(() => ({ token: null }))
      set(() => ({user: null}))
    },
    initializeUsers: async () => {
      const response = await Userservice.getUsers()
      set(() => ({users: response}))
    }
  }
}))

export default userStore

export const useUser = () => userStore(state => state.user)
export const useToken = () => userStore(state => state.token)
export const useUsers = () => userStore(state => state.users)
export const useUserAction = () => userStore(state => state.actions)