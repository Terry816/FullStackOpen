import AnecdoteForm from "./components/AnecdoteForm"
import AnecdoteList from "./components/AnecdoteList"
import Notification from "./components/Notification"
import Filter from "./components/Filter"
import { useAnecdoteActions, useNotification } from "./store"
import { useEffect } from "react"

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
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </>
  )
}

export default App