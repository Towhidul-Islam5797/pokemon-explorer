const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Path to favorites.json
const favoritesFilePath = path.join(__dirname, 'favorites.json');

// Ensure favorites.json exists
if (!fs.existsSync(favoritesFilePath)) {
    fs.writeFileSync(favoritesFilePath, JSON.stringify([]));
}

// API to get favorites
app.get('/favorites', (req, res) => {
    fs.readFile(favoritesFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading favorites.json:', err);
            res.status(500).send('Error reading favorites');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// API to add a favorite
app.post('/favorites', (req, res) => {
    const newFavorite = req.body; // Expecting { id: <ID>, name: <NAME>, urlById: <URL>, urlByName: <URL> }
    fs.readFile(favoritesFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading favorites.json:', err);
            res.status(500).send('Error saving favorite');
        } else {
            const favorites = JSON.parse(data);
            // Prevent duplicates
            if (!favorites.find((fav) => fav.id === newFavorite.id)) {
                favorites.push(newFavorite);
                fs.writeFile(favoritesFilePath, JSON.stringify(favorites, null, 2), (err) => {
                    if (err) {
                        console.error('Error writing to favorites.json:', err);
                        res.status(500).send('Error saving favorite');
                    } else {
                        res.status(200).send('Favorite saved');
                    }
                });
            } else {
                res.status(400).send('Favorite already exists');
            }
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
