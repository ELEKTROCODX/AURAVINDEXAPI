//  Import scheme from mongoose
import {Schema, model} from 'mongoose';

// Create schema
const log_action_schema = new Schema({
    // ID
    action_code: {
        type: String,
        required: true
    }
}, {timestamps : true});

// Create model
const log_action = model('log_action', log_action_schema);

// Export model
export {log_action};