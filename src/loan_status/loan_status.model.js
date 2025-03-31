//  Import scheme from mongoose
import {Schema, model} from 'mongoose';

// Create schema
const loan_status_schema = new Schema({
    // ID
    loan_status: {
        type: String,
        required: true
    }
}, {timestamps : true});

// Create model
const loan_status = model('loan_status', loan_status_schema);

// Export model
export {loan_status};