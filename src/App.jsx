import { useEffect, useState } from 'react'
import axios from 'axios'

export default function App() {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState('')
  const [newSearch, setNewSearch] = useState('');
  const [showDelete, setShowDelete] = useState(persons.map(() => true));
  const [showConfirm, setShowConfirm] = useState(persons.map(() => false));
  const [showEdit, setShowEdit] = useState(persons.map(() => true));
  const [showOptions, setShowOptions] = useState(persons.map(() => false));
  const [showNameChange, setShowNameChange] = useState(persons.map(() => false));
  const [nameChange, setNameChange] = useState('');

  const [people, setPeople] = useState([]);

  useEffect(() => {
    console.log('effect');
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPeople(response.data)
      })
  }, []);
  console.log('render', people.length, 'people');


  function handleName(event) {
    setNewName(event.target.value);
  }

  function handleNum(event) {
    setNewNum(event.target.value);
  }

  function handleSearch(event) {
    setNewSearch(event.target.value.toLowerCase());
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added in the phonebook.`);
      setNewName('');
      return;
    } else if (persons.some((person) => person.number === newNum)) {
      alert(`${newNum} is already added in the phonebook.`);
      setNewNum('');
      return;
    }
    setPersons([...persons, { name: newName, number: newNum, id: persons.length + 1 }]);
    setNewName('');
    setNewNum('');
    setShowDelete([...showDelete, true]);
    setShowConfirm([...showConfirm, false]);
  }

  const showList = newSearch ?
    persons.filter((person) => person.name.toLowerCase().includes(newSearch)) :
    persons;

  function handleDelete(value) {
    const updateDelete = showDelete.map((show, index) => 
      index === value - 1 ? false : show
    );
    const updateShowConfirm = showConfirm.map((show, index) =>
      index === value - 1 ? true : show
    );
    setShowConfirm(updateShowConfirm);
    setShowDelete(updateDelete);
  }

  function handleConfirm(value) {
    setPersons(persons.filter((person) => value !== person.id)
      .map((person, index) => ({...person, id: index + 1})));
    setShowDelete((prev) => prev.slice(0, value - 1).concat(prev.slice(value)));
    setShowConfirm((prev) => prev.slice(0, value - 1).concat(prev.slice(value)));
    setShowEdit((prev) => prev.slice(0, value - 1).concat(prev.slice(value)));
    setShowOptions((prev) => prev.slice(0, value - 1).concat(prev.slice(value)));
    setShowNameChange((prev) => prev.slice(0, value - 1).concat(prev.slice(value)));
  }

  function handleCancel(value) {
    const updateDelete = showDelete.map((show, index) =>
      index === value - 1 ? true : show
    );
    const updateShowConfirm = showConfirm.map((show, index) =>
      index === value - 1 ? false : show
    );
    setShowDelete(updateDelete);
    setShowConfirm(updateShowConfirm);
  }

  function handleEdit(value) {
    const updateEdit = showEdit.map(() => true);
    const updateOption = showOptions.map(() => false);
    updateEdit[value - 1] = false;
    updateOption[value - 1] = true;
    setShowEdit(updateEdit);
    setShowOptions(updateOption);
  }

  function handleNameChange(value) {
    const updateShowNameChange = showNameChange.map((show, index) =>
      index === value - 1 ? true : show
    );
    const updateOption = showOptions.map((show, index) =>
      index === value - 1 ? false : show
    );
    setShowNameChange(updateShowNameChange);
    setShowOptions(updateOption);
  }

  function handleInputNameChange(event) {
    setNameChange(event.target.value);
  }

  function handleNameChangeSubmit(event, value) {
    event.preventDefault();

    if (persons.some((person) => person.name === nameChange)) {
      alert(`${nameChange} is already present in the phonebook!`);
      setNameChange('');
      return;
    }
    setPersons(persons.map((person) =>
      person.id === value ? {...person, name: nameChange} : person
    ));
    setNameChange('');
    const updateShowEdit = showEdit.map((show, index) =>
      index === value - 1 ? true : show
    );
    const updateShowOptions = showOptions.map((show, index) =>
      index === value - 1 ? false : show
    );
    const updateShowNameChange = showNameChange.map((show, index) =>
      index === value - 1 ? false : show
    );
    setShowEdit(updateShowEdit);
    setShowOptions(updateShowOptions);
    setShowNameChange(updateShowNameChange);
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Filter newSearch={newSearch} handleSearch={handleSearch}/>
      <h2>Add a new</h2>
      <PersonForm 
        handleSubmit={handleSubmit} 
        newName={newName}
        handleName={handleName}
        newNum={newNum}
        handleNum={handleNum}
      />
      <h2>Numbers</h2>
      <div>
        {showList.map((person) => {
          return (
            <div key={person.id}>
              {person.name} {person.number} 
              {showDelete[person.id - 1] && (
                <button onClick={() => handleDelete(person.id)}>Delete</button>
              )}
              {showEdit[person.id - 1] && (
                <button onClick={() => handleEdit(person.id)}>Edit</button>
              )}
              {showOptions[person.id - 1] && (
                <div>
                  Which would you like to edit?
                  <button onClick={() => handleNameChange(person.id)}>name</button>
                  <button>number</button>
                </div>
              )}
              {showConfirm[person.id - 1] && (
                <div>
                  Are you sure?
                  <button onClick={() => handleConfirm(person.id)}>Yes</button>
                  <button onClick={() => handleCancel(person.id)}>No</button>
                </div>
              )}
              {showNameChange[person.id - 1] && (
                <form onSubmit={(event) => handleNameChangeSubmit(event, person.id)}>
                  <div>
                    new name: <input type="text" value={nameChange} onChange={handleInputNameChange}/>
                    <button type="submit">submit</button>
                  </div>
                </form>
              )}
            </div>
          );
        })}
      </div>
    </div>
  )
}

function PersonForm({ handleSubmit, newName, handleName, newNum, handleNum }) {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input type="text" value={newName} onChange={handleName}/>
      </div>
      <div>
        number: <input type="tel" value={newNum} onChange={handleNum} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
}

function Filter({ newSearch, handleSearch }) {
  return (
    <div>
      filter shown with <input type="text" value={newSearch} onChange={handleSearch}/>
    </div>
  );
}