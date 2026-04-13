import { useAnecdotes, useAnecdoteActions } from '../store'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { vote } = useAnecdoteActions()

  const sorted = anecdotes.sort((a, b) => b.votes - a.votes)

  return (
    <>
      {sorted.map(anecdote => (
        <div key={anecdote.id}>
          {anecdote.content}
          <div key={anecdote.id}>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </>
  )
}

export default AnecdoteList