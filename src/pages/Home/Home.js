import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PokemonCard from '../../components/PokemonCard/PokemonCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import './Home.css';

const Home = () => {
    const [pokemonList, setPokemonList] = useState([]);
    const [filteredPokemon, setFilteredPokemon] = useState([]);
    const [pokemonTypes, setPokemonTypes] = useState([]);
    const [notFoundMessage, setNotFoundMessage] = useState(''); // Track not-found message
    const [searchParams, setSearchParams] = useSearchParams();
    const pokemonsPerPage = 108;

    const currentPage = parseInt(searchParams.get('page')) || 1;

    useEffect(() => {
        const fetchAllPokemon = async () => {
            const totalPokemon = 1302; // Total Pokémon in PokéAPI
            const response = await fetch(
                `https://pokeapi.co/api/v2/pokemon?limit=${totalPokemon}`
            );
            const data = await response.json();

            const detailedPokemonList = await Promise.all(
                data.results.map(async (pokemon) => {
                    const detailsResponse = await fetch(pokemon.url);
                    const details = await detailsResponse.json();
                    return {
                        name: pokemon.name,
                        url: pokemon.url,
                        id: details.id,
                        types: details.types.map((type) => type.type.name), // Get types
                    };
                })
            );

            setPokemonList(detailedPokemonList);
            setFilteredPokemon(detailedPokemonList); // Initialize filtered list
        };

        const fetchPokemonTypes = async () => {
            const response = await fetch(`https://pokeapi.co/api/v2/type`);
            const data = await response.json();
            const types = data.results.map((type) => type.name);
            setPokemonTypes(types.filter((type) => type !== 'unknown')); // Exclude "unknown" type
        };

        fetchAllPokemon().catch((err) =>
            console.error('Error fetching all Pokémon:', err)
        );
        fetchPokemonTypes().catch((err) =>
            console.error('Error fetching Pokémon types:', err)
        );
    }, []);

    const handleSearch = async (query) => {
        setNotFoundMessage(''); // Clear any previous not-found message
        if (!query.trim()) {
            setFilteredPokemon(pokemonList); // Reset to the full list for empty queries
            return;
        }

        try {
            // Fetch Pokémon species by name
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${query.toLowerCase()}`);
            if (!response.ok) {
                setNotFoundMessage(`Sorry, '${query}' not found.`); // Set the not-found message
                setFilteredPokemon([]);
                return;
            }
            const speciesData = await response.json();

            // Fetch detailed Pokémon data for the species
            const detailsResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${speciesData.name}`);
            if (!detailsResponse.ok) {
                setNotFoundMessage(`Sorry, '${query}' not found.`);
                setFilteredPokemon([]);
                return;
            }
            const detailsData = await detailsResponse.json();

            // Format the Pokémon data
            const pokemonDetails = {
                name: detailsData.name,
                url: `https://pokeapi.co/api/v2/pokemon/${detailsData.id}`,
                id: detailsData.id,
                types: detailsData.types.map((type) => type.type.name),
            };

            setFilteredPokemon([pokemonDetails]); // Update filtered Pokémon list with the result
            setSearchParams({ page: 1 }); // Reset to the first page after search
        } catch (error) {
            console.error('Error during search:', error);
            setNotFoundMessage(`Sorry, '${query}' not found.`);
            setFilteredPokemon([]); // Clear results if there's an error
        }
    };

    const handleSort = (option) => {
        let sortedList = [...filteredPokemon];
        if (option === 'name') {
            sortedList.sort((a, b) => a.name.localeCompare(b.name));
        }
        setFilteredPokemon(sortedList);
    };

    const handleFilter = (type) => {
        setNotFoundMessage(''); // Clear not-found message for filters
        if (!type) {
            setFilteredPokemon(pokemonList); // Reset to full list
        } else {
            const filtered = pokemonList.filter((pokemon) =>
                pokemon.types.includes(type)
            );
            setFilteredPokemon(filtered);
        }
    };

    const handleClear = () => {
        setNotFoundMessage(''); // Clear not-found message
        setFilteredPokemon(pokemonList);
        setSearchParams({ page: 1 });
    };

    const handlePageChange = (page) => {
        setSearchParams({ page });
    };

    const startIndex = (currentPage - 1) * pokemonsPerPage;
    const paginatedPokemon = filteredPokemon.slice(
        startIndex,
        startIndex + pokemonsPerPage
    );

    const totalPages = Math.ceil(filteredPokemon.length / pokemonsPerPage);

    return (
        <div className="home">
            {/* Add the Search Bar */}
            <SearchBar
                onSearch={handleSearch}
                onSort={handleSort}
                onFilter={handleFilter}
                onClear={handleClear}
                types={pokemonTypes} // Pass types to SearchBar
            />

            {/* Display Not-Found Message */}
            {notFoundMessage && <p className="not-found-message">{notFoundMessage}</p>}

            {/* Pokémon Grid */}
            <div className="pokemon-grid">
                {paginatedPokemon.map((pokemon) => (
                    <PokemonCard key={pokemon.name} pokemon={pokemon} />
                ))}
            </div>

            {/* Pagination */}
            <div className="pagination">
                <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(1)}
                >
                    First
                </button>
                <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    &lt;
                </button>
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        className={currentPage === index + 1 ? 'active' : ''}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    &gt;
                </button>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(totalPages)}
                >
                    Last
                </button>
            </div>
        </div>
    );
};

export default Home;
