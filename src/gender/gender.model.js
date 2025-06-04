//  Import scheme from mongoose
import {Schema, model} from 'mongoose';

// Create schema
const gender_schema = new Schema({
    // ID
    name: {
        type: String,
        required: true
    }
}, {timestamps : true});

// Create model
const gender = model('gender', gender_schema);

// Export model
export {gender};