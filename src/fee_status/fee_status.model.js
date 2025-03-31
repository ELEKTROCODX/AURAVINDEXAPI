//  Import scheme from mongoose
import {Schema, model} from 'mongoose';

// Create schema
const fee_status_schema = new Schema({
    // ID
    fee_status: {
        type: String,
        required: true
    }
}, {timestamps : true});

// Create model
const fee_status = model('fee_status', fee_status_schema);

// Export model
export {fee_status};