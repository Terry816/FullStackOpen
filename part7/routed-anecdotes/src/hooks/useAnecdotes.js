import { useState, useEffect } from 'react'
import anecdoteService from '../services/anecdotes'

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService.getAll().then(response => setAnecdotes(response))
  }, [])

  const addAnecdote = async (anecdote) => {
    const response = await anecdoteService.createNew(anecdote)
    setAnecdotes(prev => prev.concat(response))
  }

  const deleteAnecdote = async (id) => {
    await anecdoteService.remove(id)
    setAnecdotes(prev => prev.filter((a) => a.id !== id))
  }

  return { anecdotes, addAnecdote, deleteAnecdote }
}