const baseUrl = 'http://localhost:3002/anecdotes'

export const getAll = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) {
    throw new Error('Failed to fetch Anecdotes')
  }
  return await response.json()
}

export const create = async (newAnecdote) => {
  const option = {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newAnecdote)
  }
  const response = await fetch(baseUrl, option)
  if (!response.ok) {
    throw new Error("Failed to post Anecdote")
  }
  return await response.json()
}

export const update = async (updatedAnecdote) => {
  const option = {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedAnecdote)
  }
  const response = await fetch(`${baseUrl}/${updatedAnecdote.id}`, option)
  if (!response.ok)
    throw new Error("Unable to update the Vote")
  return await response.json()
}
