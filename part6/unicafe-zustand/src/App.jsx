import Button from './components/Buttons'
import Statistics from './components/Statistics'
import { useGood, useBad, useNeutral, useIncrement } from './store/store'

const App = () => {
  const good = useGood()
  const bad = useBad()
  const neutral = useNeutral()
  const increment = useIncrement()

  return (
    <>
      <h1>Give Feedback</h1>
      <div>
        <Button onClick={() => increment('good')} text="Good" />
        <Button onClick={() => increment('neutral')} text="Neutral" />
        <Button onClick={() => increment('bad')} text="Bad" />
      </div>
      <h1>Statistics</h1>
      <Statistics good={good} bad={bad} neutral={neutral} />
    </>
  )
}

export default App