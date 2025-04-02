import React from 'react';
import { useForm } from 'react-hook-form';
import InputField from '../InputField';
import { FaUser, FaEnvelope, FaUpload } from 'react-icons/fa';
import useEventStore from '@/app/_store/useEventStore';
import uploadImage from '@/app/_lib/helpers/ImageUpload';
import ApiService from '@/app/_lib/services/ApiService';
import { toast } from 'react-toastify';

const CreateEventForm = ({ onCloseModal }) => {
  const { selectedEventType, fetchAndRefreshEvents } = useEventStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleCreateEvent = async (data) => {
    try {
      if (!data.image || data.image.length === 0) {
        console.error('No image file provided');
        return;
      }

      const file = data.image[0]; // Extract the first file from the input
      if (!file || !file.name) {
        console.error('Invalid file or file name is missing');
        return;
      }

      const eventImageUrl = await uploadImage(file); // Pass the valid file object
      if (eventImageUrl.error) {
        console.error('Image upload failed:', eventImageUrl.error);
        return;
      }
      const { url: imageUrl } = eventImageUrl;

      const body = {
        eventName: data.name,
        eventDescription: data.description,
        eventTypeId: selectedEventType,
        eventImageUrl: imageUrl,
      };

      const res = await ApiService.addEvent(body);
      toast.success('Event created successfully');
      fetchAndRefreshEvents();

      if (onCloseModal) onCloseModal();
    } catch (error) {
      toast.error('Error creating event');
      console.error('Error creating event:', error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleCreateEvent)}
      className="space-y-6 bg-[#FAF1E6] p-8 rounded-lg shadow-md"
    >
      <InputField
        label="Event Name"
        icon={<FaUser />}
        placeholder="Enter event name"
        {...register('name', { required: 'Event name is required' })}
        error={errors.name?.message}
      />
      <InputField
        label="Description"
        icon={<FaEnvelope />}
        placeholder="Enter description"
        {...register('description', { required: 'Description is required' })}
        error={errors.description?.message}
      />
      <InputField
        label="Image"
        icon={<FaUpload />}
        placeholder="Upload image"
        type="file"
        {...register('image', { required: 'Image is required' })}
        error={errors.image?.message}
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

export default CreateEventForm;
