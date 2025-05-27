//  Import scheme from mongoose
import {Schema, model} from 'mongoose';

// Create schema
const plan_schema = new Schema({
    // ID
    name: {
        type: String,
        required: true
    },
    fixed_price: {
        type: String,
        required: true
    },
    monthly_price: {
        type: String,
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
    max_renewals_per_loan: {
        type: Number,
        required: true
    }
}, {timestamps : true});

// Create model
const plan = model('plan', plan_schema);

// Export model
export {plan};