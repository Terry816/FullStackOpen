import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useAnecdotes } from './hooks/useAnecdotes'
import useNotification from './hooks/useNotify'

const App = () => {
  const { anecdotes, isPending, isError, vote } = useAnecdotes()
  const { message, setMessage } = useNotification()

  const handleVote = (anecdote) => {
    vote(anecdote)
    setMessage(`Anecdote ${anecdote.content} voted`)
    setTimeout(() => setMessage(null), 5000)
  }

  if (isPending)
    return <div>loading data...</div>

  if (isError)
    return <div>Anecdote service not available due to problems in server</div>

  return (
    <div>
      <h3>Anecdote app</h3>

      {message && <Notification />}
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App