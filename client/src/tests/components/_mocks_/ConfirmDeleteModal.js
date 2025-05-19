import React, { useEffect } from "react";

const ConfirmDeleteModal = ({ isOpen, onConfirm }) => {
  useEffect(() => {
    if (isOpen && onConfirm) {
      onConfirm("copy-id"); // ID simulado
    }
  }, [isOpen, onConfirm]);

  return <div data-testid="mock-delete-modal" />;
};

export default ConfirmDeleteModal;
