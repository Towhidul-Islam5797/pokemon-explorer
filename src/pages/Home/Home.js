import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PokemonCard from '../../components/PokemonCard/PokemonCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import './Home.css';

const Home = () => {
    const [pokemonList, setPokemonList] = useState([]);
    const [filteredPokemon, setFilteredPokemon] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const pokemonsPerPage = 104; // 10 rows × 10 Pokémon per row

    // Get the current page from the URL, default to 1
    const currentPage = parseInt(searchParams.get('page')) || 1;

    useEffect(() => {
        // Fetch all Pokémon
        const fetchAllPokemon = async () => {
            const totalPokemon = 1302; // Set the maximum number of Pokémon in PokeAPI
            const response = await fetch(
                `https://pokeapi.co/api/v2/pokemon?limit=${totalPokemon}`
            );
            const data = await response.json();
            setPokemonList(data.results);
            setFilteredPokemon(data.results); // Initialize filtered list
        };

        fetchAllPokemon().catch((err) =>
            console.error('Error fetching all Pokémon:', err)
        );
    }, []);

    const handleSearch = (query) => {
        // Filter Pokémon by name
        const filtered = pokemonList.filter((pokemon) =>
            pokemon.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredPokemon(filtered);
        setSearchParams({ page: 1 }); // Reset to the first page after search
    };

    // Pagination handlers
    const handlePageChange = (page) => {
        setSearchParams({ page }); // Update the page in the URL
    };

    // Calculate paginated Pokémon
    const startIndex = (currentPage - 1) * pokemonsPerPage;
    const paginatedPokemon = filteredPokemon.slice(
        startIndex,
        startIndex + pokemonsPerPage
    );

    // Total number of pages
    const totalPages = Math.ceil(filteredPokemon.length / pokemonsPerPage);

    return (
        <div className="home">
            {/* Add the Search Bar */}
            <SearchBar onSearch={handleSearch} />

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
