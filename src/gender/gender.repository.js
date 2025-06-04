// Import model
import * as gender_model from './gender.model.js';

// Create gender
export const create_gender = async (gender_data) => {
    const new_gender = new gender_model.gender(gender_data);
    return await new_gender.save();
}

// Fetch all
export const find_all_genders = async (skip, limit) => {
    return await gender_model.gender.find().skip(skip).limit(limit).populate('name');
}

// Fetch with filters
export const filter_genders = async (filter, skip, limit) => {
    return await gender_model.gender.find(filter).skip(skip).limit(limit).populate('name');
}

// Count genders
export const count_genders = async () => {
    return await gender_model.gender.countDocuments();
}

// Fetch by ID
export const find_gender_by_id = async (id) => {
    return await gender_model.gender.findById(id).populate('name') || null;
}

// Update gender
export const update_gender = async (id, updates) => {
    return await gender_model.gender.findByIdAndUpdate(id, updates /* , {new: true, runValidators: true} */);
}

// Delete gender
export const delete_gender = async (id) => {
    return await gender_model.gender.findByIdAndDelete(id);
}