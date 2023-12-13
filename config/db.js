
/****************************************************************************** *
 ITE5315 – Project * I declare that this assignment is my own work in accordance with Humber Academic Policy. * No part of this assignment has been copied manually or electronically from any other source * (including web sites) or distributed to other students. 
* * Group member Name: Prabhleen , Vijulkumar  Student IDs: N01550441, N01549702 Date: 29/11/2023******************************************************************************/
const { MongoClient } = require('mongodb');
require('dotenv').config();
// const uri = 'mongodb+srv://cluster0:Vi1ju2l3@vijul.65vu1ln.mongodb.net/sample_restaurants';
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// config/db.js

const mongoose = require('mongoose');

// const initialize = (connectionString) => {
//   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
//   const db = mongoose.connection;

//   db.on('error', console.error.bind(console, 'MongoDB connection error:'));
//   db.once('open', () => {
//     console.log('MongoDB connected successfully');
//   });
// };

const initialize = async (connectionString, options) => {
    try {
      await mongoose.connect(connectionString, options);
    } catch (error) {
      throw error;
    }
  };

module.exports = {
  initialize,
};
