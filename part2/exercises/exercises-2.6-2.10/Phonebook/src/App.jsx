import { useState, useEffect } from 'react'
import personService from './services/person'

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

const Display = ({ view, deletehandler }) => {
  return (
    <div>
      {view.map(p => (
        <p key={p.id}>{p.name} {p.number}
          <button onClick={(e) => deletehandler(e, p.id, p.name)}>delete</button>
        </p>
      ))}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')

  useEffect(() => {
    console.log("effect")
    personService.getAll()
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])

  const handleAddName = (event) => {
    event.preventDefault()
    const hasDupes = persons.find((n) => (n.name === newName && n.number === newNumber))
    if (hasDupes !== undefined) {
      alert(`${newName} is already added to phonebook`)
      return;
    }

    const SameName = persons.find((n) => (n.name === newName))
    if (SameName !== undefined) {
      const ok = window.confirm(`${newName} is already added to the phonebook,
        replace the old number with a new one?`)
      if (!ok) return
      const newPerson = { name: SameName.name, number: newNumber }
      personService.update(SameName.id, newPerson)
        .then(response => {
          setPersons(prev => prev.map(node => node.name === SameName.name ? response.data : node))
          setNewName('')
          setNewNumber('')
        })
    }
    else {
      const newPerson = { name: newName, number: newNumber }
      personService.create(newPerson)
        .then(response => {
          setPersons(prev => prev.concat(response.data))
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const handleDelete = (event, id, name) => {
    event.preventDefault()
    const ok = window.confirm("Delete " + name + " ?")
    if (!ok) return
    personService.remove(id)
      .then(() => {
        setPersons(prev => prev.filter(item => item.id !== id))
        setNewName('')
        setNewNumber('')
      })
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
      <Display view={view} deletehandler={handleDelete} />
    </div >
  )
}

export default App