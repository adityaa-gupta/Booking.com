import React from 'react';
import { useForm } from 'react-hook-form';
import InputField from '../InputField';
import { FaMapMarkerAlt } from 'react-icons/fa';
import ApiService from '@/app/_lib/services/ApiService';
import { toast } from 'react-toastify';
import useEventStore from '@/app/_store/useEventStore';

const CreateSectionForm = ({ onCloseModal }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { selectedVenueId, fetchSectionsByVenue } = useEventStore();
  const handleCreateSection = async (data) => {
    try {
      const body = {
        sectionName: data.name,
        venueId: selectedVenueId,
      };

      const res = await ApiService.addSection(body);
      toast.success('Section created successfully');
      fetchSectionsByVenue(selectedVenueId);

      if (onCloseModal) onCloseModal();
    } catch (error) {
      toast.error('Error creating section');
      console.error('Error creating section:', error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleCreateSection)}
      className="space-y-6 bg-[#FAF1E6] p-8 rounded-lg shadow-md"
    >
      <InputField
        label="Section Name"
        icon={<FaMapMarkerAlt />}
        placeholder="Enter section name"
        {...register('name', { required: 'Section name is required' })}
        error={errors.name?.message}
      />
      <button
        type="submit"
        className="bg-[#1F7D53] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#145A3A] transition duration-200"
      >
        Submit
      </button>
    </form>
  );
};

export default CreateSectionForm;
