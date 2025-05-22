// Import model
import * as recent_book_model from './recent_book.model.js';

// Create recent_book
export const create_recent_book = async (recent_book_data) => {
    const new_recent_book = new recent_book_model.recent_book(recent_book_data);
    return await new_recent_book.save();
}

// Fetch all
export const find_all_recent_books = async (skip, limit) => {
    return await recent_book_model.recent_book.find().skip(skip).limit(limit).populate([
        { path: 'user', populate: [{ path: 'gender' }, { path: 'role'} ]},
        { path: 'books', populate: [
            { path: 'editorial' },
            { path: 'book_status' },
            { path: 'book_collection' },
            { path: 'authors' },
        ] }
    ]);
}

// Fetch with filters
export const filter_recent_books = async (filter, skip, limit) => {
    return await recent_book_model.recent_book.find(filter).skip(skip).limit(limit).populate([
        { path: 'user', populate: [{ path: 'gender' }, { path: 'role'} ]},
        { path: 'books', populate: [
            { path: 'editorial' },
            { path: 'book_status' },
            { path: 'book_collection' },
            { path: 'authors' },
        ] }
    ]);
}

// Count recent_books
export const count_recent_books = async () => {
    return await recent_book_model.recent_book.countDocuments();
}

// Fetch by ID
export const find_recent_book_by_id = async (id) => {
    return await recent_book_model.recent_book.findById(id).populate([
        { path: 'user', populate: [{ path: 'gender' }, { path: 'role'} ]},
        { path: 'books', populate: [
            { path: 'editorial' },
            { path: 'book_status' },
            { path: 'book_collection' },
            { path: 'authors' },
        ] }
    ]) || null;
}

// Update recent_book
export const update_recent_book = async (id, updates) => {
    return await recent_book_model.recent_book.findByIdAndUpdate(id, updates /* , {new: true, runValidators: true} */);
}

// Update book list
export const updated_book_list = async (id, books) => {
    return await recent_book_model.recent_book.findByIdAndUpdate(id, {books}, {new: true});
}


// Delete recent_book
export const delete_recent_book = async (id) => {
    return await recent_book_model.recent_book.findByIdAndDelete(id);
}