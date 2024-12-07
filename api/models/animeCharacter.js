const mongoose = require('mongoose');

const animeCharacterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  anime: {
    type: String,
    required: true,
  },
  powerLevel: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model('AnimeCharacter', animeCharacterSchema);