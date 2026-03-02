import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function CreateDeck() {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/decks', { title }, { withCredentials: true });
      navigate('/decks');
    } catch (error) {
      alert('Error creating deck');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <Link to="/decks" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground no-underline hover:text-foreground transition-colors mb-6">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to decks
      </Link>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Create a new deck</h1>
        <p className="text-sm text-muted-foreground mt-1">Give your deck a name to get started</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-sm font-medium text-foreground">Deck title</label>
            <input
              id="title"
              type="text"
              placeholder="e.g. Biology Chapter 5"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-none"
            >
              {loading ? 'Creating...' : 'Create deck'}
            </button>
            <Link
              to="/decks"
              className="px-4 py-2.5 rounded-lg bg-secondary text-secondary-foreground font-medium text-sm no-underline hover:bg-border transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateDeck;
