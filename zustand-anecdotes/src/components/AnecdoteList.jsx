import { useAnecdotes, useAnecdoteActions, useNotificationActions } from '../store'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { vote } = useAnecdoteActions()
  const { setMessage } = useNotificationActions()

  return (
    <>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          {anecdote.content}
          <div>
            has {anecdote.votes}
            <button onClick={() => {
              vote(anecdote.id)
              setMessage(`You Voted '${anecdote.content}'`)
              setTimeout(() => setMessage(""), 5000)
            }
            }>vote</button>
          </div>
        </div>
      ))}
    </>
  )
}

export default AnecdoteList