//  Import scheme from mongoose
import {Schema, model} from 'mongoose';

// Create schema
const author_schema = new Schema({
    // ID
    name: {
        type: String,
        required: true 
    },
    last_name: {
        type: String,
        required: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    gender: {
        type: Schema.Types.ObjectId,
        ref: 'gender',
        required: true
    }
}, {timestamps : true});

// Create model
const author = model('author', author_schema);

// Export model
export {author};