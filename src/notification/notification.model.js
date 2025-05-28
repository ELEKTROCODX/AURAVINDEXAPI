//  Import scheme from mongoose
import {Schema, model} from 'mongoose';

// Create schema
const notification_schema = new Schema({
    // ID
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    notification_type: {
        type: String,
        required: true
    },
    is_read: {
        type: Boolean,
        default: false
    }
}, {timestamps : true});

// Create model
const notification = model('notification', notification_schema);

// Export model
export {notification};