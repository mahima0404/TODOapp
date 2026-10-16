import React, { useState } from 'react';

const DEMO_EMAIL = 'student@example.com';
const DEMO_PASSWORD = 'password123';
const STORAGE_KEY = 'daymark-todos';
const FILTERS = ['All', 'Active', 'Completed'];

function readTodos() {
  try {
    const savedTodos = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(savedTodos) ? savedTodos : [];
  } catch {
    return [];
  }
}

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      setError('That email and password don’t match. Try the demo credentials below.');
      return;
    }

    onLogin();
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <a className="brand" href="#" aria-label="Daymark home">
          <span className="brand-mark" aria-hidden="true">d</span>
          <span>daymark</span>
        </a>
        <div className="login-intro">
          <p className="eyebrow">A little more focus</p>
          <h1 id="login-title">Welcome back.</h1>
          <p>Sign in to pick up right where you left off.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="email">Email address</label>
          <input
            autoComplete="username"
            id="email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            type="email"
            value={email}
          />
          <label htmlFor="password">Password</label>
          <input
            autoComplete="current-password"
            id="password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            type="password"
            value={password}
          />
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-primary login-button" type="submit">
            Sign in <span aria-hidden="true">→</span>
          </button>
        </form>
        <aside className="demo-hint">
          <span className="hint-dot" aria-hidden="true" />
          <div>
            <strong>Just looking around?</strong>
            <p>Use <b>student@example.com</b> and <b>password123</b></p>
          </div>
        </aside>
      </section>
      <p className="login-footnote">Make room for what matters.</p>
    </main>
  );
}

function TodoPage({ onLogout }) {
  const [todos, setTodos] = useState(readTodos);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('All');

  function updateTodos(nextTodos) {
    setTodos(nextTodos);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTodos));
  }

  function addTodo(event) {
    event.preventDefault();
    const title = newTodo.trim();
    if (!title) return;

    updateTodos([{ id: crypto.randomUUID(), title, completed: false }, ...todos]);
    setNewTodo('');
  }

  function toggleTodo(id) {
    updateTodos(todos.map((todo) => (
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )));
  }

  function deleteTodo(id) {
    updateTodos(todos.filter((todo) => todo.id !== id));
  }

  const visibleTodos = todos.filter((todo) => {
    if (filter === 'Active') return !todo.completed;
    if (filter === 'Completed') return todo.completed;
    return true;
  });
  const remainingCount = todos.filter((todo) => !todo.completed).length;

  return (
    <main className="todo-page">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Daymark home">
          <span className="brand-mark" aria-hidden="true">d</span>
          <span>daymark</span>
        </a>
        <button className="button button-quiet logout-button" onClick={onLogout} type="button">
          <span aria-hidden="true">↗</span> Log out
        </button>
      </header>

      <section className="todo-content" aria-labelledby="todo-title">
        <div className="todo-heading">
          <p className="eyebrow"><span className="heading-sparkle" aria-hidden="true">✳</span> YOUR SPACE</p>
          <h1 id="todo-title">Make today count.</h1>
          <p>A clear mind starts with a clear list.</p>
        </div>

        <form className="add-form" onSubmit={addTodo}>
          <span className="add-icon" aria-hidden="true">＋</span>
          <label className="visually-hidden" htmlFor="new-todo">Add a todo</label>
          <input
            id="new-todo"
            onChange={(event) => setNewTodo(event.target.value)}
            placeholder="What needs your attention?"
            value={newTodo}
          />
          <button className="button button-primary add-button" disabled={!newTodo.trim()} type="submit">
            Add task
          </button>
        </form>

        <section className="list-card" aria-label="Todo list">
          <div className="list-toolbar">
            <div className="filter-tabs" aria-label="Filter todos" role="tablist">
              {FILTERS.map((item) => (
                <button
                  aria-selected={filter === item}
                  className={`filter-tab${filter === item ? ' is-selected' : ''}`}
                  key={item}
                  onClick={() => setFilter(item)}
                  role="tab"
                  type="button"
                >
                  {item}
                  {item === 'All' && <span className="filter-count">{todos.length}</span>}
                </button>
              ))}
            </div>
            <span className="remaining-count">
              <strong>{remainingCount}</strong> {remainingCount === 1 ? 'task left' : 'tasks left'}
            </span>
          </div>

          {visibleTodos.length > 0 ? (
            <ul className="todo-list">
              {visibleTodos.map((todo) => (
                <li className={`todo-item${todo.completed ? ' is-completed' : ''}`} key={todo.id}>
                  <label className="todo-label">
                    <input
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      type="checkbox"
                    />
                    <span className="custom-check" aria-hidden="true">{todo.completed ? '✓' : ''}</span>
                    <span className="todo-title">{todo.title}</span>
                  </label>
                  <button
                    aria-label={`Delete ${todo.title}`}
                    className="delete-button"
                    onClick={() => deleteTodo(todo.id)}
                    type="button"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <span className="empty-icon" aria-hidden="true">{filter === 'Completed' ? '✓' : '✳'}</span>
              <h2>{filter === 'Completed' ? 'Nothing checked off yet' : filter === 'Active' ? 'All caught up' : 'A fresh start'}</h2>
              <p>
                {filter === 'Completed'
                  ? 'Finished tasks will find their home here.'
                  : filter === 'Active'
                    ? 'You have no tasks waiting. Enjoy the breathing room.'
                    : 'Add a task above and give your day some direction.'}
              </p>
            </div>
          )}
          <footer className="list-footer">
            <span>{todos.length === 0 ? 'Your list is ready when you are' : `${todos.length} ${todos.length === 1 ? 'task' : 'tasks'} in your list`}</span>
            <span className="footer-decoration" aria-hidden="true">✳ &nbsp; take it one thing at a time</span>
          </footer>
        </section>
        <p className="privacy-note"><span aria-hidden="true">⌑</span> Your tasks are saved on this device.</p>
      </section>
    </main>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => sessionStorage.getItem('daymark-authenticated') === 'true',
  );

  function logIn() {
    sessionStorage.setItem('daymark-authenticated', 'true');
    setIsLoggedIn(true);
  }

  function logOut() {
    sessionStorage.removeItem('daymark-authenticated');
    setIsLoggedIn(false);
  }

  return isLoggedIn ? <TodoPage onLogout={logOut} /> : <LoginPage onLogin={logIn} />;
}
