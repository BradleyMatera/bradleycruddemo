const express = require('express');
const router = express.Router();
const AnimeCharacter = require('../models/animeCharacter');
const mongoose = require('mongoose');

// Middleware to validate and retrieve an animeCharacter by ID
const getAnimeCharacter = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid or missing ID' });
    }

    const animeCharacter = await AnimeCharacter.findById(id);
    if (!animeCharacter) {
      return res.status(404).json({ message: 'Anime Character not found' });
    }

    res.animeCharacter = animeCharacter;
    next();
  } catch (error) {
    res.status(500).json({ message: `Error retrieving anime character: ${error.message}` });
  }
};

// Fetch all anime characters
router.get('/', async (req, res) => {
  try {
    const animeCharacters = await AnimeCharacter.find();
    res.status(200).json(animeCharacters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch an anime character by ID
router.get('/:id', getAnimeCharacter, (req, res) => {
  res.status(200).json(res.animeCharacter);
});

// Add a new anime character
router.post('/', async (req, res) => {
  const { name, anime, powerLevel } = req.body;

  // Validate request body
  if (!name || !anime || !powerLevel) {
    return res.status(400).json({ message: 'Name, anime, and power level are required' });
  }

  try {
    const newAnimeCharacter = new AnimeCharacter({
      name,
      anime,
      powerLevel,
    });
    const savedCharacter = await newAnimeCharacter.save();
    res.status(201).json(savedCharacter);
  } catch (error) {
    res.status(500).json({ message: `Error creating character: ${error.message}` });
  }
});

// Update an anime character's details
router.patch('/:id', getAnimeCharacter, async (req, res) => {
  const { name, anime, powerLevel } = req.body;

  if (name != null) res.animeCharacter.name = name;
  if (anime != null) res.animeCharacter.anime = anime;
  if (powerLevel != null) res.animeCharacter.powerLevel = powerLevel;

  try {
    const updatedAnimeCharacter = await res.animeCharacter.save();
    res.status(200).json(updatedAnimeCharacter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an anime character by ID
router.delete('/:id', getAnimeCharacter, async (req, res) => {
  try {
    await res.animeCharacter.deleteOne();
    res.status(200).json({ message: 'Anime Character deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;