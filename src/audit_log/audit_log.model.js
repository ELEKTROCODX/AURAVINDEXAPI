//  Import scheme from mongoose
import {Schema, model} from 'mongoose';

// Create schema
const audit_log_schema = new Schema({
    // ID
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: false
    },
    action: {
        type: Schema.Types.ObjectId,
        ref: 'log_action',
        required: true
    },
    affected_object: {
        type: String,
        required: true
    }
}, {timestamps : true});

// Create model
const audit_log = model('audit_log', audit_log_schema);

// Export model
export {audit_log};