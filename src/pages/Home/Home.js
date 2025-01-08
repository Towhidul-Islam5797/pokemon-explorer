import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PokemonCard from '../../components/PokemonCard/PokemonCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import './Home.css';

const Home = () => {
    const [pokemonList, setPokemonList] = useState([]);
    const [filteredPokemon, setFilteredPokemon] = useState([]);
    const [pokemonTypes, setPokemonTypes] = useState([]);
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

            // Fetch additional details for each Pokémon
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
            setPokemonTypes(types.filter((type) => type !== "unknown")); // Exclude "unknown" type
        };

        fetchAllPokemon().catch((err) =>
            console.error('Error fetching all Pokémon:', err)
        );
        fetchPokemonTypes().catch((err) =>
            console.error('Error fetching Pokémon types:', err)
        );
    }, []);

    const handleSearch = (query) => {
        const filtered = pokemonList.filter((pokemon) =>
            pokemon.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredPokemon(filtered);
        setSearchParams({ page: 1 }); // Reset to the first page after search
    };

    const handleSort = (option) => {
        let sortedList = [...filteredPokemon];
        if (option === 'name') {
            sortedList.sort((a, b) => a.name.localeCompare(b.name));
        }
        setFilteredPokemon(sortedList);
    };

    const handleFilter = (type) => {
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
