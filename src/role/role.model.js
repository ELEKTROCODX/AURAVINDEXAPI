//  Import scheme from mongoose
import {Schema, model} from 'mongoose';

// Create schema
const role_schema = new Schema({
    // ID
    name: {
        type: String,
        required: true
    },
    permissions: [
        {
            type: String,
            required: true
        }
    ]
}, {timestamps : true});

// Create model
const role = model('role', role_schema);

// Export model
export {role};