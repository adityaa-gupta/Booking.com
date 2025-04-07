import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import ApiService from '../_lib/services/ApiService';
import Link from 'next/link';

const SearchComp = ({ isMobile = false, onResultClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const abortControllerRef = useRef(null);
  const searchRef = useRef(null);

  const fetchEvents = async () => {
    if (!searchTerm.trim()) {
      setEvents([]);
      setShowResults(false);
      return;
    }

    try {
      setIsLoading(true);

      // Cancel previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new AbortController
      abortControllerRef.current = new AbortController();

      const response = await ApiService.fetchEvents(
        searchTerm,
        abortControllerRef.current.signal
      );
      setEvents(response.content || []);
      setShowResults(true);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching events:', error);
        setEvents([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle outside clicks to close search results
  useEffect(() => {
    if (!isMobile) {
      const handleClickOutside = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
          setShowResults(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isMobile]);

  useEffect(() => {
    if (searchTerm) {
      fetchEvents();
    } else {
      setEvents([]);
      setShowResults(false);
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [searchTerm]);

  const handleResultClick = (eventId) => {
    setSearchTerm('');
    setShowResults(false);
    if (onResultClick) onResultClick();
  };

  return (
    <div className={`relative ${isMobile ? 'w-full' : ''}`} ref={searchRef}>
      {/* Desktop Search Bar */}
      {!isMobile && (
        <div className="hidden md:flex items-center border border-[#255F38] rounded-full overflow-hidden shadow-sm">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                fetchEvents();
              }
            }}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            autoCapitalize="off"
            className="px-4 py-2 w-48 lg:w-80 text-[#255F38] border-none outline-none"
            placeholder="Search for events, movies..."
          />
          <button className="p-2 px-4 transition-colors" onClick={fetchEvents}>
            <FaSearch size={18} className="text-[#99BC85]" />
          </button>
        </div>
      )}

      {/* Mobile Search Bar */}
      {isMobile && (
        <div className="flex items-center border border-[#255F38] rounded-full overflow-hidden shadow-sm w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                fetchEvents();
              }
            }}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            autoCapitalize="off"
            className="px-4 py-2.5 w-full text-[#255F38] border-none outline-none"
            placeholder="Search for events, movies..."
          />
          <button
            className="p-2 px-4 bg-[#99BC85] hover:bg-[#7da668] transition-colors"
            onClick={fetchEvents}
          >
            <FaSearch size={18} className="text-white" />
          </button>
        </div>
      )}

      {/* Search Results - Desktop */}
      {!isMobile && showResults && events.length > 0 && (
        <div className="absolute z-30 mt-3 w-full bg-white border border-[#99BC85] rounded-lg shadow-xl max-h-[350px] overflow-y-auto">
          <div className="p-3">
            <h3 className="text-[#255F38] font-semibold mb-3 border-b border-[#e9f5dc] pb-2 text-lg sticky top-0 bg-white">
              Search Results
            </h3>
            <div className="grid gap-3">
              {events.map((event) => (
                <div
                  key={event.eventId}
                  className="flex p-3 bg-[#f9fcf7] hover:bg-[#f0f9e8] rounded-lg cursor-pointer transition-all duration-200 border border-[#e9f5dc] hover:border-[#99BC85] hover:shadow-md"
                >
                  <div className="h-16 w-16 min-w-16 bg-[#e9f5dc] rounded-md overflow-hidden mr-3 shadow-sm">
                    {event.eventImageUrl && (
                      <img
                        src={event.eventImageUrl}
                        alt={event.eventName}
                        className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#255F38] truncate text-base">
                      {event.eventName}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {event.eventDescription &&
                      event.eventDescription.length > 50
                        ? `${event.eventDescription.substring(0, 50)}...`
                        : event.eventDescription}
                    </p>
                    <div className="mt-1 flex justify-end">
                      <Link
                        href={`/event/${event.eventId}`}
                        onClick={() => handleResultClick(event.eventId)}
                        className="text-xs font-medium text-[#7da668] hover:underline"
                      >
                        View event
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Results - Mobile */}
      {isMobile && showResults && events.length > 0 && (
        <div className="mt-3 w-full bg-white border border-[#99BC85] rounded-lg shadow-lg max-h-[350px] overflow-y-auto">
          <div className="p-3">
            <h3 className="text-[#255F38] font-semibold mb-2 border-b border-[#e9f5dc] pb-2 sticky top-0 bg-white">
              Search Results
            </h3>
            <div className="grid gap-2">
              {events.map((event) => (
                <div
                  key={event.eventId}
                  className="flex p-2 bg-[#f9fcf7] hover:bg-[#f0f9e8] rounded-lg cursor-pointer transition-all duration-200 border border-[#e9f5dc]"
                >
                  <div className="h-14 w-14 min-w-14 bg-[#e9f5dc] rounded-md overflow-hidden mr-2 shadow-sm">
                    {event.eventImageUrl && (
                      <img
                        src={event.eventImageUrl}
                        alt={event.eventName}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-[#255F38] truncate">
                      {event.eventName}
                    </h4>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {event.eventDescription &&
                      event.eventDescription.length > 50
                        ? `${event.eventDescription.substring(0, 50)}...`
                        : event.eventDescription}
                    </p>
                    <div className="mt-1 flex justify-end">
                      <Link
                        href={`/event/${event.eventId}`}
                        onClick={() => handleResultClick(event.eventId)}
                        className="text-xs font-medium text-[#7da668] hover:underline"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty and Loading States */}
      {showResults && events.length === 0 && !isLoading && (
        <div
          className={`${
            isMobile ? '' : 'absolute z-30'
          } mt-3 w-full bg-white border border-[#99BC85] rounded-lg shadow-lg p-4 text-center`}
        >
          <div className="py-2">
            <div className="text-2xl mb-2">🔍</div>
            <p className="text-gray-600 font-medium">
              No events found for "{searchTerm}"
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Try a different search term
            </p>
          </div>
        </div>
      )}

      {isLoading && (
        <div
          className={`${
            isMobile ? '' : 'absolute z-30'
          } mt-3 w-full bg-white border border-[#99BC85] rounded-lg shadow-lg p-3 text-center`}
        >
          <div className="flex items-center justify-center py-2">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#255F38] mr-3"></div>
            <p className="text-[#255F38] font-medium">Searching...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComp;
