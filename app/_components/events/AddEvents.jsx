import Button from '../Button';
import Modal from '../Modal';
import CreateEventForm from './CreateEventForm';

function AddEvents() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="event-form">
          <Button size="small" variation="primary">
            Add Event
          </Button>
        </Modal.Open>
        <Modal.Window name="event-form">
          <CreateEventForm onCloseModal={Modal.close} />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddEvents;
