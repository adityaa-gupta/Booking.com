'use client';
import ApiService from '@/app/_lib/services/ApiService';
import useEventStore from '@/app/_store/useEventStore';
import React, { useState, useEffect } from 'react';
import DropDown from '@/app/_components/DropDown';
import AddEvents from '@/app/_components/events/AddEvents';

const Page = () => {
  const { eventTypes, setEventTypes } = useEventStore();
  const [selectedEventType, setSelectedEventType] = useState('');

  useEffect(() => {
    const fetchEventTypes = async () => {
      const data = await ApiService.fetchEventTypes();
      setEventTypes(data);
    };
    fetchEventTypes();
  }, []);

  const handleEventTypeChange = (e) => {
    setSelectedEventType(e.target.value);
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
      {/* Add more components or content here */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl text-[#255F38] font-semibold mb-4">
          Event List
        </h2>
        {/* Placeholder for event list */}
        <div className="text-[#443627">No events available.</div>
      </div>
      {/* <AddEvents /> */}
    </div>
  );
};

export default Page;
