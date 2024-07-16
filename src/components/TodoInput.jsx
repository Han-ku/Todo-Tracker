import React from 'react';

export default function TodoInput(props) {
    const { handleAddTodos, todoValue, setTodoValue, handleEditTodoSave, editIndex, setShowDatePicker, selectedDate } = props

    const handleSubmit = () => {
      if (editIndex !== null) {
        handleEditTodoSave()
      } else {
        handleAddTodos(todoValue)
      }
      setTodoValue('')
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        handleSubmit()
      }
    }

    return (
        <header>
          <input 
            value={todoValue} 
            onChange={(e) => setTodoValue(e.target.value)} 
            placeholder="Enter todo..." 
            onKeyDown={handleKeyDown}
          />

          <button 
            className='btn_calendar' 
            onClick={() => setShowDatePicker(true)}
          >
            <i className="fa-solid fa-calendar-days"></i>
            {selectedDate && <i className="fa-solid fa-check-circle"></i>}
          </button>

          <button onClick={handleSubmit}>
            {editIndex !== null ? 'Save' : 'Add'}
          </button>
        </header>
    )
}