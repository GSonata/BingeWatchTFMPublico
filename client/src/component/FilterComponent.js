import React from 'react';

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
            <h3>🎛️ Filtros</h3>
            <input
                type="text"
                placeholder="🔍 Buscar por nombre"
                name="nombre"
                value={filters.nombre}
                onChange={onFilterChange}
            />

            {activeTab === 'coleccion' && (
                <>
                    <label>🎞️ Estado</label>
                    <select name="estado" value={filters.estado} onChange={onFilterChange}>
                        <option>Todos</option>
                        {availableEstados.map((estado, index) => (
                            <option key={index} value={estado}>{estado}</option>
                        ))}
                    </select>

                    <label>💿 Plataforma</label>
                    <select name="plataforma" value={filters.plataforma} onChange={onFilterChange}>
                        <option>Todas</option>
                        {availableSoportes.map((soporte, index) => (
                            <option key={index} value={soporte}>{soporte}</option>
                        ))}
                    </select>
                </>
            )}

            <label>🎭 Género</label>
            <select name="genero" value={filters.genero} onChange={onFilterChange}>
                <option>Todos</option>
                {availableGenres.map((genero, index) => (
                    <option key={index} value={genero}>{genero}</option>
                ))}
            </select>

            <label>📌 Ordenar por</label>
            <select name="orden" value={filters.orden} onChange={onFilterChange}>
                <option value="fecha_asc">📅 Fecha de adición ↑</option>
                <option value="fecha_desc">📅 Fecha de adición ↓</option>
                <option value="año_asc">🎬 Año de la película ↑</option>
                <option value="año_desc">🎬 Año de la película ↓</option>
            </select>

            {Object.entries(filters).some(
                ([key, value]) => value && value !== defaultValues[key]
            ) && (
                <div className="active-filters">
                    {Object.entries(filters).map(([key, value]) => {
                        if (!value || value === defaultValues[key]) return null;

                        let label = prettyLabels[key] || key;
                        let displayValue = value;

                        if (key === 'orden' && prettyOrdenLabels?.[value]) {
                            displayValue = prettyOrdenLabels[value];
                        }

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
                                    ❌
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
