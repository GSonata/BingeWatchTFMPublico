import React from 'react';
import '../../styles/Modal.scss';

function ModalComponent({ title, content, onClose }) {
  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={e => e.stopPropagation()}>
        <button className="closeButton" onClick={onClose}>✖</button>
        <h2>{title}</h2>
        <div className="modalBody">{content}</div>
      </div>
    </div>
  );
}

export default ModalComponent;
