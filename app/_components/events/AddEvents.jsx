import useEventStore from '@/app/_store/useEventStore';
import Button from '../Button';
import Modal from '../Modal';
import CreateEventForm from './CreateEventForm';
import uploadImage from '@/app/_lib/helpers/ImageUpload';
import ApiService from '@/app/_lib/services/ApiService';
import { toast } from 'react-toastify';

function AddEvents() {
  const { selectedEventType, fetchAndRefreshEvents } = useEventStore();
  console.log(selectedEventType);
  const handleCreateEvent = async (data) => {
    try {
      if (!data.image || data.image.length === 0) {
        console.error('No image file provided');
        return;
      }

      const file = data.image[0]; // Extract the first file from the input
      if (!file || !file.name) {
        console.error('Invalid file or file name is missing');
        return;
      }

      const eventImageUrl = await uploadImage(file); // Pass the valid file object
      if (eventImageUrl.error) {
        console.error('Image upload failed:', eventImageUrl.error);
        return;
      }
      const { url: imageUrl } = eventImageUrl;

      console.log('Uploaded Image URL:', imageUrl);
      const body = {
        eventName: data.name,
        eventDescription: data.description,
        eventTypeId: selectedEventType,
        eventImageUrl: imageUrl,
      };
      console.log(body);

      toast.success('Event created successfully');

      const res = await ApiService.addEvent(body);
      fetchAndRefreshEvents();
      console.log(res);
      // Proceed with creating the event using the uploaded image URL
    } catch (error) {
      toast.error('Error creating event');
      console.error('Error creating event:', error.message);
    }
  };

  return (
    <div>
      <Modal>
        <Modal.Open opens="cabin-form">
          <Button size="small" variation="primary">
            Add Event
          </Button>
        </Modal.Open>
        <Modal.Window name="cabin-form">
          <CreateEventForm onSubmit={handleCreateEvent} />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddEvents;
