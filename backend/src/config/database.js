import mongoose from 'mongoose';

import { env, isProduction } from './env.js';

mongoose.set('strictQuery', true);

let connectionPromise = null;
let listenersAttached = false;

export const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    await connectionPromise;
    return mongoose.connection;
  }

  if (!listenersAttached) {
    mongoose.connection.on('connected', () => {
      console.info('MongoDB connection established.');
    });

    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB connection disconnected.');
    });

    listenersAttached = true;
  }

  connectionPromise = mongoose
    .connect(env.MONGODB_URI, {
      autoIndex: !isProduction,
      serverSelectionTimeoutMS: 10000,
    })
    .catch((error) => {
      connectionPromise = null;
      throw error;
    });

  await connectionPromise;

  return mongoose.connection;
};

export const disconnectDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};
