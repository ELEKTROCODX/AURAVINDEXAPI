//  Import scheme from mongoose
import {Schema, model} from 'mongoose';

// Create schema
const equipment_schema = new Schema({
    // ID
    name: {
        type: String,
        required: true
    },
    inventory: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    }
}, {timestamps : true});

// Create model
const equipment = model('equipment', equipment_schema);

// Export model
export {equipment};