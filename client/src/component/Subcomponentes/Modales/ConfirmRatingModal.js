import React from 'react';
import '../../../styles/ConfirmRatingModal.scss';

const ConfirmRatingModal = ({ isOpen, newRating, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Confirmar calificación</h2>
        <p>Le vas a dar <strong>{newRating} estrellas</strong> a esta película.</p>
        <p>¿Deseas guardar esta calificación?</p>
        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onCancel}>Cancelar</button>
          <button className="confirm-btn" onClick={() => onConfirm(newRating)}>Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRatingModal;
