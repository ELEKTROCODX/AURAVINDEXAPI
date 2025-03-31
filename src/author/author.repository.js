// Import model
import * as author_model from './author.model.js';

// Create author
export const create_author = async (author_data) => {
    const new_author = new author_model.author(author_data);
    return await new_author.save();
}

// Fetch all
export const find_all_authors = async (skip, limit) => {
    return await author_model.author.find().skip(skip).limit(limit).populate('name gender');
}

// Fetch with filters
export const filter_authors = async (filter, skip, limit) => {
    return await author_model.author.find(filter).skip(skip).limit(limit).populate('name gender');
}

// Count authors
export const count_authors = async () => {
    return await author_model.author.countDocuments();
}

// Fetch by ID
export const find_author_by_id = async (id) => {
    return await author_model.author.findById(id).populate('name gender') || null;
}

// Update author
export const update_author = async (id, updates) => {
    return await author_model.author.findByIdAndUpdate(id, updates /* , {new: true, runValidators: true} */);
}

// Delete author
export const delete_author = async (id) => {
    return await author_model.author.findByIdAndDelete(id);
}