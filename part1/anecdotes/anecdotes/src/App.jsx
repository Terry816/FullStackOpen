import { useState } from 'react'

const Button = ({ text, onClick }) => {
  return (
    <>
      <button onClick={onClick}>{text}</button>
    </>
  )
}

const Display = ({ header, text, votes }) => {
  return (
    <>
      <h1>{header}</h1>
      <div>{text}</div>
      <p>has {votes} votes</p>
    </>
  )
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const updateSelected = () => {
    const num = getRandomInt(0, 7)
    setSelected(num)

  }

  const updateVotes = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  const findMax = () => {
    console.log("this ran")
    let maxIndex = 0
    let maxVal = 0
    for (let i = 0; i < anecdotes.length; i++) {
      if (votes[i] > maxVal) {
        maxVal = votes[i]
        maxIndex = i
      }
    }
    return maxIndex
  }
  const maxIndex = findMax()

  return (
    <div>
      <Display header="Anecdote of the day" text={anecdotes[selected]} votes={votes[selected]} />
      <Button onClick={updateVotes} text={"vote"} />
      <Button onClick={updateSelected} text={"next anecdote"} />
      <Display header="Anecdote with most votes" text={anecdotes[maxIndex]} votes={votes[maxIndex]} />

    </div>
  )
}

export default App