import React from 'react';
import '../../../styles/ConfirmDeleteModal.scss';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2 className="confirm-delete-title">¿Estás seguro?</h2>
                <p>⚠️Esta acción eliminará la copia de forma permanente.</p>
                <div className="modal-buttons">
                    <button className="cancel-btn confirm-delete-cancel" onClick={onClose}>Cancelar</button>
                    <button className="confirm-btn confirm-delete-confirm" onClick={onConfirm}>Sí, eliminar</button>
                </div>

            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
