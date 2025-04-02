import Button from '../Button';
import Modal from '../Modal';
import CreateSectionForm from './CreateSectionForm';

function AddSection() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="section-form">
          <Button size="small" variation="primary">
            Add Section
          </Button>
        </Modal.Open>
        <Modal.Window name="section-form">
          <CreateSectionForm onCloseModal={Modal.close} />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddSection;
