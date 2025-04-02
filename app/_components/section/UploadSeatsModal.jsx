import React, { useState } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import ApiService from '@/app/_lib/services/ApiService';
import { toast } from 'react-toastify';

const UploadSeatsModal = ({ sectionId, onClose }) => {
  const [file, setFile] = useState(null);
  const [uploadId, setUploadId] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleUploadSeats = async () => {
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
    } catch (error) {
      toast.error('Failed to upload seats.');
      console.error('Error uploading seats:', error.message);
    }
  };

  const handleVerifySeats = async () => {
    if (!uploadId) {
      toast.error('No upload ID found. Please upload seats first.');
      return;
    }

    try {
      setIsVerifying(true);
      await ApiService.verifySeats(uploadId);
      toast.success('Seats verified successfully. Please finalize them.');
    } catch (error) {
      toast.error('Failed to verify seats.');
      console.error('Error verifying seats:', error.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFinalizeSeats = async () => {
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
    <Modal>
      <Modal.Window>
        <div className="p-6 bg-[#FAF1E6] rounded-lg shadow-md">
          <h2 className="text-2xl text-[#255F38] font-semibold mb-4">
            Upload Seats for Section
          </h2>
          <div className="mb-4">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="border border-[#99BC85] rounded-full px-4 py-2 w-full"
            />
          </div>
          <div className="flex justify-between gap-4">
            <Button
              size="small"
              variation="primary"
              onClick={handleUploadSeats}
            >
              Upload Seats
            </Button>
            <Button
              size="small"
              variation="secondary"
              onClick={handleVerifySeats}
              disabled={isVerifying}
            >
              {isVerifying ? 'Verifying...' : 'Verify Seats'}
            </Button>
            <Button
              size="small"
              variation="primary"
              onClick={handleFinalizeSeats}
            >
              Finalize Seats
            </Button>
          </div>
          <div className="mt-4 text-right">
            <Button size="small" variation="danger" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </Modal.Window>
    </Modal>
  );
};

export default UploadSeatsModal;
