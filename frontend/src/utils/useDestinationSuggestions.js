import { useState, useEffect, useRef } from 'react';
import { getDestinationSuggestions } from './suggestionService';

export function useDestinationSuggestions(searchQuery) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const trimmed = (searchQuery || '').trim();
    if (!trimmed) {
      setSuggestions([]);
      setIsOpen(false);
      setLoading(false);
      return;
    }

    setIsOpen(true);
    setLoading(true);

    let isMounted = true;

    // Fetch suggestions (instant static results + non-blocking API enrichment)
    getDestinationSuggestions(trimmed)
      .then((results) => {
        if (isMounted) {
          setSuggestions(results);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Error fetching suggestions:', err);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [searchQuery]);

  // Click outside listener to close suggestion dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return {
    suggestions,
    loading,
    isOpen,
    setIsOpen,
    containerRef
  };
}
