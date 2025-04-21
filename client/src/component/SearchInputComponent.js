import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchInputComponent = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && query.trim() !== '') {
            navigate(`/search?query=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <input
            type="text"
            placeholder="Buscar películas o usuarios..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
                width: '100%',
                maxWidth: '500px',
                padding: '0.8rem',
                fontSize: '1rem',
                borderRadius: 'var(--border-radius)',
                border: 'none',
                marginBottom: '1.5rem',
                backgroundColor: 'var(--card-background)',
                color: 'var(--text-color)',
                outline: 'none'
            }}
        />
    );
};

export default SearchInputComponent;
