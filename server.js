const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");

const Points = require('./models/Points');

const mongoose = require('mongoose');
const url = 'mongodb+srv://michaelparekh:codecademy-heroku-trivia@trivia-website.i7el2.mongodb.net/trivia-website?retryWrites=true&w=majority';
mongoose.connect(url, { useNewUrlParser: true }, { useUnifiedTopology: true });

const db = mongoose.connection
db.once('open', _ => {
  console.log('Database Connected: ', url);
})
db.on('error', err => {
  console.error('Connection Error: ', err);
})

app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/points', async (req, res) => {
  try {
    const points = await Points.find();
    res.send(points);

    return res.status(200).json({
      success: true,
      data: points
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
})

app.post('/points', async (req, res) => {
  try {
    const { points } = req.body;
    
    const pointsObject = new Points({
      points: points
    })
    await pointsObject.save();

    return res.status(200).json({
      success: true,
      data: pointsObject
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
})

app.listen(5000, function() {
  console.log('Listening on Port 5000...');
})