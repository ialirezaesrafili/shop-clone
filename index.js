const dotnev = require('dotenv');
dotnev.config();

const Application = require('./app/server');
const mongoUrl = process.env.MONGO_URL;
const port = process.env.PORT || 3000;
// instance for class application
new Application(port, mongoUrl);