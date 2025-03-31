//  Import scheme from mongoose
import {Schema, model} from 'mongoose';

// Create schema
const loan_schema = new Schema({
    // ID
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    book: {
        type: Schema.Types.ObjectId,
        ref: 'book',
        required: true
    },
    return_date: {
        type: Date,
        required: true
    },
    returned_date: {
        type: Date,
        required: false
    },
    renewals: {
        type: Number,
        required: false,
        default: 0
    }
}, {timestamps : true});

// Create model
const loan = model('loan', loan_schema);

// Export model
export {loan};