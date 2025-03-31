import React from 'react';
import { useForm } from 'react-hook-form';
import InputField from '../InputField';
import ApiService from '@/app/_lib/services/ApiService';
import { toast } from 'react-toastify';

const CreateSessionForm = ({ sectionId, eventId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const body = {
        startTime: data.startTime,
        endTime: data.endTime,
        sectionId,
        eventId,
      };

      console.log(body);

      toast.success('Session created successfully');

      const res = await ApiService.createSession(body);
      console.log(res);
    } catch (error) {
      toast.error('Error creating session');
      console.error('Error creating session:', error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-[#FAF1E6] p-8 rounded-lg shadow-md"
    >
      <InputField
        label="Start Time"
        type="datetime-local"
        {...register('startTime', { required: 'Start time is required' })}
        error={errors.startTime?.message}
      />
      <InputField
        label="End Time"
        type="datetime-local"
        {...register('endTime', { required: 'End time is required' })}
        error={errors.endTime?.message}
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

export default CreateSessionForm;
