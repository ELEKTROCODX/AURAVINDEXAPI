import mongoose from 'mongoose';
import {app_config} from './app.config.js';
import { apiLogger } from './util.js';

export const connectToDatabase = async () => {
    try{
        await mongoose.connect(app_config.mongoUri);
        apiLogger.info('Successfully connected to database');
    } catch(e){
        apiLogger.error("Failed to connect to database:" + e);
        throw e;
    }
}

export const disconnectFromDatabase = async () => {
    try {
        await mongoose.disconnect();
        apiLogger.info("Successfully disconnected from MongoDB");        
    } catch(e){
        apiLogger.error("Failed to disconnect from database:" + e);
        throw e;
    }
}