const exphbs = require('express-handlebars');

// Define the formatDate helper
const formatDate = function(date) {
    return new Date(date).toLocaleDateString();
};

// Register the helper with Handlebars
exphbs.create().handlebars.registerHelper('formatDate', formatDate);

module.exports = { formatDate };
