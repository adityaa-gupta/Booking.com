'use client';
import ApiService from '@/app/_lib/services/ApiService';
import useEventStore from '@/app/_store/useEventStore';
import React, { useEffect, useState } from 'react';
import CreateSession from '@/app/_components/session/CreateSession';
import { FaPencilRuler, FaTrash } from 'react-icons/fa';

const SessionPage = () => {
  const { selectedSectionId, selectedEventId } = useEventStore();
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      if (selectedSectionId) {
        try {
          const data = await ApiService.fetchEventSessions(selectedSectionId);
          setSessions(data);
        } catch (error) {
          console.error('Error fetching sessions:', error.message);
        }
      }
    };

    fetchSessions();
  }, [selectedSectionId]);

  return (
    <div className="p-8 bg-[#FDFAF6] min-h-screen">
      <h1 className="text-3xl text-[#255F38] font-bold mb-6">
        Manage Sessions
      </h1>
      <div className="flex justify-between items-center mb-6">
        <p className="text-[#255F38] font-semibold">
          Section ID: {selectedSectionId || 'No section selected'}
        </p>
        <CreateSession
          sectionId={selectedSectionId}
          eventId={selectedEventId}
        />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl text-[#255F38] font-semibold mb-4">
          Session List
        </h2>
        {sessions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-[#99BC85] text-left">
              <thead>
                <tr className="bg-[#FAF1E6] text-[#255F38]">
                  <th className="border border-[#99BC85] px-6 py-4">
                    Start Time
                  </th>
                  <th className="border border-[#99BC85] px-6 py-4">
                    End Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session, index) => (
                  <tr
                    key={session.sessionId}
                    className={`${
                      index % 2 === 0 ? 'bg-[#E4EFE7]' : 'bg-[#FAF1E6]'
                    } hover:bg-[#DFF0E7] transition duration-200`}
                  >
                    <td className="border border-[#99BC85] px-6 py-4">
                      {new Date(session.startTime).toLocaleString()}
                    </td>
                    <td className="border border-[#99BC85] px-6 py-4">
                      {new Date(session.endTime).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-[#443627]">No sessions available.</div>
        )}
      </div>
    </div>
  );
};

export default SessionPage;
