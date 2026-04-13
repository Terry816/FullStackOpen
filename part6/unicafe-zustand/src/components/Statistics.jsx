import StatisticLine from "./StatisticLine"

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

export default Statistics