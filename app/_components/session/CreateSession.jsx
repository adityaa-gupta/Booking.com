import React from 'react';
import Button from '../Button';
import Modal from '../Modal';
import CreateSessionForm from './CreateSessionForm';

function CreateSession({ sectionId, eventId }) {
  return (
    <div>
      <Modal>
        <Modal.Open opens="session-form">
          <Button size="small" variation="primary">
            Create Session
          </Button>
        </Modal.Open>
        <Modal.Window name="session-form">
          <CreateSessionForm
            sectionId={sectionId}
            eventId={eventId}
            onCloseModal={Modal.close}
          />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default CreateSession;
