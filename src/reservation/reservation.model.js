//  Import scheme from mongoose
import {Schema, model} from 'mongoose';

// Create schema
const reservation_schema = new Schema({
    // ID
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: 'room',
        required: true
    },
    start_date: {
        type: Date,
        // Cannot be default because user chooses when the reservation will start
        // default: Date.now(),
        required: true
    },
    finish_date: {
        type: Date,
        required: true
    },
    people: {
        type: Number,
        required: true
    },
    equipments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'equipment',
            required: true
        }
    ]
}, {timestamps : true});

// Create model
const reservation = model('reservation', reservation_schema);

// Export model
export {reservation};