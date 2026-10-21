import { useEffect, useMemo, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'devops.todo-items'

const defaultTodos = [
  { id: 1, text: 'Set up the project', completed: true },
  { id: 2, text: 'Build a simple todo list', completed: false },
  { id: 3, text: 'Commit the starter app to git', completed: false },
]

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = window.localStorage.getItem(STORAGE_KEY)

    if (!savedTodos) {
      return defaultTodos
    }

    try {
      const parsedTodos = JSON.parse(savedTodos)

      return Array.isArray(parsedTodos) ? parsedTodos : defaultTodos
    } catch {
      return defaultTodos
    }
  })
  const [text, setText] = useState('')

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const remainingCount = useMemo(
    () => todos.filter((todo) => !todo.completed).length,
    [todos],
  )

  const completedCount = todos.length - remainingCount

  const addTodo = (event) => {
    event.preventDefault()

    const nextText = text.trim()

    if (!nextText) {
      return
    }

    setTodos((currentTodos) => [
      ...currentTodos,
      {
        id: Date.now(),
        text: nextText,
        completed: false,
      },
    ])
    setText('')
  }

  const toggleTodo = (id) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }

  const removeTodo = (id) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos((currentTodos) => currentTodos.filter((todo) => !todo.completed))
  }

  return (
    <main className="app-shell">
      <section className="todo-card">
        <div className="hero-copy">
          <p className="eyebrow">React starter</p>
          <h1>Todo App - Kubernetes v2</h1>
          <p className="subtitle">
            A tiny app for adding tasks, checking them off, and keeping the list
            clean.
          </p>
        </div>

        <form className="todo-form" onSubmit={addTodo}>
          <input
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Add a task and press Enter"
            aria-label="New task"
          />
          <button type="submit">Add task</button>
        </form>

        <div className="stats" aria-label="Todo statistics">
          <span>{remainingCount} open</span>
          <span>{completedCount} done</span>
          <span>{todos.length} total</span>
        </div>

        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className={todo.completed ? 'completed' : ''}>
              <label>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span>{todo.text}</span>
              </label>
              <button type="button" onClick={() => removeTodo(todo.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>

        <div className="actions">
          <button type="button" onClick={clearCompleted}>
            Clear completed
          </button>
        </div>
      </section>
    </main>
  )
}

export default App
