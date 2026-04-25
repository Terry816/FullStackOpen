import { useAnecdoteActions } from "../store"

const Delete = () => {
  const { removeZeros } = useAnecdoteActions()

  const handleDelete = (event) => {
    event.preventDefault()
    removeZeros()
  }

  return (
    <div>
      <button onClick={handleDelete}>Delete Zeros</button>
    </div>
  )
}

export default Delete