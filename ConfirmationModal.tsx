import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

interface ConfirmationModalProps {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  description,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  disabled = false,
}) => {
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onClose} size="xl">
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalBody>
            <p>{description}</p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={onClose}
              disabled={disabled}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={onConfirm}
              isLoading={isLoading}
              disabled={disabled}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConfirmationModal;
