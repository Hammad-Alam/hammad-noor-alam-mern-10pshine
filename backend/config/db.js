const mongoose = require("mongoose"); // MongoDB object modeling tool
const pino = require('pino')(); // Import pino logger

// Retrieve MongoDB connection URI from environment variables
const mongoURI = process.env.MONGO_URI;

const connectToMongo = async () => {
  try {
    // Attempt to connect to MongoDB using mongoose
    await mongoose.connect(mongoURI);
    pino.info('Connected to MongoDB Successfully!'); // Log success message
  } catch (error) {
    // Handle connection errors
    pino.error('Error connecting to MongoDB', error); // Log error message
  }
};

// Export the connectToMongo function
module.exports = connectToMongo;