import useEventStore from '@/app/_store/useEventStore';
import Button from '../Button';
import Modal from '../Modal';
import CreateVenueForm from './CreateVenueForm';

function AddVenue() {
  const { selectedLocationId, fetchAndRefreshVenues } = useEventStore();

  return (
    <div>
      <Modal>
        <Modal.Open opens="venue-form">
          <Button size="small" variation="primary">
            Add Venue
          </Button>
        </Modal.Open>
        <Modal.Window name="venue-form">
          <CreateVenueForm onCloseModal={Modal.close} />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddVenue;
