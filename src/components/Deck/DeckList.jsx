import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function DeckList() {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/decks', { withCredentials: true })
      .then(response => {
        setDecks(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching decks:', error);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (deckId) => {
    if (window.confirm('Are you sure you want to delete this deck? This cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:5000/api/decks/${deckId}`, { withCredentials: true });
        setDecks(decks.filter(deck => deck._id !== deckId));
      } catch (error) {
        alert('Error deleting deck');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">My Decks</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {decks.length} {decks.length === 1 ? 'deck' : 'decks'} in your library
          </p>
        </div>
        <Link
          to="/decks/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm no-underline hover:opacity-90 transition-opacity"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          New Deck
        </Link>
      </div>

      {decks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border rounded-xl">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-muted-foreground mb-4">
            <rect x="6" y="8" width="28" height="20" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
            <rect x="14" y="20" width="28" height="20" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
          <p className="text-muted-foreground font-medium mb-1">No decks yet</p>
          <p className="text-sm text-muted-foreground mb-4">Create your first deck to start studying</p>
          <Link
            to="/decks/create"
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm no-underline hover:opacity-90 transition-opacity"
          >
            Create your first deck
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {decks.map(deck => (
            <div key={deck._id} className="bg-card border border-border rounded-xl p-5 flex flex-col hover:border-primary/30 hover:shadow-sm transition-all">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex-1">{deck.title}</h3>
              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/decks/${deck._id}/flashcards`}
                  className="flex-1 min-w-0 text-center px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium no-underline hover:opacity-90 transition-opacity"
                >
                  Study
                </Link>
                <Link
                  to={`/decks/${deck._id}/flashcards/create`}
                  className="flex-1 min-w-0 text-center px-3 py-2 rounded-lg bg-accent text-accent-foreground text-xs font-medium no-underline hover:opacity-90 transition-opacity"
                >
                  Add Card
                </Link>
                <Link
                  to={`/decks/${deck._id}/edit`}
                  className="px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium no-underline hover:bg-border transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(deck._id)}
                  className="px-3 py-2 rounded-lg bg-secondary text-destructive text-xs font-medium hover:bg-destructive/10 transition-colors cursor-pointer border-none"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DeckList;
