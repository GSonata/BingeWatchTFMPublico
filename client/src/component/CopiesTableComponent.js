import React from 'react';
import "../styles/CopiesTable.scss"


function UserCopiesTable({ copias, onAddCopy, onDeleteCopy, onEditCopy, setIsAddModalOpen }) {
    return (
        <div className="copies-table-wrapper">
            <table className="copies-table">
                <thead>
                    <tr>
                        <th>Fecha añadida</th>
                        <th>Plataforma</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {copias.length > 0 ? (
                        copias.map((copia, index) => (
                            <tr key={index}>
                                <td>
                                    {copia.fechaAñadida
                                        ? new Date(copia.fechaAñadida).toLocaleDateString()
                                        : 'Fecha no disponible'}
                                </td>
                                <td>{copia.soporte}</td>
                                <td>{copia.estado}</td>
                                <td className='action-group'>
                                    <button className="edit-btn" onClick={() => onEditCopy(copia)}>✏️</button>
                                    <button className="delete-btn" onClick={() => onDeleteCopy(copia.idCopia)}>🗑️</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="empty-message">
                                No tienes ninguna copia de esta película.
                            </td>
                        </tr>
                    )}
                    <tr>
                        <td colSpan="4" className="add-row">
                            <button className="add-btn" onClick={() => setIsAddModalOpen(true)}>➕ Añadir una copia</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default UserCopiesTable;
