// routes/animeCharacters.js
const express = require('express');
const router = express.Router();
const AnimeCharacter = require('../models/animeCharacter');
const mongoose = require('mongoose');
const passport = require('passport');

const passportService = require('../services/passport');
const ProtectedRoute = passport.authenticate('jwt', { session: false });


// Middleware to validate and retrieve an animeCharacter by ID
const getAnimeCharacter = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate that the provided ID is a valid MongoDB ObjectId
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid or missing ID' });
        }

        // Query the database for the animeCharacter by ID
        const animeCharacter = await AnimeCharacter.findById(id);
        if (!animeCharacter) {
            // If not found, respond with a 404 error
            return res.status(404).json({ message: 'Anime Character not found' });
        }

        // Attach the found character to the response object for later use
        res.animeCharacter = animeCharacter;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        // Handle unexpected errors
        res.status(500).json({ message: `Error retrieving anime character: ${error.message}` });
    }
};

// Fetch all anime characters
router.get('/', ProtectedRoute, async (req, res) => {
    try {
        // Retrieve all animeCharacters from the database
        const animeCharacters = await AnimeCharacter.find();
        console.log('[DEBUG] Fetched Characters:', animeCharacters); // Debugging log
        res.status(200).json(animeCharacters); // Send the characters as JSON
    } catch (error) {
        // Handle errors during the database query
        console.error('[ERROR] Fetching Characters:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Fetch a single anime character by ID
router.get('/:id', getAnimeCharacter, (req, res) => {
    // Respond with the animeCharacter found by the getAnimeCharacter middleware
    res.status(200).json(res.animeCharacter);
});

// Create a new anime character
router.post('/', async (req, res) => {
    const { name, anime, powerLevel } = req.body;

    // Validate required fields in the request body
    if (!name || !anime || !powerLevel) {
        return res.status(400).json({ message: 'Name, anime, and power level are required' });
    }

    try {
        // Create a new instance of the AnimeCharacter model
        const newCharacter = new AnimeCharacter({ name, anime, powerLevel });
        const savedCharacter = await newCharacter.save(); // Save the character to the database
        console.log('[DEBUG] New Character Saved:', savedCharacter); // Debugging log
        res.status(201).json(savedCharacter); // Respond with the saved character
    } catch (error) {
        // Handle errors during the creation process
        console.error('[ERROR] Creating Character:', error.message);
        res.status(500).json({ message: `Error creating character: ${error.message}` });
    }
});

// Update an anime character by ID
router.patch('/:id', getAnimeCharacter, async (req, res) => {
    const { name, anime, powerLevel } = req.body;

    // Update only the provided fields
    if (name != null) res.animeCharacter.name = name;
    if (anime != null) res.animeCharacter.anime = anime;
    if (powerLevel != null) res.animeCharacter.powerLevel = powerLevel;

    try {
        // Save the updated animeCharacter
        const updatedCharacter = await res.animeCharacter.save();
        console.log('[DEBUG] Updated Character:', updatedCharacter); // Debugging log
        res.status(200).json(updatedCharacter); // Respond with the updated character
    } catch (error) {
        // Handle errors during the update process
        console.error('[ERROR] Updating Character:', error.message);
        res.status(400).json({ message: error.message });
    }
});

// Delete an anime character by ID
router.delete('/:id', getAnimeCharacter, async (req, res) => {
    try {
        // Delete the character using the Mongoose deleteOne method
        await res.animeCharacter.deleteOne();
        console.log('[DEBUG] Deleted Character:', res.animeCharacter); // Debugging log
        res.status(200).json({ message: 'Anime Character deleted successfully' });
    } catch (error) {
        // Handle errors during the deletion process
        console.error('[ERROR] Deleting Character:', error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;