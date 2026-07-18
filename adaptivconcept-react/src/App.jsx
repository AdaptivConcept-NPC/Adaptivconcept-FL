import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './App.css';

// Components
import BackgroundVideo from './components/BackgroundVideo';
import BackgroundWallpaper from './components/BackgroundWallpaper';
import Navbar from './components/layout/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import GeometricBackground from './components/GeometricBackground';
import GlobalFAB from './components/layout/GlobalFAB';

// context
import { ThemeProvider } from './context/ThemeContext';
import { ArcadeProvider } from './context/ArcadeContext';
import InvoiceAuthProvider from './context/InvoiceAuthContext';

// Protected route guard
import ProtectedRoute from './components/ProtectedRoute';

// Invoicing pages
import InvoiceLogin from './pages/invoicing/InvoiceLogin';
import InvoiceDashboard from './pages/invoicing/InvoiceDashboard';
import ClientManager from './pages/invoicing/ClientManager';
import InvoiceEditor from './pages/invoicing/InvoiceEditor';
import InvoiceDetail from './pages/invoicing/InvoiceDetail';
import InvoicePublicView from './pages/invoicing/InvoicePublicView';

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
import Contact from './pages/Contact';
import GamingArcade from './pages/GamingArcade';
// Individual Games
import DigiArch from './pages/games/DigiArch';
import LogicGrid from './pages/games/LogicGrid';
import ChromaSync from './pages/games/ChromaSync';
import PatternForge from './pages/games/PatternForge';
import NodeFlow from './pages/games/NodeFlow';


function App() {
  const useVideoBackground = false; // Toggle this to switch between video and static wallpaper

  return (
    <ArcadeProvider>
      <ThemeProvider>
        <InvoiceAuthProvider>
        <Router>
          <ScrollToTop />
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
            <BackgroundWallpaper />
          )}

          <GeometricBackground />
          
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
                <Route path="/arcade" element={<GamingArcade />} />
                <Route path="/arcade/digiarch" element={<DigiArch />} />
                <Route path="/arcade/logicgrid" element={<LogicGrid />} />
                <Route path="/arcade/chromasync" element={<ChromaSync />} />
                <Route path="/arcade/patternforge" element={<PatternForge />} />
                <Route path="/arcade/nodeflow" element={<NodeFlow />} />
                <Route path="/contact" element={<Contact />} />

                {/* --- Invoicing module --- */}
                {/* Public routes (no auth) */}
                <Route path="/invoicing/login" element={<InvoiceLogin />} />
                <Route path="/invoicing/share/:token" element={<InvoicePublicView />} />
                {/* Protected routes */}
                <Route path="/invoicing" element={<ProtectedRoute><InvoiceDashboard /></ProtectedRoute>} />
                <Route path="/invoicing/clients" element={<ProtectedRoute><ClientManager /></ProtectedRoute>} />
                <Route path="/invoicing/new" element={<ProtectedRoute><InvoiceEditor /></ProtectedRoute>} />
                <Route path="/invoicing/:id/edit" element={<ProtectedRoute><InvoiceEditor /></ProtectedRoute>} />
                <Route path="/invoicing/:id" element={<ProtectedRoute><InvoiceDetail /></ProtectedRoute>} />

              </Routes>
            </AnimatePresence>
          </main>

          <Footer />
          <GlobalFAB />
        </div>
      </Router>
        </InvoiceAuthProvider>
      </ThemeProvider>
    </ArcadeProvider>
  );
}

export default App;