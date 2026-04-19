import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Create a new task
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      const newTask = await res.json();
      setTasks([newTask, ...tasks]);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError('Failed to create task.');
    }
  };

  // Toggle completed status
  const handleToggleComplete = async (task) => {
    try {
      const res = await fetch(`${API_URL}/${task._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed }),
      });
      const updated = await res.json();
      setTasks(tasks.map((t) => (t._id === updated._id ? updated : t)));
    } catch (err) {
      setError('Failed to update task.');
    }
  };

  // Open edit modal
  const handleEditClick = (task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  // Save edited task
  const handleEditSave = async () => {
    if (!editTitle.trim()) return;
    try {
      const res = await fetch(`${API_URL}/${editingTask._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      });
      const updated = await res.json();
      setTasks(tasks.map((t) => (t._id === updated._id ? updated : t)));
      setEditingTask(null);
    } catch (err) {
      setError('Failed to update task.');
    }
  };

  // Delete a task
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      setError('Failed to delete task.');
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="app">
      <header className="app-header">
        <h1>📋 Task Manager</h1>
        <p className="subtitle">
          {tasks.length} task{tasks.length !== 1 ? 's' : ''} &mdash; {completedCount} completed
        </p>
      </header>

      {error && (
        <div className="error-banner">
          ⚠️ {error}
          <button onClick={() => setError('')} className="dismiss-btn">✕</button>
        </div>
      )}

      {/* Create Task Form */}
      <section className="form-section">
        <h2>Add New Task</h2>
        <form onSubmit={handleCreate} className="task-form">
          <input
            id="task-title"
            type="text"
            placeholder="Task title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            required
          />
          <textarea
            id="task-description"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea"
            rows={3}
          />
          <button type="submit" className="btn btn-primary" id="create-task-btn">
            + Add Task
          </button>
        </form>
      </section>

      {/* Task List */}
      <section className="tasks-section">
        <h2>Your Tasks</h2>
        {loading ? (
          <p className="loading">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="empty">No tasks yet. Add one above!</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task._id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                <div className="task-header">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task)}
                      id={`complete-${task._id}`}
                    />
                    <span className="task-title">{task.title}</span>
                  </label>
                  <span className={`badge ${task.completed ? 'badge-done' : 'badge-pending'}`}>
                    {task.completed ? 'Done' : 'Pending'}
                  </span>
                </div>
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
                <div className="task-footer">
                  <span className="task-date">
                    {new Date(task.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <div className="task-actions">
                    <button
                      onClick={() => handleEditClick(task)}
                      className="btn btn-edit"
                      id={`edit-${task._id}`}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="btn btn-delete"
                      id={`delete-${task._id}`}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Edit Modal */}
      {editingTask && (
        <div className="modal-overlay" onClick={() => setEditingTask(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Task</h2>
            <input
              id="edit-title-input"
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="input"
              placeholder="Task title *"
            />
            <textarea
              id="edit-description-input"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="textarea"
              placeholder="Description"
              rows={4}
            />
            <div className="modal-actions">
              <button onClick={handleEditSave} className="btn btn-primary" id="save-edit-btn">
                💾 Save
              </button>
              <button onClick={() => setEditingTask(null)} className="btn btn-cancel" id="cancel-edit-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
