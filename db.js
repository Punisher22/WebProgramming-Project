// /****************************************************************************** *
//  ITE5315 – Project * I declare that this assignment is my own work in accordance with Humber Academic Policy. * No part of this assignment has been copied manually or electronically from any other source * (including web sites) or distributed to other students. 
// * * Group member Name: Prabhleen , Vijulkumar  Student IDs: N01550441, N01549702 Date: 05/12/2023******************************************************************************/


// db.js

const mongoose = require('mongoose');
const configDB = require('./config/db');

const initialize = async (connectionString) => {
    try {
      // Update connection options
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      };
      
    await configDB.initialize(connectionString, options);
    console.log('MongoDB connection established successfully');
  } catch (error) {
    console.error('Error establishing MongoDB connection:', error);
  }
};

// const initialize = (connectionString) => {
//     configDB.initialize(connectionString);
//   };


// const initialize = async (connectionString) => {
//   try {
//       await configDB.initialize(connectionString);
//       console.log('MongoDB connection established successfully');
//       } catch (error) {
//       console.error('Error establishing MongoDB connection:', error);
//       }
//     };
  
const checkConnection = () => {
    const isConnected = mongoose.connection.readyState === 1; // 1 indicates connected
    return isConnected;
  };
  






const Restaurant = require('./models/restaurant');

const addNewRestaurant = async (data) => {
  try {
    const newRestaurant = new Restaurant(data);
    const savedRestaurant = await newRestaurant.save();
    return savedRestaurant;
  } catch (error) {
    throw error;
  }
};

// const getAllRestaurants = async (page, perPage, borough) => {
//   try {
//     const skip = (page - 1) * perPage;
//     const query = borough ? { 'address.borough': borough } : {};
//     const restaurants = await Restaurant.find(query)
//       .sort({ restaurant_id: 1 })
//       .skip(skip)
//       .limit(perPage);
//     return restaurants;
//   } catch (error) {
//     throw error;
//   }
// };

// const getAllRestaurants = async (page, perPage, borough) => {
//     try {
//       const skip = (page - 1) * perPage;
//       const query = borough ? { 'address.borough': borough } : {};
//       const restaurants = await Restaurant.find(query)
//         .sort({ restaurant_id: 1 })
//         .skip(skip)
//         .limit(perPage)
//         .lean(); // Add .lean() here
//       return restaurants;
//     } catch (error) {
//       throw error;
//     }
//   };

const getAllRestaurants = async (page, perPage, borough) => {
    try {
      const skip = (page - 1) * perPage;
      const query = borough ? { 'address.borough': borough } : {};
  
      let restaurants = [];
      let batchIndex = 0;
  
      do {
        const batch = await Restaurant.find(query)
          .sort({ restaurant_id: 1 })
          .skip(skip + batchIndex * perPage)
          .limit(perPage)
          .lean();
  
        if (batch.length === 0) {
          break; // No more data to fetch
        }
  
        restaurants = restaurants.concat(batch);
        batchIndex++;
      } while (restaurants.length < perPage);
  
      return restaurants;
    } catch (error) {
      throw error;
    }
  };

const getRestaurantById = async (id) => {
  try {
    const restaurant = await Restaurant.findById(id);
    return restaurant;
  } catch (error) {
    throw error;
  }
};


const searchRestaurantsByName = async (name) => {
  try {
    // Use a regular expression for case-insensitive partial search
    const regex = new RegExp(name, 'i');

    // Perform the search in the 'name' field of the Restaurant model
    const filteredRestaurants = await Restaurant.find({ name: regex }).lean();

    return filteredRestaurants;
  } catch (error) {
    console.error('Error in searchRestaurantsByName:', error);
    throw error;
  }
}

const updateRestaurantById = async (data, id) => {
  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, data, { new: true });
    return updatedRestaurant;
  } catch (error) {
    throw error;
  }
};



const deleteRestaurantById = async (id) => {
  try {
    const result = await Restaurant.findByIdAndDelete(id);
    return result !== null; // Return true if a document was deleted
  } catch (error) {
    throw error;
  }
};

module.exports = {
  initialize,
  checkConnection,
  addNewRestaurant,
  getAllRestaurants,
  getRestaurantById,
  searchRestaurantsByName,
  updateRestaurantById,
  deleteRestaurantById,
};

