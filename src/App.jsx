import React, { useState, useEffect } from 'react';
   import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
   import axios from 'axios';
   import Login from './components/Auth/Login';
   import Signup from './components/Auth/Signup';
   import DeckList from './components/Deck/DeckList';
   import CreateDeck from './components/Deck/CreateDeck';
   import EditDeck from './components/Deck/EditDeck';
   import CreateFlashcard from './components/Flashcard/CreateFlashcard';
   import EditFlashcard from './components/Flashcard/EditFlashcard';
   import FlashcardViewer from './components/Flashcard/FlashcardViewer';

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
         <div className="min-h-screen bg-gray-100">
           <nav className="bg-blue-600 p-4 text-white">
             <div className="container mx-auto flex justify-between">
               <Link to="/" className="text-xl font-bold">Flashcard App</Link>
               <div>
                 {isAuthenticated ? (
                   <>
                     <Link to="/decks" className="mr-4">My Decks</Link>
                     <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
                   </>
                 ) : (
                   <>
                     <Link to="/login" className="mr-4">Login</Link>
                     <Link to="/signup">Signup</Link>
                   </>
                 )}
               </div>
             </div>
           </nav>
           <div className="container mx-auto p-4">
             <Routes>
               <Route path="/" element={<h1 className="text-2xl">Welcome to the Flashcard Learning Tool</h1>} />
               <Route path="/login" element={isAuthenticated ? <Navigate to="/decks" /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
               <Route path="/signup" element={isAuthenticated ? <Navigate to="/decks" /> : <Signup setIsAuthenticated={setIsAuthenticated} />} />
               <Route path="/decks" element={isAuthenticated ? <DeckList /> : <Navigate to="/login" />} />
               <Route path="/decks/create" element={isAuthenticated ? <CreateDeck /> : <Navigate to="/login" />} />
               <Route path="/decks/:deckId/edit" element={isAuthenticated ? <EditDeck /> : <Navigate to="/login" />} />
               <Route path="/decks/:deckId/flashcards/create" element={isAuthenticated ? <CreateFlashcard /> : <Navigate to="/login" />} />
               <Route path="/decks/:deckId/flashcards" element={isAuthenticated ? <FlashcardViewer /> : <Navigate to="/login" />} />
               <Route path="/decks/:deckId/flashcards/:flashcardId/edit" element={isAuthenticated ? <EditFlashcard /> : <Navigate to="/login" />} />
             </Routes>
           </div>
         </div>
       </Router>
     );
   }

   export default App;