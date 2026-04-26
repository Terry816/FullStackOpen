import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAll, create, update } from '../requests'

export const useAnecdotes = () => {
  const queryClient = useQueryClient()

  const { data, isPending, isError } = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAll,
    refetchOnWindowFocus: false
  })

  const createAnecdote = useMutation({
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] })
    }
  })

  const updateAnecdote = useMutation({
    mutationFn: update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] })
    }
  })

  return {
    anecdotes: data,
    isPending: isPending,
    isError: isError,
    addAnecdote: (content) => createAnecdote.mutate({ content, votes: 0 }),
    vote: (anecdote) => updateAnecdote.mutate({
      ...anecdote, votes: anecdote.votes + 1
    }),
  }
}