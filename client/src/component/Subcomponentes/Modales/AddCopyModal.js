import React, { useState, useEffect } from 'react';
import '../../../styles/AddCopyModal.scss';

const AddCopyModal = ({ isOpen, onClose, onConfirm, mode, copyData = {} }) => {
  const [soporte, setSoporte] = useState('DVD');
  const [estado, setEstado] = useState('Excelente');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setSoporte(copyData?.soporte || 'DVD');
    setEstado(copyData?.estado || 'Excelente');
  }, [copyData]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm({ soporte, estado });
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{mode === 'edit' ? 'Editar copia' : 'Añadir copia'}</h2>

        <label>Plataforma:</label>
        <select value={soporte} onChange={(e) => setSoporte(e.target.value)} disabled={isSubmitting}>
          <option value="DVD">DVD</option>
          <option value="BluRay">BluRay</option>
          <option value="VHS">VHS</option>
          <option value="Digital">Digital</option>
        </select>

        <label>Estado:</label>
        <select value={estado} onChange={(e) => setEstado(e.target.value)} disabled={isSubmitting}>
          <option value="Excelente">Excelente</option>
          <option value="Bueno">Bueno</option>
          <option value="Normal">Normal</option>
          <option value="Malo">Malo</option>
        </select>

        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </button>
          <button className="confirm-btn" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="button-spinner"></div>
            ) : (
              'Guardar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCopyModal;
