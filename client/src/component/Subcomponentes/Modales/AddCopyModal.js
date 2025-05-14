import React, { useState, useEffect } from 'react';
import '../../../styles/AddCopyModal.scss';

const CopyModal = ({ isOpen, onClose, onConfirm, mode, copyData = {} }) => {
  const [soporte, setSoporte] = useState('DVD');
  const [estado, setEstado] = useState('Excelente');
  

  useEffect(() => {
    setSoporte(copyData?.soporte || 'DVD');
    setEstado(copyData?.estado || 'Excelente');
  }, [copyData]);
  

  const handleSubmit = () => {
    onConfirm({ soporte, estado });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{mode === 'edit' ? 'Editar copia' : 'Añadir copia'}</h2>

        <label>Plataforma:</label>
        <select value={soporte} onChange={(e) => setSoporte(e.target.value)}>
          <option value="DVD">DVD</option>
          <option value="BluRay">BluRay</option>
          <option value="VHS">VHS</option>
          <option value="Digital">Digital</option>
        </select>

        <label>Estado:</label>
        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="Excelente">Excelente</option>
          <option value="Bueno">Bueno</option>
          <option value="Normal">Normal</option>
          <option value="Malo">Malo</option>
        </select>

        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose}>Cancelar</button>
          <button className="confirm-btn" onClick={handleSubmit}>Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default CopyModal;
