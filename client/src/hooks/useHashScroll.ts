import { useEffect } from 'react';
import { useLocation } from 'wouter';

export function useHashScroll() {
  const [location] = useLocation();

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      }
    };

    scrollToHash();

    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, [location]);
}

export function scrollToAnchor(href: string) {
  const hashIndex = href.indexOf('#');
  if (hashIndex === -1) return false;
  
  const hash = href.substring(hashIndex + 1);
  const currentPath = window.location.pathname;
  const targetPath = href.substring(0, hashIndex) || currentPath;
  
  if (currentPath === targetPath || targetPath === '') {
    const element = document.getElementById(hash);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', href);
      return true;
    }
  }
  return false;
}
