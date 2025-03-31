import React from 'react';
import { useForm } from 'react-hook-form';
import InputField from '../InputField';
import { FaMapMarkerAlt } from 'react-icons/fa';

const CreateSectionForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
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
