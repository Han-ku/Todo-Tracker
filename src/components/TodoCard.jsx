import React, {useState} from 'react';
import CheckButton from '../components/CheckButton';

export default function TodoCard(props) {
  const {children, className, handleDeleteTodo, index, handleEditTodoInit, 
        toggleTaskCompletion, todo, highlightedRedTodo, highlightedBlueTodo} 
  = props

  const [isTooltipVisible, setIsTooltipVisible] = useState(false)

  let tooltipTimeout

  const showTooltip = () => {
    clearTimeout(tooltipTimeout)
    setIsTooltipVisible(true)
  }

  const hideTooltip = () => {
    tooltipTimeout = setTimeout(() => {
      setIsTooltipVisible(false)
    }, 300) // Add a small delay to prevent flickering
  }

  // Groups history entries by date.
  const groupHistoryByDate = (history) => {
    const groupedHistory = {}
    history.forEach(entry => {
      // Extract the date part without the time
      const date = entry.date.split(' ')[0].slice(0, -1)

      if (!groupedHistory[date]) {
        groupedHistory[date] = []
      }

      groupedHistory[date].push(entry)
    })
    return groupedHistory
  }

  const groupedHistory = groupHistoryByDate(todo.history)

  return (
    <li className={`todoItem 
                    ${todo.completed ? 'completed' : ''}  
                    ${todo.text === highlightedRedTodo ? 'highlight_red' : ''} 
                    ${index === highlightedBlueTodo ? 'highlight_blue' : ''}
                    ${className}`}>
      <CheckButton
        checked={todo.completed}
        onToggle={() => toggleTaskCompletion(index)}
      />
      {children}      
      <div className='actionsContainer'>
        <button 
          style={{ position: 'relative' }} 
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
        >
          <i className="fa-solid fa-info"></i>
        </button>
        {isTooltipVisible && (
          <div 
            className="tooltip tooltip-visible" 
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
          >
            <h2>History</h2>
            <ul>
              {Object.entries(groupedHistory).map(([date, entries]) => (
                <React.Fragment key={date}>
                  <li><strong>{date}</strong></li>
                  {entries.map((entry, i) => (
                    <React.Fragment key={i}>
                      <li>{entry.action} at {entry.date.split(' ')[1]}</li>
                      {/* Add a horizontal rule between entries except after the last one */}
                      {i < entries.length - 1 && <hr />}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </ul>
          </div>
        )}
        <button onClick={() => {handleEditTodoInit(index)}}>
          <i className="fa-solid fa-pen-to-square"></i>
        </button>
        <button onClick={() => {handleDeleteTodo(index)}} >
          <i className="fa-regular fa-trash-can"></i>
        </button>
      </div>
    </li>
  )
}