// /****************************************************************************** *
//  ITE5315 – Project * I declare that this assignment is my own work in accordance with Humber Academic Policy. * No part of this assignment has been copied manually or electronically from any other source * (including web sites) or distributed to other students. 
// * * Group member Name: Prabhleen , Vijulkumar  Student IDs: N01550441, N01549702 Date: 05/12/2023******************************************************************************/


// models/restaurant.js
const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  address: {
    building: String,
    coord: [Number],
    street: String,  // Add street field
    zipcode: String, // Add zipcode field
  },
  grades: [
    {
      date: Date,
      grade: String,
      score: Number,
    },
  ],
  borough: String, // Add borough field
  cuisine: String, // Add cuisine field
  name: String,
  restaurant_id: { type: String, index: true },
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
