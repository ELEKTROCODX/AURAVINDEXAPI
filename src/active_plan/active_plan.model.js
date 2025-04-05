//  Import scheme from mongoose
import {Schema, model} from 'mongoose';

// Create schema
const active_plan_schema = new Schema({
    // ID
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    plan: {
        type: Schema.Types.ObjectId,
        ref: 'plan',
        required: true
    },
    plan_status: {
        type: Schema.Types.ObjectId,
        ref: 'plan_status',
        required: true
    },
    ending_date: {
        type: Date,
        required: false,
    },
    finished_date: {
        type: Date,
        required: false,
    }
}, {timestamps : true});

// Create model
const active_plan = model('active_plan', active_plan_schema);

// Export model
export {active_plan};