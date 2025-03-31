import mongoose from 'mongoose';
import {app_config} from './app.config.js';

export const connectToDatabase = async () => {
    try{
        await mongoose.connect(app_config.mongoUri);
        console.log('Successfully connected to database');
    } catch(e){
        console.error("Failed to connect to database:", e);
        throw e;
    }
}

export const disconnectFromDatabase = async () => {
    try {
        await mongoose.disconnect();
        console.log("Successfully disconnected from MongoDB");        
    } catch(e){
        console.error("Failed to disconnect from database:", e);
        throw e;
    }
}