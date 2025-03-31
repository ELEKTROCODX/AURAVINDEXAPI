//  Import scheme from mongoose
import {Schema, model} from 'mongoose';

// Create schema
const alert_type_schema = new Schema({
    // ID
    alert_code: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, {timestamps : true});

// Create model
const alert_type = model('alert_type', alert_type_schema);

// Export model
export {alert_type};