import { useAnecdotes, useAnecdoteActions, useFilter } from '../store'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const filter = useFilter()
  const { vote } = useAnecdoteActions()

  const filteredanecdotes = anecdotes.filter(sentences => sentences.content.includes(filter))
  const sorted = filteredanecdotes.sort((a, b) => b.votes - a.votes)

  return (
    <>
      {sorted.map(anecdote => (
        <div key={anecdote.id}>
          {anecdote.content}
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </>
  )
}

export default AnecdoteList