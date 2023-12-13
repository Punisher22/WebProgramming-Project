
// /****************************************************************************** *
//  ITE5315 – Project * I declare that this assignment is my own work in accordance with Humber Academic Policy. * No part of this assignment has been copied manually or electronically from any other source * (including web sites) or distributed to other students. 
// * * Group member Name: Prabhleen , Vijulkumar  Student IDs: N01550441, N01549702 Date: 29/11/2023******************************************************************************/


// app.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser'); 
require('dotenv').config();

// Importing the Express Handlebars engine
const exphbs = require('express-handlebars');
const helpers = require('./helpers');
const db = require('./db');
const restaurantRoutes = require('./routes/restaurantRoutes');




const app = express();
const PORT = process.env.PORT || 5000;

// Use cookie-parser middleware
app.use(cookieParser());
const secretKey = process.env.SECRET_KEY;
// Use express-session middleware
app.use(session({
  secret: secretKey, // Change this to a secure secret key
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Set to true in a production environment with HTTPS
    httpOnly: true,
    maxAge: 3600000, // Session duration in milliseconds (1 hour in this example)
  },
}));


// app.use(methodOverride('_method'));
// Set up the Handlebars view engine
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public/images'));

// Sample user data (in-memory for simplicity)
const users = [
  { username: 'user1', password: 'password1' },
  { username: 'user2', password: 'password2' },
];


 




// Define a root URL route
app.get('/', function(req, res) {
  // renders index.hbs layout with title data
res.render('index', { title: 'Express', user: req.session.user });
});

// about us page
app.get('/about-us', function(req, res) {
  // renders about.hbs layout with title data
res.render('about');
});

app.get('/contact', function(req, res) {
  // renders contact.hbs layout with title data
res.render('contact');
});

app.get('/display', async function(req, res) {
  try {
      // Fetch all restaurants data from your database
      const allRestaurantsData = await db.getAllRestaurants();
 
      // Render the display.hbs view and pass the data
      res.render('display', { restaurants: allRestaurantsData });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/login', function(req, res) {
  // renders login.hbs layout with title data
res.render('login');
});



app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', username, password);

  const user = users.find(u => u.username === username && u.password === password);
  console.log('Found user:', user);

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // Set user information in the session
  req.session.user = {
    userId: user.username,
    username: user.username,
  };

  res.json({ message: 'Login successful' });
});


app.get('/update', function(req, res) {
  // renders update.hbs layout with title data
  res.render('update', { user: req.session.user });
});



// Middleware to enforce authentication for PUT and POST requests
// Middleware to enforce authentication for PUT and POST requests
app.use('/api/restaurants', (req, res, next) => {
  if (req.method === 'PUT' || req.method === 'POST') {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }
  next();
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

