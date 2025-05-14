import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSliders,
    faMagnifyingGlass,
    faFilm,
    faCompactDisc,
    faMasksTheater,
    faSort,
    faXmark
} from '@fortawesome/free-solid-svg-icons';

const FilterComponent = ({
    filters,
    onFilterChange,
    onClearFilters,
    availableGenres,
    availableEstados,
    availableSoportes,
    activeTab,
    prettyOrdenLabels
}) => {

    const defaultValues = {
        nombre: '',
        estado: 'Todos',
        plataforma: 'Todas',
        genero: 'Todos',
        anoPelicula: 'Todos',
        orden: 'fecha_asc'
    };

    const prettyLabels = {
        nombre: 'Nombre',
        estado: 'Estado',
        plataforma: 'Plataforma',
        genero: 'Género',
        anoPelicula: 'Año de la película',
        orden: 'Orden'
    };

    return (
        <aside className="filters-panel">
            <h3><FontAwesomeIcon icon={faSliders} /> Filtros</h3>

            <input
                type="text"
                placeholder="Buscar por nombre"
                name="nombre"
                value={filters.nombre}
                onChange={onFilterChange}
            />

            {activeTab === 'coleccion' && (
                <>
                    <label><FontAwesomeIcon icon={faFilm} /> Estado</label>
                    <select name="estado" value={filters.estado} onChange={onFilterChange}>
                        <option>Todos</option>
                        {availableEstados.map((estado, index) => (
                            <option key={index} value={estado}>{estado}</option>
                        ))}
                    </select>

                    <label><FontAwesomeIcon icon={faCompactDisc} /> Plataforma</label>
                    <select name="plataforma" value={filters.plataforma} onChange={onFilterChange}>
                        <option>Todas</option>
                        {availableSoportes.map((soporte, index) => (
                            <option key={index} value={soporte}>{soporte}</option>
                        ))}
                    </select>
                </>
            )}

            <label><FontAwesomeIcon icon={faMasksTheater} /> Género</label>
            <select name="genero" value={filters.genero} onChange={onFilterChange}>
                <option>Todos</option>
                {availableGenres.map((genero, index) => (
                    <option key={index} value={genero}>{genero}</option>
                ))}
            </select>

            <label><FontAwesomeIcon icon={faSort} /> Ordenar por</label>
            <select name="orden" value={filters.orden} onChange={onFilterChange}>
                <option value="fecha_asc">Fecha de adición ↑</option>
                <option value="fecha_desc">Fecha de adición ↓</option>
                <option value="año_asc">Año de la película ↑</option>
                <option value="año_desc">Año de la película ↓</option>
            </select>

            {Object.entries(filters).some(
                ([key, value]) => value && value !== defaultValues[key]
            ) && (
                <div className="active-filters">
                    {Object.entries(filters).map(([key, value]) => {
                        if (!value || value === defaultValues[key]) return null;

                        let label = prettyLabels[key] || key;
                        let displayValue = prettyOrdenLabels?.[value] || value;

                        return (
                            <span key={key} className="filter-chip">
                                {label}: {displayValue}
                                <button
                                    onClick={() =>
                                        onFilterChange({
                                            target: {
                                                name: key,
                                                value: defaultValues[key] || ''
                                            }
                                        })
                                    }
                                >
                                    <FontAwesomeIcon icon={faXmark} />
                                </button>
                            </span>
                        );
                    })}
                    <button className="clear-filters-btn" onClick={onClearFilters}>
                        Limpiar filtros
                    </button>
                </div>
            )}
        </aside>
    );
};

export default FilterComponent;
