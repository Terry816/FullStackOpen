import { useAnecdotes } from '../hooks/useAnecdotes'
import useNotification from '../hooks/useNotify'

const AnecdoteForm = () => {
  const { addAnecdote } = useAnecdotes()
  const { setMessage } = useNotification()

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    if (content.length < 5) {
      setMessage("too short anecdote, must have length 5 or more")
      setTimeout(() => setMessage(null), 5000)
      return
    }
    event.target.reset()
    addAnecdote(content)
    setMessage(`Anecdote ${content} created`)
    setTimeout(() => setMessage(null), 5000)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm