'use client';
import ApiService from '@/app/_lib/services/ApiService';
import useEventStore from '@/app/_store/useEventStore';
import React, { useEffect, useState } from 'react';
import AddSection from '@/app/_components/section/AddSection';
import UploadSeats from '@/app/_components/section/UploadSeats';
import { useRouter } from 'next/navigation';
import { FaPencilRuler, FaTrash } from 'react-icons/fa';

const SectionPage = () => {
  const {
    selectedVenueId,
    fetchSectionsByVenue,
    sections,
    setSelectedSectionId,
    selectedSectionId,
    selectedEventId,
  } = useEventStore();
  const [selectedSectionHasSeats, setSelectedSectionHasSeats] = useState(false);
  const router = useRouter();

  const handleSelectSection = async (sectionId) => {
    setSelectedSectionId(sectionId); // Set the selected section ID in the store

    try {
      const seats = await ApiService.fetchSectionSeats(sectionId); // Fetch seats for the selected section
      if (seats.length > 0) {
        setSelectedSectionHasSeats(true); // Mark that the section has seats
        router.push('/admin/session'); // Redirect to session page
      } else {
        setSelectedSectionHasSeats(false); // Mark that the section has no seats
      }
    } catch (error) {
      console.error('Error fetching section seats:', error.message);
      alert('Failed to fetch seats for this section.');
    }
  };

  useEffect(() => {
    if (selectedVenueId) {
      fetchSectionsByVenue(selectedVenueId); // Fetch sections when a venue is selected
    }
  }, [selectedVenueId]);

  return (
    <div className="p-8 bg-[#FDFAF6] min-h-screen">
      <h1 className="text-3xl text-[#255F38] font-bold mb-6">
        Manage Sections
      </h1>
      <div className="flex justify-between items-center mb-6">
        <div className="w-2/3">
          <p className="text-[#255F38] font-semibold">
            Venue ID: {selectedVenueId || 'No venue selected'}
          </p>
        </div>
        <AddSection />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl text-[#255F38] font-semibold mb-4">
          Section List
        </h2>
        {sections?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-[#99BC85] text-left">
              <thead>
                <tr className="bg-[#FAF1E6] text-[#255F38]">
                  <th className="border border-[#99BC85] px-6 py-4 text-center">
                    Select
                  </th>
                  <th className="border border-[#99BC85] px-6 py-4">
                    Section Name
                  </th>
                  <th className="border border-[#99BC85] px-6 py-4 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sections.map((section, index) => (
                  <tr
                    key={section.sectionId}
                    className={`${
                      index % 2 === 0 ? 'bg-[#E4EFE7]' : 'bg-[#FAF1E6]'
                    } hover:bg-[#DFF0E7] transition duration-200`}
                  >
                    <td className="border border-[#99BC85] px-6 py-4 text-center">
                      <input
                        type="radio"
                        name="selectedSection"
                        onChange={() => handleSelectSection(section.sectionId)}
                      />
                    </td>
                    <td className="border border-[#99BC85] px-6 py-4">
                      <span className="font-semibold text-[#255F38]">
                        {section.sectionName}
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
          <div className="text-[#443627]">No sections available.</div>
        )}
      </div>
      {selectedSectionId && !selectedSectionHasSeats && (
        <div className="mt-6 flex justify-end">
          <UploadSeats sectionId={selectedSectionId} />
        </div>
      )}
    </div>
  );
};

export default SectionPage;
