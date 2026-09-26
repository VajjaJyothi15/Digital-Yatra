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

    setLoading(true);
    setIsOpen(true);

    // 300ms debounce to avoid spamming requests on every keystroke
    const timer = setTimeout(async () => {
      try {
        const results = await getDestinationSuggestions(trimmed);
        setSuggestions(results);
      } catch (err) {
        console.error('Error in search suggestions hook:', err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close suggestion dropdown
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
