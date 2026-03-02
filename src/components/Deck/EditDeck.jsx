import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function EditDeck() {
  const { deckId } = useParams();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/decks', { withCredentials: true })
      .then(response => {
        const deck = response.data.find(d => d._id === deckId);
        if (deck) setTitle(deck.title);
        setFetching(false);
      })
      .catch(error => {
        console.error('Error fetching deck:', error);
        setFetching(false);
      });
  }, [deckId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/decks/${deckId}`, { title }, { withCredentials: true });
      navigate('/decks');
    } catch (error) {
      alert('Error updating deck');
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <Link to="/decks" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground no-underline hover:text-foreground transition-colors mb-6">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to decks
      </Link>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Edit deck</h1>
        <p className="text-sm text-muted-foreground mt-1">Update your deck title</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-sm font-medium text-foreground">Deck title</label>
            <input
              id="title"
              type="text"
              placeholder="Deck Title"
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
              {loading ? 'Saving...' : 'Save changes'}
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

export default EditDeck;
