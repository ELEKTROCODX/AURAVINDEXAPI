// Import model
import * as book_model from './book.model.js';

// Create book
export const create_book = async (book_data) => {
    const new_book = new book_model.book(book_data);
    return await new_book.save();
}

// Fetch all
export const find_all_books = async (skip, limit, sort_field = "createdAt", sort_direction = 1) => {
    return await book_model.book.find().sort({[sort_field]: sort_direction}).skip(skip).limit(limit).populate('title editorial book_status book_collection authors');
}

// Fetch with filters
export const filter_books = async (filter, skip, limit, sort_field = "createdAt", sort_direction = 1) => {
    return await book_model.book.find(filter).sort({[sort_field]: sort_direction}).skip(skip).limit(limit).populate('title editorial book_status book_collection authors');
}

// Fetch by classification
export const find_latest_releases = async (limit) => {
    return await book_model.book.find().sort({createdAt: -1}).limit(limit).populate('title editorial book_status book_collection authors');
}

// Count books
export const count_books = async () => {
    return await book_model.book.countDocuments();
}

// Fetch by ID
export const find_book_by_id = async (id) => {
    return await book_model.book.findById(id).populate('title editorial book_status book_collection authors') || null;
}

// Update book
export const update_book = async (id, updates) => {
    return await book_model.book.findByIdAndUpdate(id, updates /* , {new: true, runValidators: true} */);
}

// Delete book
export const delete_book = async (id) => {
    return await book_model.book.findByIdAndDelete(id);
}