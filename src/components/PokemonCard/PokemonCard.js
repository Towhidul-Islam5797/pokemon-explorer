import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './PokemonCard.css';

const PokemonCard = ({ pokemon }) => {
    const [pokemonDetails, setPokemonDetails] = useState(null);

    useEffect(() => {
        // Fetch Pokémon details dynamically
        fetch(pokemon.url)
            .then((res) => res.json())
            .then((data) => setPokemonDetails(data))
            .catch((err) => console.error('Error fetching Pokémon details:', err));
    }, [pokemon.url]);

    if (!pokemonDetails) {
        return <div className="pokemon-card">Loading...</div>;
    }

    const { id, sprites, name } = pokemonDetails;

    return (
        <div className="pokemon-card">
            <img
                src={sprites?.other?.['official-artwork']?.front_default || sprites?.front_default}
                alt={name}
                className="pokemon-image"
            />
            <h3 className="pokemon-name">{name}</h3>
            <p className="pokemon-id">#{id.toString().padStart(3, '0')}</p>
            <Link to={`/pokemon/${name}`} className="view-details-btn">
                View Details
            </Link>
        </div>
    );
};

export default PokemonCard;
