import React, { useState, useEffect } from 'react';
import PokemonCard from '../../components/PokemonCard/PokemonCard';
import './Favorites.css';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        // Fetch favorites from localStorage
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);
    }, []);

    const handleRemoveFavorite = (pokemonName) => {
        // Remove Pokémon from favorites
        const updatedFavorites = favorites.filter((pokemon) => pokemon.name !== pokemonName);
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    return (
        <div className="favorites-container">
            <h1 className="favorites-title">Your Favorite Pokémon</h1>
            {favorites.length === 0 ? (
                <p className="no-favorites-message">No favorites added yet!</p>
            ) : (
                <div className="favorites-grid">
                    {favorites.map((pokemon) => (
                        <div key={pokemon.name} className="favorite-card">
                            <PokemonCard pokemon={pokemon} />
                            <button
                                className="remove-button"
                                onClick={() => handleRemoveFavorite(pokemon.name)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;
