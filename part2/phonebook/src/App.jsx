import {useState, useEffect} from 'react'
import personService from './services/persons'

const Filter = ({searchValue, handleSearchChange}) => 
  <div>
    filter shown with 
    <input value={searchValue} onChange={handleSearchChange}/>
  </div>

const PersonForm = ({newName, newNumber, handleNameChange, handleNumberChange, addNewPerson}) => 
  <form>
    <div>
      name: <input value={newName} onChange={handleNameChange}/>
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange}/>
    </div>
    <div>
      <button onClick={addNewPerson} type="submit">add</button>
    </div>
  </form>

const Person = ({person, deletePerson}) => 
<div>
  {person.name} {person.number} {' '}
  <button onClick={() => deletePerson(person)}>delete</button>
</div>

const Persons = ({persons, filterPersons, deletePerson}) => 
  persons.filter(filterPersons).map((person) => 
    <Person key={person.id} person={person} deletePerson={deletePerson}/>)

const Notification = ({message}) => {
  if (message === null) {
    return null
  }
  
  const style = {
    color: message.color,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  return (
    <div style={style}>{message.text}</div>  
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [topNotification, setTopNotification] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addNewPerson = (event) => {
    event.preventDefault()
    if (persons.some((person) => person.name === newName)) {
      if (!confirm(`"${newName}" is already added to phonebook, replace the old number with a new one?`)) {
        return
      }
      const personToUpdate = persons.find((p) => p.name === newName)
      personService
        .update({
          ...personToUpdate,
          number: newNumber
        })
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id !== personToUpdate.id ? p : returnedPerson))
          setNewName('')
          setNewNumber('')
          setTopNotification({
            text: `Number of ${returnedPerson.name} is changed`,
            color: 'green'
          })
          setTimeout(() => setTopNotification(null), 5000)
        })
        .catch(error => {
          setTopNotification({
            text: `Infotmation of ${personToUpdate.name} has been already removed from the server`,
            color: 'red'
          }) 
          setTimeout(() => setTopNotification(null), 5000)
          setPersons(persons.filter(p => p.id !== personToUpdate.id))
        })
      return
    }
    personService
      .create({
        name: newName,
        number: newNumber
      })
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setTopNotification({
          text: `Added ${returnedPerson.name}`,
          color: 'green'
        })
        setTimeout(() => setTopNotification(null), 5000)
      })
  }

  const deletePerson = (personToDelete) => {
    if (!confirm(`Delete ${personToDelete.name}?`)) {
      return
    }
    personService
      .deleteOne(personToDelete.id)
      .then(returnedPerson => {
        setPersons(persons.filter(p => p.id !== returnedPerson.id))
      })
      .catch(error => {
        setTopNotification({
          text: `Infotmation of ${personToDelete.name} has been already removed from the server`,
          color: 'red'
        })
        setTimeout(() => setTopNotification(null), 5000)
        setPersons(persons.filter(p => p.id !== personToDelete.id))
      })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }  
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value)
  }

  const filterPersons = (p) => p.name.toUpperCase().includes(searchValue.toUpperCase())

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={topNotification}/>
      <Filter searchValue={searchValue} handleSearchChange={handleSearchChange}/>

      <h3>Add a new</h3>
      <PersonForm 
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addNewPerson={addNewPerson}
      />

      <h3>Numbers</h3>
      <Persons persons={persons} filterPersons={filterPersons} deletePerson={deletePerson}/>
    </div>
  )
}

export default App