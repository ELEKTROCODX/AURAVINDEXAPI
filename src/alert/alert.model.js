//  Import scheme from mongoose
import {Schema, model} from 'mongoose';

// Create schema
const alert_schema = new Schema({
    // ID
    alert_type: {
        type: Schema.Types.ObjectId,
        ref: 'alert_type',
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, {timestamps : true});

// Create model
const alert = model('alert', alert_schema);

// Export model
export {alert};