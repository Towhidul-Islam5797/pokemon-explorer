import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <NavLink to="/">
                    <img src="/logo192.png" alt="Pokémon Explorer" className="logo-image" />
                </NavLink>
            </div>
            <ul className="navbar-links">
                <li>
                    <NavLink
                        to="/"
                        className={({ isActive }) => (isActive ? 'active-link' : '')}
                    >
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/favorites"
                        className={({ isActive }) => (isActive ? 'active-link' : '')}
                    >
                        Favorites
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
