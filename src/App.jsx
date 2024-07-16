import { useState, useEffect, useRef } from 'react';
import './App.css';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import DatePickerComponent from './components/DatePickerComponent';

function App() {
  const [highlightedRedTodo, setHighlightedRedTodo] = useState(null)
  const [highlightedBlueTodo, setHighlightedBlueTodo] = useState(null)
  const [error, setError] = useState('') 
  const [todoValue, setTodoValue] = useState('')
  const [todos, setTodos] = useState([])
  const [editIndex, setEditIndex] = useState(null) // Track the index of the todo being edited
  const [isEditing, setIsEditing] = useState(false) // State to track edit mode
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null) 

  const datePickerRef = useRef(null)

  const getCurrentDate = () => {
    const date = new Date()
    return date.toLocaleString()
  }

  const getDatePart = (date) => {
    return date.split(',')[0]
  }

  /*
  * Toggles the completion status of a todo item at the given index.
  *
  * This function updates the completion status of a todo item, sets the completion date if completed,
  * adds an entry to the todo's history, and persists the updated todos list.
  */
  const toggleTaskCompletion = (index) => {
    const newTodos = [...todos]
    const currentDate = getCurrentDate()
  
    // Toggle the completion status
    newTodos[index].completed = !newTodos[index].completed
    newTodos[index].completedDate = newTodos[index].completed ? currentDate : null
    newTodos[index].history.push({ 
      action: newTodos[index].completed ? 'Marked as completed' : 'Marked as not completed',
      date: currentDate
    })
  
    setTodos(newTodos)
    persistData(newTodos)
  }

  const persistData = (newList) => {
    localStorage.setItem('todos', JSON.stringify({ todos: newList }))
  }

  /*
    * Handles the addition of a new todo item.
    * 
    * This function creates a new todo item with the provided text and adds it to the todos list.
    * If the todo text is empty, an error message is shown. If a todo with the same text already exists
    * for the selected date, an error message is shown and the existing todo is highlighted in red.
    * Placeholder entries are added for each day until the selected date to ensure continuity.
    *
  */ 
  const handleAddTodos = (newTodo) => {
    const date = selectedDate || new Date()
    const newTodoItem = { 
      text: newTodo, 
      completed: false, 
      date: date.toLocaleString(), 
      history: [{ action: 'Created', date: date.toLocaleString() }] 
    }
  
    if (newTodo === '') {
      setError('Please enter some task')
      // Check if a todo with the same text already exists for the same date and is not completed
    } else if (todos.some((todo) => todo.text === newTodo && !todo.completed && getDatePart(todo.date) === getDatePart(newTodoItem.date))) {
      setHighlightedRedTodo(newTodo)
      setError('This task already exists')
      setTimeout(() => {
        setError('')
        setHighlightedRedTodo(null)
      }, 3000)
    } else {
      const newTodoList = [...todos]
      let currentDate = new Date()
  
      // Add placeholder entries for each day until the selected date
      while (currentDate <= date) {
        const dateStr = currentDate.toLocaleDateString()
        if (!newTodoList.some(todo => getDatePart(todo.date) === dateStr)) {
          newTodoList.push({
            text: '',
            completed: false,
            date: currentDate.toLocaleString(),
            history: []
          })
        }
        currentDate.setDate(currentDate.getDate() + 1)
      }
  
      newTodoList.push(newTodoItem)
      // Sort the todo list by date
      newTodoList.sort((a, b) => new Date(getDatePart(a.date)) - new Date(getDatePart(b.date)))
      setTodos(newTodoList)
      persistData(newTodoList)
      setHighlightedRedTodo(null)
      setError('')
    }
    setSelectedDate(null) 
  }

  /*
   * Deletes a todo item at the given index.
   * 
   * This function removes a todo item from the list if not currently in editing mode.
   * If in editing mode, an error message is shown and deletion is prevented.
   * The updated todo list is then sorted by date and persisted.
   */

  const handleDeleteTodo = (index) => {
    // Prevent deletion if currently in editing mode
    if (isEditing) {
      setError('Cannot delete while editing')
      setTimeout(() => setError(''), 3000)
      return;
    }
    // Filter out the todo item at the given index
    const newTodoList = todos.filter((todo, todoIndex) => todoIndex !== index)

    // Update the todo list, sort it by date, and persist the changes
    setTodos(newTodoList.sort((a, b) => new Date(a.date) - new Date(b.date)))
    persistData(newTodoList)
  }

  /*
  * Initializes the editing mode for a todo item at the given index.
  * 
  * This function sets up the necessary states to start editing a todo item.
  * It retrieves the todo item's text, highlights the todo item, and marks it as being edited.
  */
  const handleEditTodoInit = (index) => {
    const valueToBeEdited = todos[index]
    setTodoValue(valueToBeEdited.text)
    setHighlightedBlueTodo(index)
    setEditIndex(index)
    setIsEditing(true)
  }

  /*
   * Saves the edited todo item and updates the todo list.
   * 
   * This function updates the todo item with the new text if it has changed,
   * logs the edit action in the item's history, sorts the todo list by date,
   * and persists the updated todo list. It then resets the editing state.
   */
  const handleEditTodoSave = () => {
    const newTodos = [...todos]
    const previousText = newTodos[editIndex].text
  
    //  Check if the new todo value is different from the previous text
    if (todoValue !== previousText) {
      const updatedTodo = {
        ...newTodos[editIndex],
        text: todoValue,
        history: [
          ...newTodos[editIndex].history,
          {
            action: `Edited from "${previousText}" to "${todoValue}"`,
            date: getCurrentDate(), // Optionally keep track of edit date
          },
        ],
      }
  
      newTodos[editIndex] = updatedTodo
       // Sort the updated todo list by date and persist the changes
      setTodos(newTodos.sort((a, b) => new Date(a.date) - new Date(b.date)))
      persistData(newTodos)
    }
  
    setTodoValue('')
    setEditIndex(null)
    setHighlightedBlueTodo(null)
    setIsEditing(false)
  }

  /**
   * Loads the todos from localStorage on component mount.
   * 
   * This useEffect hook runs once when the component is mounted.
   * It checks if localStorage is available, retrieves the todos from localStorage,
   * parses them, sorts them by date, and sets the state with the sorted todos.
   */
  useEffect(() => {
    // Check if localStorage is available
    if (!localStorage) {
      return;
    }

    // Retrieve the todos from localStorage
    let localTodos = localStorage.getItem('todos')
    if (!localTodos) {
      return;
    }

    // Parse the todos and sort them by date
    localTodos = JSON.parse(localTodos).todos
    setTodos(localTodos.sort((a, b) => new Date(a.date) - new Date(b.date)))
  }, []) // Empty dependency array means this runs once on component mount

  /**
   * Handles closing the date picker when clicking outside of it.
   * 
   * This useEffect hook sets up an event listener for mouse down events.
   * If a click occurs outside the date picker, it hides the date picker.
   * The event listener is cleaned up when the component unmounts.
   */
  useEffect(() => {
    // Function to handle clicks outside the date picker
    const handleClickOutside = (event) => {
      // Check if the click was outside the date picker
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false)
      }
    };

    document.addEventListener('mousedown', handleClickOutside)
    // Cleanup the event listener when the component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <>
      <TodoInput
        handleAddTodos={handleAddTodos}
        todoValue={todoValue}
        setTodoValue={setTodoValue}
        handleEditTodoSave={handleEditTodoSave}
        editIndex={editIndex}
        setShowDatePicker={setShowDatePicker}
        selectedDate={selectedDate}
      />
      <p className={`error ${error ? '' : 'error-hidden'}`}>{error}</p>
      <TodoList
        todos={todos}
        highlightedRedTodo={highlightedRedTodo}
        highlightedBlueTodo={highlightedBlueTodo}
        handleDeleteTodo={handleDeleteTodo}
        handleEditTodoInit={handleEditTodoInit}
        toggleTaskCompletion={toggleTaskCompletion}
        isEditing={isEditing}
      />
      {showDatePicker && (
        <div ref={datePickerRef} className="date-picker-modal">
          <DatePickerComponent
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </div>
      )}
    </>
  )
}

export default App


