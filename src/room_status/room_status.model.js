//  Import scheme from mongoose
import {Schema, model} from 'mongoose';

// Create schema
const room_status_schema = new Schema({
    // ID
    room_status: {
        type: String,
        required: true
    }
}, {timestamps : true});

// Create model
const room_status = model('room_status', room_status_schema);

// Export model
export {room_status};