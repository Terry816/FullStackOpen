import AnecdoteForm from "./components/AnecdoteForm"
import AnecdoteList from "./components/AnecdoteList"
import Notification from "./components/Notification"
import Delete from "./components/Delete"
import Filter from "./components/Filter"
import { useAnecdoteActions, useNotification } from "./store"
import { useEffect } from "react"
import { useQuery } from '@tanstack/react-query'

const App = () => {
  const { initialize } = useAnecdoteActions()
  const message = useNotification()

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <>
      {message && <Notification message={message} />}
      <h2>Anecdotes</h2>
      <div style={{ display: "flex", gap: "40px" }}>
        <Filter />
        <Delete />
      </div>
      <AnecdoteList />
      <AnecdoteForm />
    </>
  )
}

export default App