import { useAnecdoteContext } from './AnecdoteContext'

const AnecdoteList = () => {
  const { anecdotes, deleteAnecdote } = useAnecdoteContext()

  const handleDelete = (e, id) => {
    e.preventDefault()
    deleteAnecdote(id)
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      <ul>
        {anecdotes.map(anecdote =>
          <li key={anecdote.id}>
            {anecdote.content}
            <button onClick={(e) => handleDelete(e, anecdote.id)}>delete</button>
          </li>)}
      </ul>
    </div >
  )
}

export default AnecdoteList
