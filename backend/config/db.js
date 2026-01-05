import mongoose from "mongoose"; // MongoDB object modeling tool

import pino from 'pino'; // Import pino logger
const logger = pino();

// Retrieve MongoDB connection URI from environment variables
const mongoURI = process.env.MONGO_URI;

const connectToMongo = async () => {
  try {
    // Attempt to connect to MongoDB using mongoose
    await mongoose.connect(mongoURI);
    logger.info('Connected to MongoDB Successfully!'); // Log success message
  } catch (error) {
    // Handle connection errors
    logger.error('Error connecting to MongoDB', error); // Log error message
  }
};

// Export the connectToMongo function
export default connectToMongo;