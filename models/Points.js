const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PointsSchema = new Schema({
  points: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('Points', PointsSchema);