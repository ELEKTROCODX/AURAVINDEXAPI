//  Import scheme from mongoose
import {Schema, model} from 'mongoose';

// Create schema
const room_schema = new Schema({
    // ID
    name: {
        type: String,
        required: true
    },
    min_people: {
        type: Number,
        required: true
    },
    max_people: {
        type: Number,
        required: true
    },
    room_location: {
        type: Schema.Types.ObjectId,
        ref: 'room_location',
        required: true
    },
    room_status: {
        type: Schema.Types.ObjectId,
        ref: 'room_status',
        required: true
    },
    room_img: {
        type: String,
        require: false,
        /* default */
    }
}, {timestamps : true});

// Create model
const room = model('room', room_schema);

// Export model
export {room};