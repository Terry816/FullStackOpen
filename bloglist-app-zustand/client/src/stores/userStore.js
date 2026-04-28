import { create } from "zustand"
import loginService from "../services/login"

const userStore = create((set) => ({
  user: null,
  actions: {
    login: async (username, password) => {
      const u = await loginService.login({username, password})
      console.log(u)
      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(u));
      loginService.setToken(u.token)
      set(() => ({user: u }))
    },
    retrieve: () => {
      const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
      if (loggedUserJSON) {
        const u = JSON.parse(loggedUserJSON);
        loginService.setToken(u.token);
        set(state => ({user: u}))
      }
    }
  }
}))

export const useUser = () => userStore(state => state.user)
export const useUserAction = () => userStore(state => state.actions)
