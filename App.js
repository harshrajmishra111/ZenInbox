import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortByDate, setSortByDate] = useState(false);
  const [pages, setPages] = useState({ urgent: 1, important: 1, later: 1 });
  const TASKS_PER_PAGE = 5;

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks');
      setTasks(response.data);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Please authenticate with Google.');
      } else {
        setError('Failed to load tasks.');
      }
      setLoading(false);
    }
  };

  const handleAuth = async () => {
    try {
      const response = await axios.get('http://localhost:5000/auth');
      window.location.href = response.data.authUrl;
    } catch (err) {
      setError('Authentication failed.');
    }
  };

  const getTimeLeft = (deadline) => {
    const now = new Date();
    const diff = new Date(deadline) - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    return days > 0 ? `${days} days` : `${hours} hours`;
  };

  const filterAndSortTasks = (category) => {
    let filtered = tasks.filter(task => task.priority === category);
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.summary.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortByDate) {
      filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    }
    return filtered;
  };

  const paginateTasks = (tasks, page) => {
    const start = (page - 1) * TASKS_PER_PAGE;
    return tasks.slice(start, start + TASKS_PER_PAGE);
  };

  const urgentTasks = filterAndSortTasks('🔴 Urgent');
  const importantTasks = filterAndSortTasks('🟡 Important');
  const laterTasks = filterAndSortTasks('⚪ Later');

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={handleAuth} className="auth-button">Authenticate</button>
      </div>
    );
  }

  return (
    <div className="App">
      <nav className="navbar">
        <h1>ZenInBox</h1>
        <div className="navbar-controls">
          <div className="search-container">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar"
            />
          </div>
          <button onClick={() => setSortByDate(!sortByDate)} className="sort-button">
            {sortByDate ? 'Unsort' : 'Sort by Date'}
          </button>
        </div>
      </nav>
      <main>
        {tasks.length === 0 ? (
          <div className="no-tasks">
            <p>No tasks found</p>
          </div>
        ) : (
          <>
            <TaskSection
              title="🔴 Urgent"
              tasks={urgentTasks}
              page={pages.urgent}
              setPage={(page) => setPages({ ...pages, urgent: page })}
              getTimeLeft={getTimeLeft}
            />
            <TaskSection
              title="🟡 Important"
              tasks={importantTasks}
              page={pages.important}
              setPage={(page) => setPages({ ...pages, important: page })}
              getTimeLeft={getTimeLeft}
            />
            <TaskSection
              title="⚪ Later"
              tasks={laterTasks}
              page={pages.later}
              setPage={(page) => setPages({ ...pages, later: page })}
              getTimeLeft={getTimeLeft}
            />
          </>
        )}
      </main>
    </div>
  );
}

function TaskSection({ title, tasks, page, setPage, getTimeLeft }) {
  const TASKS_PER_PAGE = 5;
  const totalPages = Math.ceil(tasks.length / TASKS_PER_PAGE);
  const displayedTasks = paginateTasks(tasks, page);

  return (
    <section className="task-section">
      <h2>{title} ({tasks.length})</h2>
      {tasks.length === 0 ? (
        <p>No tasks</p>
      ) : (
        <>
          <ul className="task-list">
            {displayedTasks.map((task, index) => (
              <TaskCard key={index} task={task} getTimeLeft={getTimeLeft} />
            ))}
          </ul>
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage(page > 1 ? page - 1 : 1)}
                disabled={page === 1}
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function TaskCard({ task, getTimeLeft }) {
  return (
    <li className="task-card" style={{ '--priority-color': task.priority === '🔴 Urgent' ? '#ff4d4d' : task.priority === '🟡 Important' ? '#ffcc00' : '#40c4ff' }}>
      <div className="task-header">
        <span className="priority">{task.priority}</span>
        <span className="event-type">{task.eventType}</span>
      </div>
      <h3>{task.subject}</h3>
      <div className="task-details">
        <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleString()} <span className="time-left">({getTimeLeft(task.deadline)} remaining)</span></p>
        <p><strong>Urgency:</strong> {task.urgency}</p>
        <p><strong>Importance:</strong> {task.importance}</p>
        <p><strong>Score:</strong> {task.score}</p>
        <p><strong>Action:</strong> {task.registrationLink !== 'none' ? (
          <a href={task.registrationLink} target="_blank" rel="noopener noreferrer" className="action-link">Take Action</a>
        ) : 'None'}</p>
        <p><strong>Summary:</strong> {task.summary}</p>
      </div>
    </li>
  );
}

function paginateTasks(tasks, page) {
  const TASKS_PER_PAGE = 5;
  const start = (page - 1) * TASKS_PER_PAGE;
  return tasks.slice(start, start + TASKS_PER_PAGE);
}

export default App;