'use client';
import ApiService from '@/app/_lib/services/ApiService';
import useEventStore from '@/app/_store/useEventStore';
import React, { useEffect } from 'react';
import DropDown from '@/app/_components/DropDown';
import AddVenue from '@/app/_components/venue/AddVenue';
import { FaPencilRuler, FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const VenuePage = () => {
  const {
    locations,
    setLocations,
    setSelectedLocationId,
    selectedLocationId,
    fetchAndRefreshVenues,
    venues,
    setSelectedVenueId,
    selectedVenueId,
  } = useEventStore();
  const router = useRouter();

  useEffect(() => {
    const fetchLocations = async () => {
      const data = await ApiService.fetchLocations();
      setLocations(data);
    };
    fetchLocations();
  }, []);

  const handleLocationChange = (e) => {
    setSelectedLocationId(e.target.value);
    fetchAndRefreshVenues(); // Refresh venues when location changes
  };

  const handleSelectVenue = (venueId) => {
    setSelectedVenueId(venueId); // Set the selected venue ID in the store
    console.log('Selected Venue ID:', venueId);
  };

  const handleNavigateToSection = () => {
    if (selectedVenueId) {
      router.push('/admin/section');
    } else {
      alert('Please select a venue first.');
    }
  };

  const locationOptions = locations.map((location) => ({
    value: location.locationId,
    label: location.locationName,
  }));

  return (
    <div className="p-8 bg-[#FDFAF6] min-h-screen">
      <h1 className="text-3xl text-[#255F38] font-bold mb-6">Manage Venues</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="w-2/3">
          <DropDown
            options={locationOptions}
            onChange={handleLocationChange}
            value={selectedLocationId}
            label="Select Location"
          />
        </div>
        <AddVenue />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl text-[#255F38] font-semibold mb-4">
          Venue List
        </h2>
        {venues?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-[#99BC85] text-left">
              <thead>
                <tr className="bg-[#FAF1E6] text-[#255F38]">
                  <th className="border border-[#99BC85] px-6 py-4 text-center">
                    Select
                  </th>
                  <th className="border border-[#99BC85] px-6 py-4">Address</th>
                  <th className="border border-[#99BC85] px-6 py-4 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {venues.map((venue, index) => (
                  <tr
                    key={venue.id}
                    className={`${
                      index % 2 === 0 ? 'bg-[#E4EFE7]' : 'bg-[#FAF1E6]'
                    } hover:bg-[#DFF0E7] transition duration-200`}
                  >
                    <td className="border border-[#99BC85] px-6 py-4 text-center">
                      <input
                        type="radio"
                        name="selectedVenue"
                        onChange={() => handleSelectVenue(venue.venueId)}
                      />
                    </td>
                    <td className="border border-[#99BC85] px-6 py-4">
                      <span className="font-semibold text-[#255F38]">
                        {venue.address}
                      </span>
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
          <div className="text-[#443627]">No venues available.</div>
        )}
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleNavigateToSection}
          className="bg-[#1F7D53] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#145A3A] transition duration-200"
        >
          Select Section
        </button>
      </div>
    </div>
  );
};

export default VenuePage;
