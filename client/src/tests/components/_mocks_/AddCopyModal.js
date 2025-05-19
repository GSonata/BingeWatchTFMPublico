import React from "react";

const AddCopyModal = ({ isOpen, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div data-testid="mock-add-modal">
      <button data-testid="confirm-add" onClick={() => onConfirm({ soporte: "BluRay", estado: "Nuevo" })}>
        Confirmar
      </button>
    </div>
  );
};

export default AddCopyModal;
