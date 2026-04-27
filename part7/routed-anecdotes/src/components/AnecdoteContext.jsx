import { useAnecdotes } from '../hooks/useAnecdotes'
import { createContext, useContext } from 'react'

const AnecdoteContext = createContext()

const AnecdoteProvider = ({ children }) => {
  const anecdoteApi = useAnecdotes()
  return (
    <AnecdoteContext.Provider value={anecdoteApi}>
      {children}
    </AnecdoteContext.Provider>
  )
}

export default AnecdoteProvider
export const useAnecdoteContext = () => useContext(AnecdoteContext)