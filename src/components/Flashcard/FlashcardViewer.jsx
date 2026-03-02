import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function FlashcardViewer() {
  const { deckId } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/flashcards/${deckId}`, { withCredentials: true })
      .then(response => {
        setFlashcards(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching flashcards:', error);
        setLoading(false);
      });
  }, [deckId]);

  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleDelete = async (flashcardId) => {
    if (window.confirm('Are you sure you want to delete this flashcard?')) {
      try {
        await axios.delete(`http://localhost:5000/api/flashcards/${flashcardId}`, { withCredentials: true });
        const updated = flashcards.filter(fc => fc._id !== flashcardId);
        setFlashcards(updated);
        if (currentIndex >= updated.length && currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
        }
      } catch (error) {
        alert('Error deleting flashcard');
      }
    }
  };

  const handleReview = async (quality) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/flashcards/${flashcards[currentIndex]._id}/review`, { quality }, { withCredentials: true });
      setFlipped(false);
      setFlashcards(flashcards.map(fc => fc._id === response.data._id ? response.data : fc));
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    } catch (error) {
      alert('Error submitting review');
    }
  };

  const getQualityLabel = (quality) => {
    if (quality === null || quality === undefined) return 'Not reviewed';
    if (quality === 1) return 'Hard';
    if (quality === 3) return 'Good';
    if (quality === 5) return 'Easy';
    return 'Unknown';
  };

  const getQualityColor = (quality) => {
    if (quality === 1) return 'text-destructive';
    if (quality === 3) return 'text-amber-600';
    if (quality === 5) return 'text-accent';
    return 'text-muted-foreground';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!flashcards.length) {
    return (
      <div className="max-w-lg mx-auto py-8">
        <Link to="/decks" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground no-underline hover:text-foreground transition-colors mb-6">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to decks
        </Link>
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border rounded-xl">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-muted-foreground mb-4">
            <rect x="8" y="12" width="32" height="24" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
            <line x1="16" y1="20" x2="32" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="16" y1="26" x2="28" y2="26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p className="text-muted-foreground font-medium mb-1">No flashcards yet</p>
          <p className="text-sm text-muted-foreground mb-4">Add your first flashcard to this deck</p>
          <Link
            to={`/decks/${deckId}/flashcards/create`}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm no-underline hover:opacity-90 transition-opacity"
          >
            Add a flashcard
          </Link>
        </div>
      </div>
    );
  }

  const card = flashcards[currentIndex];

  return (
    <div className="max-w-lg mx-auto py-8">
      <Link to="/decks" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground no-underline hover:text-foreground transition-colors mb-6">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to decks
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Study</h1>
        <span className="text-sm text-muted-foreground font-medium">
          {currentIndex + 1} / {flashcards.length}
        </span>
      </div>

      {/* Card info */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4 text-xs text-muted-foreground">
        <span>
          Last rating: <span className={`font-medium ${getQualityColor(card.lastQuality)}`}>{getQualityLabel(card.lastQuality)}</span>
        </span>
        <span>
          Next review: <span className="font-medium text-foreground">{new Date(card.nextReviewDate).toLocaleDateString()}</span>
        </span>
        <span>
          Interval: <span className="font-medium text-foreground">{card.interval}d</span>
        </span>
      </div>

      {/* Flip card */}
      <div
        className="w-full cursor-pointer mb-6"
        style={{ perspective: '1000px' }}
        onClick={() => setFlipped(!flipped)}
        role="button"
        tabIndex={0}
        aria-label={flipped ? 'Click to show question' : 'Click to show answer'}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setFlipped(!flipped); }}
      >
        <div
          className="relative w-full transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            minHeight: '220px',
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center bg-card border border-border rounded-xl p-8"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-3">Question</span>
            <p className="text-lg text-foreground text-center leading-relaxed">{card.front}</p>
          </div>
          {/* Back */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center bg-accent/5 border border-accent/30 rounded-xl p-8"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <span className="text-[10px] uppercase tracking-widest text-accent font-medium mb-3">Answer</span>
            <p className="text-lg text-foreground text-center leading-relaxed">{card.back}</p>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground mb-6">Click the card to flip</p>

      {/* Navigation */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex-1 py-2.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-border transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-none"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
          className="flex-1 py-2.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-border transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-none"
        >
          Next
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mb-6">
        <Link
          to={`/decks/${deckId}/flashcards/create`}
          className="flex-1 text-center py-2 rounded-lg bg-accent text-accent-foreground text-xs font-medium no-underline hover:opacity-90 transition-opacity"
        >
          Add Card
        </Link>
        <Link
          to={`/decks/${deckId}/flashcards/${card._id}/edit`}
          className="flex-1 text-center py-2 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium no-underline hover:bg-border transition-colors"
        >
          Edit
        </Link>
        <button
          onClick={() => handleDelete(card._id)}
          className="flex-1 py-2 rounded-lg bg-secondary text-destructive text-xs font-medium hover:bg-destructive/10 transition-colors cursor-pointer border-none"
        >
          Delete
        </button>
      </div>

      {/* Review buttons - show when flipped */}
      {flipped && (
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground text-center mb-3 font-medium">How well did you know this?</p>
          <div className="flex gap-2">
            <button
              onClick={() => handleReview(1)}
              className="flex-1 py-2.5 rounded-lg bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors cursor-pointer border-none"
            >
              Hard
            </button>
            <button
              onClick={() => handleReview(3)}
              className="flex-1 py-2.5 rounded-lg bg-amber-50 text-amber-700 text-sm font-medium hover:bg-amber-100 transition-colors cursor-pointer border-none"
            >
              Good
            </button>
            <button
              onClick={() => handleReview(5)}
              className="flex-1 py-2.5 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors cursor-pointer border-none"
            >
              Easy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FlashcardViewer;
