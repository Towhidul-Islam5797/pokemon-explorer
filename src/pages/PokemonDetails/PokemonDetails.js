import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PokemonDetails.css';

const PokemonDetails = () => {
    const { name } = useParams(); // Get the Pokémon name or ID from the URL
    const [pokemonDetails, setPokemonDetails] = useState(null);
    const [moves, setMoves] = useState([]);
    const [evolutionChain, setEvolutionChain] = useState([]);
    const [error, setError] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false); // State to track favorite status


    // Type color mapping
    const typeColors = {
        normal: '#A8A77A',
        fire: '#EE8130',
        water: '#6390F0',
        electric: '#F7D02C',
        grass: '#7AC74C',
        ice: '#96D9D6',
        fighting: '#C22E28',
        poison: '#A33EA1',
        ground: '#E2BF65',
        flying: '#A98FF3',
        psychic: '#F95587',
        bug: '#A6B91A',
        rock: '#B6A136',
        ghost: '#735797',
        dragon: '#6F35FC',
        dark: '#705746',
        steel: '#B7B7CE',
        fairy: '#D685AD',
    };
    

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            try {
                // Fetch Pokémon details
                const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
                const res = await fetch(url);
                if (!res.ok) throw new Error('Pokemon not found');
                const data = await res.json();
                setPokemonDetails(data);

                // Fetch detailed info for each move
                const movesDetails = await Promise.all(
                    data.moves.map(async (move) => {
                        const moveResponse = await fetch(move.move.url);
                        const moveData = await moveResponse.json();
                        return {
                            name: moveData.name,
                            level: move.version_group_details[0]?.level_learned_at || '-',
                            type: moveData.type.name,
                            category: moveData.damage_class?.name || '-',
                            power: moveData.power || '-',
                            accuracy: moveData.accuracy || '-',
                            pp: moveData.pp || '-',
                        };
                    })
                );

                setMoves(movesDetails);
                const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
                const alreadyFavorited = favorites.some((fav) => fav.name === data.name);
                setIsFavorited(alreadyFavorited);
            } catch (err) {
                console.error('Error fetching Pokémon details:', err);
                setError(true);
            }
        };

        const fetchEvolutionChain = async () => {
            try {
                // Fetch Pokémon species details for evolution chain
                const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${name}`;
                const speciesRes = await fetch(speciesUrl);
                if (!speciesRes.ok) throw new Error('Species not found');
                const speciesData = await speciesRes.json();

                if (speciesData.evolution_chain?.url) {
                    const evolutionRes = await fetch(speciesData.evolution_chain.url);
                    const evolutionData = await evolutionRes.json();

                    const chain = [];
                    let current = evolutionData.chain;

                    // Traverse the evolution chain
                    while (current) {
                        chain.push({
                            name: current.species.name,
                            id: current.species.url.split('/').slice(-2, -1)[0], // Extract Pokémon ID
                        });
                        current = current.evolves_to[0];
                    }

                    setEvolutionChain(chain);
                }
            } catch (err) {
                console.error('Error fetching evolution chain:', err);
            }
        };

        fetchPokemonDetails();
        fetchEvolutionChain();
    }, [name]);

    const handleToggleFavorite = () => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (isFavorited) {
            const updatedFavorites = favorites.filter((fav) => fav.name !== pokemonDetails.name);
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        } else {
            const newFavorite = {
                name: pokemonDetails.name,
                image: pokemonDetails.sprites.other['official-artwork'].front_default,
            };
            localStorage.setItem('favorites', JSON.stringify([...favorites, newFavorite]));
        }
        setIsFavorited(!isFavorited);
    };

    if (error) {
        return <p>Unable to load Pokémon details. Please try again later.</p>;
    }

    if (!pokemonDetails) {
        return <p>Loading Pokémon details...</p>;
    }

    const {
        sprites,
        abilities,
        types,
        stats,
        weight,
        height,
        base_experience,
    } = pokemonDetails;

    return (
        <div className="pokemon-details-container">
            <div className="pokemon-details">
                <h1 className="pokemon-name">{pokemonDetails.name}</h1>
                <p className="pokemon-id">#{pokemonDetails.id.toString().padStart(3, '0')}</p>
                <img
                    src={sprites.other['official-artwork'].front_default}
                    alt={pokemonDetails.name}
                    className="pokemon-image"
                />
                <button
                    className={`favorite-button ${isFavorited ? 'favorited' : ''}`}
                    onClick={handleToggleFavorite}
                >
                    ♥
                </button>

                <div className="details-grid">
                    <div className="details-row">
                        <h3>Type</h3>
                        {types.map((type) => (
                            <span
                                key={type.type.name}
                                className="type"
                                style={{ backgroundColor: typeColors[type.type.name] }}
                            >
                                {type.type.name}
                            </span>
                        ))}
                    </div>

                    <div className="details-row">
                        <h3>Abilities</h3>
                        <ul>
                            {abilities.map((ability) => (
                                <li key={ability.ability.name}>{ability.ability.name}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="details-row">
                        <h3>Base Stats</h3>
                        <ul>
                            {stats.map((stat) => (
                                <li key={stat.stat.name}>
                                    <strong>{stat.stat.name}:</strong> {stat.base_stat}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="details-row">
                        <h3>Additional Info</h3>
                        <p><strong>Height:</strong> {height / 10} m</p>
                        <p><strong>Weight:</strong> {weight / 10} kg</p>
                        <p><strong>Base Experience:</strong> {base_experience}</p>
                    </div>
                </div>

                <div className="details-row">
                    <h3 align="center">Evolution Chain</h3>
                    <div className="evolution-chain">
                        {evolutionChain.length > 0 ? (
                            evolutionChain.map((evolution, index) => (
                                <React.Fragment key={index}>
                                    <a href={`/pokemon/${evolution.name}`} className="evolution-link">
                                        <img
                                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolution.id}.png`}
                                            alt={evolution.name}
                                            className="evolution-image"
                                        />
                                        <p className="evolution-name">{evolution.name}</p>
                                    </a>
                                    {index < evolutionChain.length - 1 && (
                                        <span className="evolution-arrow">→</span>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <p>No evolution chain available.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="moves-details">
                <h1 className='movesets'>Movesets</h1>
                <table className="moves-table">
                    <thead>
                        <tr>
                            <th>Level</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Category</th>
                            <th>Power</th>
                            <th>Accuracy</th>
                            <th>PP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {moves.map((move, index) => (
                            <tr key={index}>
                                <td>{move.level}</td>
                                <td>{move.name}</td>
                                <td>{move.type}</td>
                                <td>{move.category}</td>
                                <td>{move.power}</td>
                                <td>{move.accuracy}</td>
                                <td>{move.pp}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PokemonDetails;
