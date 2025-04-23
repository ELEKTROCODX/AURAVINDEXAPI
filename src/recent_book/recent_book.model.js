//  Import scheme from mongoose
import {Schema, model} from 'mongoose';

// Create schema
const recent_book_schema = new Schema({
    // ID
    user: {
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
    ],
}, {timestamps : true});

// Create model
const recent_book = model('recent_book', recent_book_schema);

// Export model
export {recent_book};