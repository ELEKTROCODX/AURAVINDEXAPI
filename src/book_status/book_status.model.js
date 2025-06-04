//  Import scheme from mongoose
import {Schema, model} from 'mongoose';

// Create schema
const book_status_schema = new Schema({
    // ID
    book_status: {
        type: String,
        required: true
    }
}, {timestamps : true});

// Create model
const book_status = model('book_status', book_status_schema);

// Export model
export {book_status};