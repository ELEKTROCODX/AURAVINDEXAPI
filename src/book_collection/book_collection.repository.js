// Import model
import * as book_collection_model from './book_collection.model.js';

// Create book collection
export const create_book_collection = async (book_collection_data) => {
    const new_book_collection = new book_collection_model.book_collection(book_collection_data);
    return await new_book_collection.save();
}

// Fetch all
export const find_all_book_collections = async (skip, limit) => {
    return await book_collection_model.book_collection.find().skip(skip).limit(limit).populate('name');
}

// Count book collections
export const count_book_collections = async () => {
    return await book_collection_model.book_collection.countDocuments();
}

// Fetch with filters
export const filter_book_collections = async (filter, skip, limit) => {
    return await book_collection_model.book_collection.find(filter).skip(skip).limit(limit).populate('name');
}

// Fetch by ID
export const find_book_collection_by_id = async (id) => {
    return await book_collection_model.book_collection.findById(id) || null;
}

// Update book collection
export const update_book_collection = async (id, updates) => {
    return await book_collection_model.book_collection.findByIdAndUpdate(id, updates /* , {new: true, runValidators: true} */);
}

// Delete book collection
export const delete_book_collection = async (id) => {
    return await book_collection_model.book_collection.findByIdAndDelete(id);
}