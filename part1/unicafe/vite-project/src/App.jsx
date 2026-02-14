import { useState } from 'react'


const Button = ({ onClick, text }) => {
  return (
    <button onClick={onClick}>{text}</button >
  )
}

const StatisticLine = ({ text, count, notation }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{count} {notation}</td>
    </tr>
  )
}

const Statistics = ({ good, neutral, bad }) => {
  const total = good + bad + neutral
  if (total === 0) {
    return <h4>No feedback given</h4>
  }
  return (
    <table>
      <tbody>
        <StatisticLine text="good" count={good} />
        <StatisticLine text="neutral" count={neutral} />
        <StatisticLine text="bad" count={bad} />
        <StatisticLine text="all" count={total} />
        <StatisticLine text="average" count={(good - bad) / total} />
        <StatisticLine text="positive" count={(good / total) * 100} notation={"%"} />
      </tbody>
    </table>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const total = good + bad + neutral
  const updateClick = (func, attr) => {
    func(prev => prev + 1)
  }

  return (
    <>
      <h1>Give Feedback</h1>
      <div>
        <Button onClick={() => updateClick(setGood, "good")} text={"Good"} />
        <Button onClick={() => updateClick(setNeutral, "neu")} text={"Neutral"} />
        <Button onClick={() => updateClick(setBad, "bad")} text={"Bad"} />
      </div>
      <h1>Statistics</h1>
      <Statistics good={good} bad={bad} neutral={neutral} />
    </>
  )
}

export default App