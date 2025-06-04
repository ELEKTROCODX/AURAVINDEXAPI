//  Import scheme from mongoose
import {Schema, model} from 'mongoose';

// Create schema
const plan_status_schema = new Schema({
    // ID
    plan_status: {
        type: String,
        required: true
    }
}, {timestamps : true});

// Create model
const plan_status = model('plan_status', plan_status_schema);

// Export model
export {plan_status};