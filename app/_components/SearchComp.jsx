import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import ApiService from '../_lib/services/ApiService';
import Link from 'next/link';

const SearchComp = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const abortControllerRef = useRef(null);

  const fetchEvents = async () => {
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

  return (
    <div className="relative">
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
          autoFocus
          className="px-4 py-2 w-48 lg:w-80 text-[#255F38] border-none outline-none"
          placeholder="Search for events, movies..."
        />
        <button className="p-2 px-4 transition-colors" onClick={fetchEvents}>
          <FaSearch size={18} className="text-[#99BC85]" />
        </button>
      </div>

      {showResults && events.length > 0 && (
        <div className="absolute z-10 mt-3 w-full bg-white border border-[#99BC85] rounded-lg shadow-xl max-h-[500px] overflow-y-auto">
          <div className="p-4">
            <h3 className="text-[#255F38] font-semibold mb-3 border-b border-[#e9f5dc] pb-2 text-lg">
              Search Results
            </h3>
            <div className="grid gap-3 max-h-200 w-full overflow-y-auto">
              {events.map((event) => (
                <div
                  key={event.eventId}
                  className="flex p-3 bg-[#f9fcf7] hover:bg-[#f0f9e8] rounded-lg cursor-pointer transition-all duration-200 border border-[#e9f5dc] hover:border-[#99BC85] hover:shadow-md"
                >
                  <div className="h-20 w-20 min-w-20 bg-[#e9f5dc] rounded-md overflow-hidden mr-4 shadow-md">
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
                        onClick={() => {
                          setSearchTerm('');
                          setShowResults(false);
                        }}
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

      {showResults && events.length === 0 && !isLoading && (
        <div className="absolute z-10 mt-3 w-full bg-white border border-[#99BC85] rounded-lg shadow-lg p-4 text-center">
          <div className="py-3">
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
        <div className="absolute z-10 mt-3 w-full bg-white border border-[#99BC85] rounded-lg shadow-lg p-4 text-center">
          <div className="flex items-center justify-center py-2">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#255F38] mr-3"></div>
            <p className="text-[#255F38] font-medium">Searching...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComp;
