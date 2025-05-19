import React, { useEffect } from "react";

const CopiesTableComponent = ({ setIsAddModalOpen, onEditCopy, onDeleteCopy }) => {
  useEffect(() => {
    // Simula abrir modal (modo add)
    if (setIsAddModalOpen) {
      setIsAddModalOpen(true);
    }

    // Simula editar copia
    if (onEditCopy) {
      onEditCopy({ idCopia: "123", soporte: "DVD", estado: "Usado" });
    }

    // Simula borrar copia
    if (onDeleteCopy) {
      onDeleteCopy("123");
    }
  }, [setIsAddModalOpen, onEditCopy, onDeleteCopy]);

  return <div data-testid="mock-copies-table" />;
};

export default CopiesTableComponent;
