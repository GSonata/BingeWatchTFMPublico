import React from 'react';
import "../styles/CopiesTable.scss";


function UserCopiesTable({ copias, onAddCopy, onDeleteCopy, onEditCopy, onViewImage, onDeleteImage, setIsAddModalOpen }) {
    return (
        <div className="copies-table-wrapper">
            <table className="copies-table">
                <thead>
                    <tr>
                        <th>Fecha añadida</th>
                        <th>Plataforma</th>
                        <th>Estado</th>
                        <th>Imagen</th>
                        <th>Tags</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {copias.length > 0 ? (
                        copias.map((copia, index) => {
                            const hasImage = typeof copia.foto === "string" && copia.foto.startsWith("data:image");

                            return (
                                <tr key={index}>
                                    <td>{copia.fechaAñadida ? new Date(copia.fechaAñadida).toLocaleDateString() : 'Fecha no disponible'}</td>
                                    <td>{copia.soporte}</td>
                                    <td>{copia.estado}</td>
                                    <td className="image-cell">
                                        {hasImage ? (
                                            <>
                                                <img
                                                    src="/images/iconos/imagen.svg"
                                                    width="30px"
                                                    height="30px"
                                                    className="clickable-image"
                                                    onClick={() => onViewImage(copia.foto)}
                                                    alt="Ver imagen"
                                                />

                                            </>
                                        ) : (
                                            <img
                                                src="/images/iconos/no-imagen.svg"
                                                width="30px"
                                                height="30px"
                                                alt="Sin imagen"
                                            />
                                        )}
                                    </td>
                                    <td>
                                        {Array.isArray(copia.tags) && copia.tags.filter(tag => typeof tag === "string" && tag.trim() !== "").length > 0
                                            ? copia.tags
                                                .filter(tag => typeof tag === "string" && tag.trim() !== "")
                                                .map((tag, i) => <span key={i} className="tag-badge clickable-tag">#{tag}</span>)
                                            : "—"}
                                    </td>
                                    <td className="action-group">
                                        <button className="edit-btn" onClick={() => onEditCopy(copia)}><img src='https://www.svgrepo.com/show/535558/pencil.svg' width="20px" height="20px" alt="Editar" /></button>
                                        <button className="delete-btn" onClick={() => onDeleteCopy(copia.idCopia)}><img src='https://www.svgrepo.com/show/535698/trash.svg' width="20px" height="20px" alt="Eliminar" /></button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="6" className="empty-message">
                                No tienes ninguna copia de esta película.
                            </td>
                        </tr>
                    )}
                    <tr>
                        <td colSpan="6" className="add-row">
                            <div className="add-btn-wrapper">
                                <button className="add-btn" onClick={() => setIsAddModalOpen(true)}>
                                    <img src='https://www.svgrepo.com/show/535579/plus.svg' width="20px" height="20px" alt="Añadir" style={{ marginRight: '8px' }} />
                                    Añadir una copia
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default UserCopiesTable;
