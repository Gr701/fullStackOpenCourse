import {useState} from 'react'

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

const Person = ({person}) => <div>{person.name} {person.number}</div>

const Persons = ({persons, filterPersons}) => 
  persons.filter(filterPersons).map((person) => 
    <Person key={person.id} person={person}/>)

const App = () => {
  const [persons, setPersons] = useState([
    {name: 'Arto Hellas', number: '040-1234567', id: 1},
    {name: 'Ada Lovelace', number: '39-44-5323523', id: 2},
    {name: 'Dan Abramov', number: '12-43-234345', id: 3},
    {name: 'Mary Poppendieck', number: '39-23-6423122', id: 4}
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchValue, setSearchValue] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }  
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value)
  }

  const addNewPerson = (event) => {
    event.preventDefault()
    if (persons.some((person) => person.name === newName)) {
      alert(`"${newName}" is already added to phonebook`)
      return
    }
    setPersons(persons.concat({
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }))
    setNewName('')
    setNewNumber('')
  }

  const filterPersons = (p) => p.name.toUpperCase().includes(searchValue.toUpperCase())

  return (
    <div>
      <h2>Phonebook</h2>
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
      <Persons persons={persons} filterPersons={filterPersons}/>
    </div>
  )
}

export default App