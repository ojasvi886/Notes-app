import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/notes');
      if (!res.ok) throw new Error('Failed to load notes');
      const data = await res.json();
      setNotes(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setEditingId(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { title, content };
      const res = await fetch(editingId ? `/api/notes/${editingId}` : '/api/notes', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Save failed');
      resetForm();
      fetchNotes();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleEdit = (note) => {
    setEditingId(note.id);
    setTitle(note.title || '');
    setContent(note.content || '');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      fetchNotes();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="container">
      <h1>Notes</h1>

      <form className="note-form" onSubmit={handleSubmit}>
        <div className="field">
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title" />
        </div>
        <div className="field">
          <label>Content</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write something..." />
        </div>
        <div className="actions">
          <button type="submit">{editingId ? 'Update' : 'Add'} Note</button>
          {editingId && (
            <button type="button" className="secondary" onClick={resetForm}>Cancel</button>
          )}
        </div>
        {error && <div className="error">{error}</div>}
      </form>

      <div className="list-header">
        <span>All notes</span>
        {loading && <span className="muted">Loading…</span>}
      </div>
      <ul className="notes-list">
        {notes.length === 0 && !loading && <li className="muted">No notes yet.</li>}
        {notes.map((n) => (
          <li key={n.id} className="note-item">
            <div className="note-main">
              <div className="note-title">{n.title}</div>
              <div className="note-content">{n.content}</div>
            </div>
            <div className="note-actions">
              <button onClick={() => handleEdit(n)}>Edit</button>
              <button className="danger" onClick={() => handleDelete(n.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
