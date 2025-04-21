import React from 'react';

function UserCopiesTable({ copias, onAddCopy, onDeleteCopy, onEditCopy }) {
    return (
        <table style={{ width: '100%', borderCollapse: 'collapse' }} border="1" cellPadding="8">
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
                            <td>  {copia.fechaAñadida
                                ? new Date(copia.fechaAñadida).toLocaleDateString()
                                : 'Fecha no disponible'}</td>
                            <td>{copia.soporte}</td>
                            <td>{copia.estado}</td>
                            <td>
                            <button onClick={() => onEditCopy(copia)}>✏️</button>                              
                            <button onClick={() => onDeleteCopy(copia.idCopia)}>🗑️</button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" style={{ textAlign: 'center', fontStyle: 'italic' }}>
                            No tienes ninguna copia de esta película.
                        </td>
                    </tr>
                )}
                <tr>
                    <td colSpan="4" style={{ textAlign: 'center' }}>
                        <button onClick={onAddCopy}>➕ Añadir una copia</button>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

export default UserCopiesTable;
