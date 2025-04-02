import React from 'react';
import { useForm } from 'react-hook-form';
import InputField from '../InputField';
import { FaMapMarkerAlt } from 'react-icons/fa';
import useEventStore from '@/app/_store/useEventStore';
import ApiService from '@/app/_lib/services/ApiService';
import { toast } from 'react-toastify';

const CreateVenueForm = ({ onCloseModal }) => {
  const { selectedLocationId, fetchAndRefreshVenues } = useEventStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleCreateVenue = async (data) => {
    try {
      const body = {
        address: data.address,
        locationId: selectedLocationId,
      };

      toast.success('Venue created successfully');

      const res = await ApiService.addVenue(body);
      fetchAndRefreshVenues();
      if (onCloseModal) onCloseModal();
    } catch (error) {
      toast.error('Error creating venue');
      console.error('Error creating venue:', error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleCreateVenue)}
      className="space-y-6 bg-[#FAF1E6] p-8 rounded-lg shadow-md"
    >
      <InputField
        label="Address"
        icon={<FaMapMarkerAlt />}
        placeholder="Enter address"
        {...register('address', { required: 'Address is required' })}
        error={errors.address?.message}
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

export default CreateVenueForm;
