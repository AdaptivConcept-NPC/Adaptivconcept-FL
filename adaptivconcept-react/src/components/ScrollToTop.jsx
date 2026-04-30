import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // We find the main scrollable container. 
    // In this app, it's the .App div which has overflow-y-scroll
    const scrollContainer = document.querySelector('.App');
    
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    } else {
      // Fallback to window just in case
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
