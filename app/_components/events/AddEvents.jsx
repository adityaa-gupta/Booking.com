import Button from '../Button';
import Modal from '../Modal';
import CreateEventForm from './CreateEventForm';

function AddEvents() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="cabin-form">
          <Button variation="primary">Add Event</Button>
        </Modal.Open>
        <Modal.Window name="cabin-form">
          <CreateEventForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddEvents;
