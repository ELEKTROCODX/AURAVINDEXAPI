//  Import scheme from mongoose
import {Schema, model} from 'mongoose';

// Create schema
const book_list_schema = new Schema({
    // ID
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    books: [
        {
            type: Schema.Types.ObjectId,
            ref: 'book',
            required: true
        }
    ]
}, {timestamps : true});

// Create model
const book_list = model('book_list', book_list_schema);

// Export model
export {book_list};