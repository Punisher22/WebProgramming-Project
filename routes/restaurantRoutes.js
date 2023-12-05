// /****************************************************************************** *
//  ITE5315 – Project * I declare that this assignment is my own work in accordance with Humber Academic Policy. * No part of this assignment has been copied manually or electronically from any other source * (including web sites) or distributed to other students. 
// * * Group member Name: Prabhleen , Vijulkumar  Student IDs: N01550441, N01549702 Date: 05/12/2023******************************************************************************/


// routes/restaurantRoutes.js

const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');
const jwt = require('jsonwebtoken');
const db = require('../db');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
    jwt.verify(token, 'vijul1project', (err, user) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });
      req.user = user;
      next();
    });
  };



// POST /api/restaurants
router.post('/', authenticateToken, async (req, res) => {
  try {
    const newRestaurant = await db.addNewRestaurant(req.body);
    res.status(201).json(newRestaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/restaurants
router.get('/', async (req, res) => {
  try {
    const { page, perPage, borough } = req.query;
    const restaurants = await db.getAllRestaurants(page, perPage, borough);
    res.json(restaurants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/restaurants/:id
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await db.getRestaurantById(req.params.id);
    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ error: 'Restaurant not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT /api/restaurants/:id
router.put('/:id',authenticateToken, async (req, res) => {
  try {
    const updatedRestaurant = await db.updateRestaurantById(req.body, req.params.id);
    if (updatedRestaurant) {
      res.json(updatedRestaurant);
    } else {
      res.status(404).json({ error: 'Restaurant not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /api/restaurants/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.deleteRestaurantById(req.params.id);
    if (result) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Restaurant not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
