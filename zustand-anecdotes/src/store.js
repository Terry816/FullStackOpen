import { create } from 'zustand'
import aService from "./services/anecdotes"
import anecdotes from './services/anecdotes'


const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: "",
  actions: {
    vote: async (id) => {
      const anec = get().anecdotes.find(an => an.id === id)
      const updated = await aService.updateVote(id, { ...anec, votes: anec.votes + 1 })
      set(state => ({ anecdotes: state.anecdotes.map(an => an.id === id ? updated : an) }))
    },
    add: async (anec) => {
      const anecdote = await aService.createNew(anec)
      set(state => ({ anecdotes: state.anecdotes.concat(anecdote) }))
    },
    setFilter: value => set(() => ({ filter: value })),
    initialize: async () => {
      const anecdotes = await aService.getAll()
      set(() => ({ anecdotes }))
    },
    removeZeros: async () => {
      const zeros = get().anecdotes.filter((anec) => anec.votes === 0)
      set(state => ({ anecdotes: state.anecdotes.filter((anec) => anec.votes !== 0) }))
      await Promise.all(zeros.map(a => aService.remove(a.id)))
    },
  }
}))

const useNotificationStore = create((set) => ({
  message: "",
  actions: {
    setMessage: (msg) => set(() => ({ message: msg }))
  }
}))

export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes)
export const useFilter = () => useAnecdoteStore((state) => state.filter)
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)

export const useNotification = () => useNotificationStore((state) => state.message)
export const useNotificationActions = () => useNotificationStore((state) => state.actions)
