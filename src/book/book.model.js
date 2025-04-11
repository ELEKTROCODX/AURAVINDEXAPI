//  Import scheme from mongoose
import {Schema, model} from 'mongoose';

// Create schema
const book_schema = new Schema({
    // ID
    title: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: true
    },
    classification: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    editorial: {
        type: Schema.Types.ObjectId,
        ref: 'editorial',
        required: true
    },
    language: {
        type: String,
        required: true
    },
    edition: {
        type: String,
        required: true
    },
    sample: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    book_status: {
        type: Schema.Types.ObjectId,
        ref: 'book_status',
        required: true
    },
    genres: [
        {
            type: String,
            required: true
        }
    ],
    book_collection: {
        type: Schema.Types.ObjectId,
        ref: 'book_collection',
        required: true
    },
    authors: [
        {
            type: Schema.Types.ObjectId,
            ref: 'author',
            required: true
        }
    ],
    book_img: {
        type: String,
        required: false
        /* default */
    
    }
}, {timestamps : true});

// Create model
const book = model('book', book_schema);

// Export model
export {book};