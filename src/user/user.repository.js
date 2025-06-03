// Import model
import * as user_model from './user.model.js';

// Create user
export const create_user = async (user_data) => {
    const new_user = new user_model.user(user_data);
    return await new_user.save();
}

// Fetch all
export const find_all_users = async (skip, limit, sort_field, sort_direction) => {
    return await user_model.user.find().sort({[sort_field]: sort_direction}).skip(skip).limit(limit).populate('gender role');
}

// Fetch with filters
export const filter_users = async (filter, skip, limit, sort_field, sort_direction) => {
    return await user_model.user.find(filter).sort({[sort_field]: sort_direction}).skip(skip).limit(limit).populate('gender role');
}

// Count users
export const count_users = async () => {
    return await user_model.user.countDocuments();
}

// Fetch by ID
export const find_user_by_id = async (id) => {
    return await user_model.user.findById(id).populate('gender role') || null;
}

// Update user
export const update_user = async (id, updates) => {
    return await user_model.user.findByIdAndUpdate(id, updates /* , {new: true, runValidators: true} */);
}

// Delete user
export const delete_user = async (id) => {
    return await user_model.user.findByIdAndDelete(id);
}