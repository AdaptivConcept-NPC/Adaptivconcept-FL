import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './App.css';

// Components
import BackgroundVideo from './components/BackgroundVideo';
import BackgroundWallpaper from './components/BackgroundWallpaper';
import Navbar from './components/layout/Navbar';
import Footer from './components/Footer';

// context
import { ThemeProvider } from './context/ThemeContext';

// Pages
import Home from './pages/Home';
import ProjectBoard from './pages/ProjectBoard';
import ProjectDetail from './pages/ProjectDetail';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import TechWall from './pages/TechWall';
import OpenResume from './pages/OpenResume';
import Admin from './pages/Admin';
import LabDetail from './pages/LabDetail';

function App() {
  const useVideoBackground = false; // Toggle this to switch between video and static wallpaper

  return (
    <ThemeProvider>
      <Router>
      <div className="App noselect h-screen overflow-y-scroll">
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
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/tech-wall" element={<TechWall />} />
              <Route path="/resume" element={<OpenResume />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/labs/:id" element={<LabDetail />} />
            </Routes>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </Router>
    </ThemeProvider>
  );
}

export default App;