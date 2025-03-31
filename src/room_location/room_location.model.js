//  Import scheme from mongoose
import {Schema, model} from 'mongoose';

// Create schema
const room_location_schema = new Schema({
    // ID
    location: {
        type: String,
        required: true
    }
}, {timestamps : true});

// Create model
const room_location = model('room_location', room_location_schema);

// Export model
export {room_location};