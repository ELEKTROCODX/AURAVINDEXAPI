//  Import scheme from mongoose
import {Schema, model} from 'mongoose';

// Create schema
const plan_schema = new Schema({
    // ID
    name: {
        type: String,
        required: true
    },
    price: {
        type: Schema.Types.Decimal128,
        required: true
    },
    max_simultaneous_loans: {
        type: Number,
        required: true

    },
    max_return_days: {
        type: Number,
        required: true
    },
    max_renovations_per_loan: {
        type: Number,
        required: true
    }
}, {timestamps : true});

// Create model
const plan = model('plan', plan_schema);

// Export model
export {plan};