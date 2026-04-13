import { create } from 'zustand'

const useCounterStore = create(set => ({
  good: 0,
  bad: 0,
  neutral: 0,
  increment: (label) => set((state) => ({ [label]: state[label] + 1 }))
}))

export const useGood = () => useCounterStore(state => state.good)
export const useBad = () => useCounterStore(state => state.bad)
export const useNeutral = () => useCounterStore(state => state.neutral)
export const useIncrement = () => useCounterStore(state => state.increment)