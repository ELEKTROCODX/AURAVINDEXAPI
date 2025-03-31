//  Import scheme from mongoose
import {Schema, model} from 'mongoose';

// Create schema
const fee_schema = new Schema({
    // ID
    fee_type: {
        type: Schema.Types.ObjectId,
        ref: 'fee_type',
        required: true
    },
    fee_status: {
        type: Schema.Types.ObjectId,
        ref: 'fee_status',
        required: true
    },
    loan: {
        type: Schema.Types.ObjectId,
        ref: 'loan',
        required: true   
    },
    paid_date: {
        type: Date,
        required: false
    },
    due_payment_date: {
        type: Date,
        required: true
    }
}, {timestamps : true});

// Create model
const fee = model('fee', fee_schema);

// Export model
export {fee};