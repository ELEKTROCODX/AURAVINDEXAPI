// Import model
import * as editorial_model from './editorial.model.js';

// Create editorial
export const create_editorial = async (editorial_data) => {
    const new_editorial = new editorial_model.editorial(editorial_data);
    return await new_editorial.save();
}

// Fetch all
export const find_all_editorials = async (skip, limit) => {
    return await editorial_model.editorial.find().skip(skip).limit(limit).populate('name');
}

// Fetch with filters
export const filter_editorials = async (filter, skip, limit) => {
    return await editorial_model.editorial.find(filter).skip(skip).limit(limit).populate('name');
}

// Count editorials
export const count_editorials = async () => {
    return await editorial_model.editorial.countDocuments();
}

// Fetch by ID
export const find_editorial_by_id = async (id) => {
    return await editorial_model.editorial.findById(id).populate('name') || null;
}

// Update editorial
export const update_editorial = async (id, updates) => {
    return await editorial_model.editorial.findByIdAndUpdate(id, updates /* , {new: true, runValidators: true} */);
}

// Delete editorial
export const delete_editorial = async (id) => {
    return await editorial_model.editorial.findByIdAndDelete(id);
}