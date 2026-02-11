const Header = (props) => {

  return (
    <div>
      <h1>
        {props.course}
      </h1>
    </div>
  )
}

const Content = (props) => {
  return (
    <div>
      <ul>
        <Parts part={props.parts[0].name} exercise={props.parts[0].exercises} />
        <Parts part={props.parts[1].name} exercise={props.parts[1].exercises} />
        <Parts part={props.parts[2].name} exercise={props.parts[2].exercises} />
      </ul>
    </div>
  )
}
const Parts = ({ part, exercise }) => {
  return (
    <li>
      {part} {exercise}
    </li>
  )
}
const Total = (props) => {
  return (
    <p>Number of exercises {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises}</p>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}
// this is the progress check up until the javascript exercises
export default App