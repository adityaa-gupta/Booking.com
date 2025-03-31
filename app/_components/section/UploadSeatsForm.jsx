import React, { useState } from 'react';
import Button from '../Button';
import ApiService from '@/app/_lib/services/ApiService';
import { toast } from 'react-toastify';

const UploadSeatsForm = ({ sectionId, onClose }) => {
  const [file, setFile] = useState(null);
  const [uploadId, setUploadId] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [step, setStep] = useState('upload'); // Tracks the current step: 'upload', 'verify', 'finalize'

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadSeats = async (e) => {
    e.preventDefault(); // Prevent form submission
    if (!file) {
      toast.error('Please select a file to upload.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await ApiService.uploadSeats(sectionId, formData);
      setUploadId(response.uploadId);
      toast.success('Seats uploaded successfully. Please verify them.');
      setStep('verify'); // Move to the next step
    } catch (error) {
      toast.error('Failed to upload seats.');
      console.error('Error uploading seats:', error.message);
    }
  };

  const handleVerifySeats = async (e) => {
    e.preventDefault(); // Prevent form submission
    if (!uploadId) {
      toast.error('No upload ID found. Please upload seats first.');
      return;
    }

    try {
      setIsVerifying(true);
      await ApiService.verifySeats(uploadId);
      toast.success('Seats verified successfully. Please finalize them.');
      setStep('finalize'); // Move to the next step
    } catch (error) {
      toast.error('Failed to verify seats.');
      console.error('Error verifying seats:', error.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFinalizeSeats = async (e) => {
    e.preventDefault(); // Prevent form submission
    if (!uploadId) {
      toast.error('No upload ID found. Please upload and verify seats first.');
      return;
    }

    try {
      await ApiService.finalizeSeatUpload(uploadId);
      toast.success('Seats finalized successfully.');
      onClose(); // Close the modal after finalizing
    } catch (error) {
      toast.error('Failed to finalize seats.');
      console.error('Error finalizing seats:', error.message);
    }
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()} // Prevent default form submission
      className="space-y-6 bg-[#FAF1E6] p-8 rounded-lg shadow-md"
    >
      <h2 className="text-2xl text-[#255F38] font-semibold mb-4">
        Upload Seats for Section
      </h2>
      {step === 'upload' && (
        <>
          <div className="mb-4">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="border border-[#99BC85] rounded-full px-4 py-2 w-full"
            />
          </div>
          <Button size="small" variation="primary" onClick={handleUploadSeats}>
            Upload Seats
          </Button>
        </>
      )}
      {step === 'verify' && (
        <Button
          size="small"
          variation="secondary"
          onClick={handleVerifySeats}
          disabled={isVerifying}
        >
          {isVerifying ? 'Verifying...' : 'Verify Seats'}
        </Button>
      )}
      {step === 'finalize' && (
        <Button size="small" variation="primary" onClick={handleFinalizeSeats}>
          Finalize Seats
        </Button>
      )}
      <div className="mt-4 text-right">
        <Button size="small" variation="danger" onClick={onClose}>
          Close
        </Button>
      </div>
    </form>
  );
};

export default UploadSeatsForm;
