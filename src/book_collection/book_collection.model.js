//  Import scheme from mongoose
import {Schema, model} from 'mongoose';

// Create schema
const book_collection_schema = new Schema({
    // ID
    name: {
        type: String,
        required: true
    }
}, {timestamps : true});

// Create model
const book_collection = model('book_collection', book_collection_schema);

// Export model
export {book_collection};