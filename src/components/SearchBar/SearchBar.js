import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, onSort, onFilter, onClear, types }) => {
    const [query, setQuery] = useState('');
    const [selectedType, setSelectedType] = useState('');

    const handleSearch = () => {
        onSearch(query);
    };

    const handleSortChange = (e) => {
        onSort(e.target.value);
    };

    const handleFilterChange = (e) => {
        const type = e.target.value;
        setSelectedType(type);
        onFilter(type);
    };

    const handleClear = () => {
        setQuery('');
        setSelectedType('');
        onClear();
    };

    return (
        <div className="search-bar-container">
            <input
                type="text"
                className="search-bar"
                placeholder="Search Pokémon"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button className="search-button" onClick={handleSearch}>
                Search
            </button>
            <select className="sort-dropdown" onChange={handleSortChange}>
                <option value="">Sort by</option>
                <option value="name">Name</option>
            </select>
            <select
                className="filter-dropdown"
                value={selectedType}
                onChange={handleFilterChange}
            >
                <option value="">Filter by Type</option>
                {types.map((type) => (
                    <option key={type} value={type}>
                        {type}
                    </option>
                ))}
            </select>
            <button className="clear-button" onClick={handleClear}>
                Clear Selection
            </button>
        </div>
    );
};

export default SearchBar;
