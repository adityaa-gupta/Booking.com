'use client';
import ApiService from '@/app/_lib/services/ApiService';
import useEventStore from '@/app/_store/useEventStore';
import React, { useEffect } from 'react';
import DropDown from '@/app/_components/DropDown';
import AddEvents from '@/app/_components/events/AddEvents';
import { FaPencilRuler, FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const Page = () => {
  const {
    eventTypes,
    setEventTypes,
    setSelectedEventType,
    selectedEventType,
    fetchAndRefreshEvents,
    events,
    setSelectedEventId,
    selectedEventId,
  } = useEventStore();
  const router = useRouter();

  useEffect(() => {
    const fetchEventTypes = async () => {
      const data = await ApiService.fetchEventTypes();
      setEventTypes(data);
    };
    fetchEventTypes();
  }, []);

  const handleEventTypeChange = (e) => {
    setSelectedEventType(e.target.value);
    fetchAndRefreshEvents(); // Refresh events when event type changes
  };

  const handleSelectEvent = (eventId) => {
    setSelectedEventId(eventId); // Set the sel
  };

  const handleNavigateToVenue = () => {
    router.push('/admin/venue');
  };

  const handleNavigateToSection = () => {
    if (selectedEventId) {
      router.push('/admin/section');
    } else {
      alert('Please select an event first.');
    }
  };

  const eventTypeOptions = eventTypes.map((eventType) => ({
    value: eventType.id,
    label: eventType.name,
  }));

  return (
    <div className="p-8 bg-[#FDFAF6] min-h-screen flex flex-col">
      <h1 className="text-3xl text-[#255F38] font-bold mb-6">Manage Events</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="w-2/3">
          <DropDown
            options={eventTypeOptions}
            onChange={handleEventTypeChange}
            value={selectedEventType}
            label="Select Event Type"
          />
        </div>
        <AddEvents />
      </div>
      <div className="p-6 mb-4 flex-grow">
        <h2 className="text-2xl text-[#255F38] font-semibold mb-4">
          Event List
        </h2>
        {events.length > 0 ? (
          <div className="overflow-x-hidden">
            <div className="max-h-[65vh] overflow-y-auto  border border-[#99BC85] rounded">
              <table className="w-full border-collapse text-left">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-[#FAF1E6] text-[#255F38]">
                    <th className="border border-[#99BC85] px-6 py-4 text-center">
                      Select
                    </th>
                    <th className="border border-[#99BC85] px-6 py-4">
                      Event Name
                    </th>
                    <th className="border border-[#99BC85] px-6 py-4">
                      Description
                    </th>
                    <th className="border border-[#99BC85] px-6 py-4">Image</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, index) => (
                    <tr
                      key={event.eventId}
                      className={`${
                        index % 2 === 0 ? 'bg-[#E4EFE7]' : 'bg-[#FAF1E6]'
                      } hover:bg-[#DFF0E7] transition duration-200`}
                    >
                      <td className="border border-[#99BC85] px-6 py-4 text-center">
                        <input
                          type="radio"
                          name="selectedEvent"
                          onChange={() => handleSelectEvent(event.eventId)}
                        />
                      </td>
                      <td className="border border-[#99BC85] px-6 py-4">
                        <span className="font-semibold text-[#255F38]">
                          {event.eventName}
                        </span>
                      </td>
                      <td className="border border-[#99BC85] px-6 py-4">
                        <p className="text-sm text-[#443627]">
                          {event.eventDescription}
                        </p>
                      </td>
                      <td className="border border-[#99BC85] px-6 py-4">
                        <img
                          src={event.eventImageUrl}
                          alt={event.eventName}
                          className="w-16 h-16 object-cover rounded shadow-md"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-[#443627]">No events available.</div>
        )}
      </div>
      {selectedEventId && (
        <div className="mt-4 mb-10 flex justify-end sticky bottom-4 right-4">
          <button
            onClick={handleNavigateToVenue}
            className="bg-[#1F7D53] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#145A3A] transition duration-200 shadow-lg"
          >
            Select Venue
          </button>
        </div>
      )}
    </div>
  );
};

export default Page;
