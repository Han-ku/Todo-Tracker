import React from 'react';
import TodoCard from '../components/TodoCard';

export default function TodoList(props) {
  const { todos, highlightedRedTodo, highlightedBlueTodo } = props

  // Function to group todos by their creation date
  const groupTodosByDate = (todos) => {
    const groupedTodos = {}
    todos.forEach((todo) => {
      const date = todo.date.split(',')[0] // Use the creation date for grouping
      if (!groupedTodos[date]) {
        groupedTodos[date] = []
      }
      groupedTodos[date].push(todo)
    })
    return groupedTodos
  }

  const groupedTodos = groupTodosByDate(todos)
  const today = new Date().toLocaleDateString()
  const todayTodos = groupedTodos[today] || []

  return (
    <div className='main'>
      {/* Section for today's tasks */}
      <div className='today_todos_container'>
        <h3 className='date_title'>Today</h3>
        <ul className='main'>
          {todayTodos.length > 0 && todayTodos.some(todo => todo.text) ? (
            todayTodos.map((todo, index) => (
              todo.text && (  // Display task only if it has text
                <TodoCard
                  {...props}
                  key={todo.text + index}
                  className={todo.text === highlightedRedTodo ? 'highlight_red' : ''}
                  todo={todo}
                  index={todos.indexOf(todo)}
                  highlightedRedTodo={highlightedRedTodo}
                  highlightedBlueTodo={highlightedBlueTodo}
                >
                  <p>{todo.text}</p>
                </TodoCard>
              )
            ))
          ) : (
            <li>No tasks for today</li>
          )}
        </ul>
      </div>

      {/* Section for other tasks grouped by date */}
      {Object.keys(groupedTodos)
        .filter(date => date !== today)
        .sort((a, b) => new Date(a) - new Date(b)) // Sort dates in ascending order
        .map((date) => (
          groupedTodos[date].some(todo => todo.text) && ( // Only display dates with non-empty tasks
            <div className='date_todos_container' key={date}>
              <h3 className='date_title'>{date}</h3>
              <ul className='main'>
                {groupedTodos[date].filter(todo => todo.text).map((todo, index) => (
                  <TodoCard
                    {...props}
                    key={todo.text + index}
                    className={todo.text === highlightedRedTodo ? 'highlight_red' : ''}
                    todo={todo}
                    index={todos.indexOf(todo)}
                    highlightedRedTodo={highlightedRedTodo}
                    highlightedBlueTodo={highlightedBlueTodo}
                  >
                    <p>{todo.text}</p>
                  </TodoCard>
                ))}
              </ul>
            </div>
          )
        ))}
    </div>
  )
}
