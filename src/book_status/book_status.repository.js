// Import model
import * as book_status_model from './book_status.model.js';

// Create book status
export const create_book_status = async (book_status_data) => {
    const new_book_status = new book_status_model.book_status(book_status_data);
    return await new_book_status.save();
}

// Fetch all
export const find_all_book_statuses = async (skip, limit) => {
    return await book_status_model.book_status.find().skip(skip).limit(limit).populate('book_status');
}

// Fetch with filters
export const filter_book_statuses = async (filter, skip, limit) => {
    return await book_status_model.book_status.find(filter).skip(skip).limit(limit).populate('book_status');
}

// Count book_statuses
export const count_book_statuses = async () => {
    return await book_status_model.book_status.countDocuments();
}

// Fetch by ID
export const find_book_status_by_id = async (id) => {
    return await book_status_model.book_status.findById(id).populate('book_status') || null;
}

// Update book status
export const update_book_status = async (id, updates) => {
    return await book_status_model.book_status.findByIdAndUpdate(id, updates /* , {new: true, runValidators: true} */);
}

// Delete book status
export const delete_book_status = async (id) => {
    return await book_status_model.book_status.findByIdAndDelete(id);
}