import useEventStore from '@/app/_store/useEventStore';
import Button from '../Button';
import Modal from '../Modal';
import CreateSectionForm from './CreateSectionForm';
import ApiService from '@/app/_lib/services/ApiService';
import { toast } from 'react-toastify';

function AddSection() {
  const { selectedVenueId, fetchSectionsByVenue } = useEventStore();

  const handleCreateSection = async (data) => {
    try {
      const body = {
        sectionName: data.name,
        venueId: selectedVenueId,
      };

      console.log(body);

      toast.success('Section created successfully');

      const res = await ApiService.addSection(body);
      fetchSectionsByVenue(selectedVenueId);
      console.log(res);
    } catch (error) {
      toast.error('Error creating section');
      console.error('Error creating section:', error.message);
    }
  };

  return (
    <div>
      <Modal>
        <Modal.Open opens="section-form">
          <Button size="small" variation="primary">
            Add Section
          </Button>
        </Modal.Open>
        <Modal.Window name="section-form">
          <CreateSectionForm onSubmit={handleCreateSection} />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddSection;
