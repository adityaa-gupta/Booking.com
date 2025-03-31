import useEventStore from '@/app/_store/useEventStore';
import Button from '../Button';
import Modal from '../Modal';
import CreateVenueForm from './CreateVenueForm';
import ApiService from '@/app/_lib/services/ApiService';
import { toast } from 'react-toastify';

function AddVenue() {
  const { selectedLocationId, fetchAndRefreshVenues } = useEventStore();

  const handleCreateVenue = async (data) => {
    try {
      const body = {
        address: data.address,
        locationId: selectedLocationId,
      };

      console.log(body);

      toast.success('Venue created successfully');

      const res = await ApiService.addVenue(body);
      fetchAndRefreshVenues();
      console.log(res);
    } catch (error) {
      toast.error('Error creating venue');
      console.error('Error creating venue:', error.message);
    }
  };

  return (
    <div>
      <Modal>
        <Modal.Open opens="venue-form">
          <Button size="small" variation="primary">
            Add Venue
          </Button>
        </Modal.Open>
        <Modal.Window name="venue-form">
          <CreateVenueForm onSubmit={handleCreateVenue} />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddVenue;
