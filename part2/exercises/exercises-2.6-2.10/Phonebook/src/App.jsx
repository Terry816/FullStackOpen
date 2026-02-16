import { useState, useEffect } from 'react'
import axios from 'axios'

const Entry = ({ text, value, handler }) => {
  return (
    <div>
      {text}: <input value={value} onChange={handler} />
    </div>
  )
}

const PersonForm = ({ newName, newNumber, namehandler, numberhandler, Addhandler }) => {
  return (
    <form onSubmit={Addhandler}>
      <Entry text={"name"} value={newName} handler={namehandler} />
      <Entry text={"number"} value={newNumber} handler={numberhandler} />
      <button type="submit">add</button>
    </form>
  )
}

const Display = ({ view }) => {
  return (
    <div>
      {view.map(p => <p key={p.id}>{p.name} {p.number}</p>)}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')

  const handleAddName = (event) => {
    event.preventDefault()
    const hasDupes = persons.find((n) => (n.name === newName))
    if (hasDupes !== undefined) {
      alert(`${newName} is already added to phonebook`)
      return;
    }
    setPersons(prev => prev.concat({ name: newName, number: newNumber, id: String(prev.length + 1) }))
    setNewName('')
    setNewNumber('')
  }


  const handleChangeName = (event) => {
    setNewName(event.target.value)
  }

  const handleChangeNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleChangeState = (event) => {
    setNewSearch(event.target.value)
  }

  const view = persons.filter((word) => word.name.toLowerCase().includes(newSearch.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Entry text={"filter shown with"} value={newSearch} handler={handleChangeState} />
      <h2>add a new</h2>
      <PersonForm newName={newName} newNumber={newNumber} namehandler={handleChangeName} numberhandler={handleChangeNumber} Addhandler={handleAddName} />
      <h2>Numbers</h2>
      <Display view={view} />
    </div >
  )
}

export default App