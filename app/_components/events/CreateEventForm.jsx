import React from 'react';
import { useForm } from 'react-hook-form';
import InputField from '../InputField';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const CreateEventForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 bg-[#FAF1E6] p-6 rounded-lg shadow-md"
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
        icon={<FaLock />}
        placeholder="Upload image"
        type="file"
        {...register('image', { required: 'Image is required' })}
        error={errors.image?.message}
      />
      <button
        type="submit"
        className="bg-[#1F7D53] text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 transition duration-200"
      >
        Submit
      </button>
    </form>
  );
};

export default CreateEventForm;
