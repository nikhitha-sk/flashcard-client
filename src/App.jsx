import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import DeckList from './components/Deck/DeckList';
import CreateDeck from './components/Deck/CreateDeck';
import EditDeck from './components/Deck/EditDeck';
import CreateFlashcard from './components/Flashcard/CreateFlashcard';
import EditFlashcard from './components/Flashcard/EditFlashcard';
import FlashcardViewer from './components/Flashcard/FlashcardViewer';

function NavBar({ isAuthenticated, handleLogout }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-card border-b border-border">
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-foreground no-underline">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="4" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none" className="text-primary" />
            <rect x="8" y="10" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="var(--primary)" fillOpacity="0.15" className="text-primary" />
          </svg>
          <span className="text-lg font-semibold tracking-tight">FlashDeck</span>
        </Link>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                to="/decks"
                className={`px-4 py-2 rounded-lg text-sm font-medium no-underline transition-colors ${
                  isActive('/decks')
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                My Decks
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-secondary transition-colors cursor-pointer border-none bg-transparent"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`px-4 py-2 rounded-lg text-sm font-medium no-underline transition-colors ${
                  isActive('/login')
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground no-underline hover:opacity-90 transition-opacity"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="mb-6">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="10" width="36" height="28" rx="4" stroke="var(--primary)" strokeWidth="2.5" fill="none" />
          <rect x="22" y="26" width="36" height="28" rx="4" stroke="var(--primary)" strokeWidth="2.5" fill="var(--primary)" fillOpacity="0.1" />
        </svg>
      </div>
      <h1 className="text-4xl font-bold text-foreground tracking-tight mb-3 text-balance">
        Learn smarter with flashcards
      </h1>
      <p className="text-lg text-muted-foreground max-w-md mb-8 leading-relaxed text-pretty">
        Create decks, study with spaced repetition, and track your progress. The simple way to remember anything.
      </p>
      <div className="flex gap-3">
        <Link
          to="/signup"
          className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm no-underline hover:opacity-90 transition-opacity"
        >
          Get started
        </Link>
        <Link
          to="/login"
          className="px-6 py-3 rounded-lg bg-secondary text-secondary-foreground font-medium text-sm no-underline hover:bg-border transition-colors"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/auth/check', { withCredentials: true })
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));
  }, []);

  const handleLogout = () => {
    axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true })
      .then(() => setIsAuthenticated(false));
  };

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <NavBar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
        <main className="max-w-5xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/decks" /> : <HomePage />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/decks" /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/signup" element={isAuthenticated ? <Navigate to="/decks" /> : <Signup setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/decks" element={isAuthenticated ? <DeckList /> : <Navigate to="/login" />} />
            <Route path="/decks/create" element={isAuthenticated ? <CreateDeck /> : <Navigate to="/login" />} />
            <Route path="/decks/:deckId/edit" element={isAuthenticated ? <EditDeck /> : <Navigate to="/login" />} />
            <Route path="/decks/:deckId/flashcards/create" element={isAuthenticated ? <CreateFlashcard /> : <Navigate to="/login" />} />
            <Route path="/decks/:deckId/flashcards" element={isAuthenticated ? <FlashcardViewer /> : <Navigate to="/login" />} />
            <Route path="/decks/:deckId/flashcards/:flashcardId/edit" element={isAuthenticated ? <EditFlashcard /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
