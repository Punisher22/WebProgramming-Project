
// /****************************************************************************** *
//  ITE5315 – Project * I declare that this assignment is my own work in accordance with Humber Academic Policy. * No part of this assignment has been copied manually or electronically from any other source * (including web sites) or distributed to other students. 
// * * Group member Name: Prabhleen , Vijulkumar  Student IDs: N01550441, N01549702 Date: 29/11/2023******************************************************************************/


// app.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const jwt = require('jsonwebtoken'); // Import JWT library

const db = require('./db');
const restaurantRoutes = require('./routes/restaurantRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Middleware for JWT authentication

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, 'vijul1project', (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = user;
    next();
  });
};



// Middleware to enforce authentication for PUT and POST requests
app.use('/api/restaurants', (req, res, next) => {
  if (req.method === 'PUT' || req.method === 'POST') {
    authenticateToken(req, res, next);
  } else {
    next();
  }
});


async function startServer() {
  // Update your MongoDB connection string and options here
  const connectionString = 'mongodb+srv://cluster0:Vi1ju2l3@vijul.65vu1ln.mongodb.net/sample_restaurants';
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  // Initialize MongoDB connection
  await db.initialize(connectionString, options);

  // Check MongoDB connection status
  const isConnected = db.checkConnection();
  if (!isConnected) {
    console.error('MongoDB connection is not established. Exiting...');
    process.exit(1); // Exit the application
  }

  // Define routes
  app.use('/api/restaurants', restaurantRoutes);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Call the asynchronous function to start the server
startServer();
