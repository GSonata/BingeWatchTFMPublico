import React from "react";
import "../../../styles/CopyImageModal.scss";

const CopyImageModal = ({ isOpen, onClose, imageSrc }) => {
  if (!isOpen || !imageSrc) return null;

  return (
    <div className="modal-overlay">
      <div className="modal copy-image-modal">
              <h3>Imagen de tu copia: </h3>

        <button className="close-btn" onClick={onClose}>❌</button>
        <img src={imageSrc} alt="Imagen de la copia" className="image-preview" />
      </div>
    </div>
  );
};

export default CopyImageModal;
