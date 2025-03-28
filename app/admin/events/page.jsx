'use client';
import ApiService from '@/app/_lib/services/ApiService';
import useEventStore from '@/app/_store/useEventStore';
import React, { useEffect } from 'react';
import DropDown from '@/app/_components/DropDown';
import AddEvents from '@/app/_components/events/AddEvents';
import { FaPencilRuler, FaTrash } from 'react-icons/fa';

const Page = () => {
  const {
    eventTypes,
    setEventTypes,
    setSelectedEventType,
    selectedEventType,
    fetchAndRefreshEvents,
    events,
    setSelectedEventId,
  } = useEventStore();

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
    setSelectedEventId(eventId); // Set the selected event ID in the store
    console.log('Selected Event ID:', eventId);
  };

  const eventTypeOptions = eventTypes.map((eventType) => ({
    value: eventType.id,
    label: eventType.name,
  }));

  return (
    <div className="p-8 bg-[#FDFAF6] min-h-screen">
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
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl text-[#255F38] font-semibold mb-4">
          Event List
        </h2>
        {events.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-[#99BC85] text-left">
              <thead>
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
                  <th className="border border-[#99BC85] px-6 py-4 text-center">
                    Actions
                  </th>
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
                    <td className="border border-[#99BC85] px-6 py-4 text-center">
                      <button className=" text-[#1F7D53] px-4 py-2 rounded-full font-semibold ">
                        <FaPencilRuler />
                      </button>
                      <button className=" text-[#d9534f] px-4 py-2 rounded-full font-semibold hover:bg-[#C9302C] ml-2">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-[#443627]">No events available.</div>
        )}
      </div>
    </div>
  );
};

export default Page;
