const Course = ({ course }) => {
  return (
    <div>
      <Header text={course.name} />
      <Content parts={course.parts} />
    </div>
  )
}

const Header = ({ text }) => {
  return <h2>{text}</h2>
}

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(p => <Part key={p.id} name={p.name} exercises={p.exercises} />)}
      <b>total of {parts.reduce((sum, curr) => { return sum + curr.exercises }, 0)} exercises</b>
    </div>
  )
}

const Part = ({ name, exercises }) => {
  return <p>{name} {exercises}</p>
}


export default Course