//  Import scheme from mongoose
import {Schema, model} from 'mongoose';

// Create schema
const notification_schema = new Schema({
    // ID
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {timestamps : true});

// Create model
const notification = model('notification', notification_schema);

// Export model
export {notification};