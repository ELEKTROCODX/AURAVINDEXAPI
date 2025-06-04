//  Import scheme from mongoose
import {Schema, model} from 'mongoose';

// Create schema
const editorial_schema = new Schema({
    // ID
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
}, {timestamps : true});

// Create model
const editorial = model('editorial', editorial_schema);

// Export model
export {editorial};