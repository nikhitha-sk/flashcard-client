import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function EditFlashcard() {
  const { deckId, flashcardId } = useParams();
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/flashcards/${deckId}`, { withCredentials: true })
      .then(response => {
        const flashcard = response.data.find(fc => fc._id === flashcardId);
        if (flashcard) {
          setFront(flashcard.front);
          setBack(flashcard.back);
        }
        setFetching(false);
      })
      .catch(error => {
        console.error('Error fetching flashcard:', error);
        setFetching(false);
      });
  }, [deckId, flashcardId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/flashcards/${flashcardId}`, { front, back }, { withCredentials: true });
      navigate(`/decks/${deckId}/flashcards`);
    } catch (error) {
      alert('Error updating flashcard');
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
      <Link to={`/decks/${deckId}/flashcards`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground no-underline hover:text-foreground transition-colors mb-6">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to flashcards
      </Link>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Edit flashcard</h1>
        <p className="text-sm text-muted-foreground mt-1">Update the question and answer</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="front" className="text-sm font-medium text-foreground">Front (Question)</label>
            <textarea
              id="front"
              placeholder="What is the question?"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              required
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow resize-vertical leading-relaxed"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="back" className="text-sm font-medium text-foreground">Back (Answer)</label>
            <textarea
              id="back"
              placeholder="What is the answer?"
              value={back}
              onChange={(e) => setBack(e.target.value)}
              required
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow resize-vertical leading-relaxed"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading || !front.trim() || !back.trim()}
              className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-none"
            >
              {loading ? 'Saving...' : 'Save changes'}
            </button>
            <Link
              to={`/decks/${deckId}/flashcards`}
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

export default EditFlashcard;
