import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './App.css';

// Components
import BackgroundVideo from './components/BackgroundVideo';
import BackgroundWallpaper from './components/BackgroundWallpaper';
import Navbar from './components/layout/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import ProjectBoard from './pages/ProjectBoard';
import ProjectDetail from './pages/ProjectDetail';

function App() {
  const useVideoBackground = false; // Toggle this to switch between video and static wallpaper

  return (
    <Router>
      <div className="App noselect">
        {/* Assets & Dependencies */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700&family=Comfortaa:wght@400;600;700&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />


        {useVideoBackground ? (
          <BackgroundVideo />
        ) : (
          <BackgroundWallpaper imageUrl="/media/thabang_vector_wallpaper.png" />
        )}
        
        <Navbar />

        <main className="content-wrapper">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<ProjectBoard />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
            </Routes>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;