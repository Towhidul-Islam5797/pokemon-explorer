import React, { useState } from 'react';

const Favorites = () => {
    const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favorites')) || []);

    return (
        <div className="p-4">
            <h2>Favorites</h2>
            {favorites.length === 0 ? (
                <p>No favorites added.</p>
            ) : (
                <ul>
                    {favorites.map((pokemon, index) => (
                        <li key={index} className="capitalize">{pokemon}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Favorites;
