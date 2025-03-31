import Button from '../Button';
import Modal from '../Modal';
import UploadSeatsForm from './UploadSeatsForm';

function UploadSeats({ sectionId, onClose }) {
  return (
    <div>
      <Modal>
        <Modal.Open opens="upload-seats-form">
          <Button size="small" variation="primary">
            Upload Seats
          </Button>
        </Modal.Open>
        <Modal.Window name="upload-seats-form">
          <UploadSeatsForm sectionId={sectionId} onClose={onClose} />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default UploadSeats;
