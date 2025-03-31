// Import model
import * as log_action_model from './log_action.model.js';

// Create log action
export const create_log_action = async (log_action_data) => {
    const new_log_action = new log_action_model.log_action(log_action_data);
    return await new_log_action.save();
}

// Fetch all
export const find_all_log_actions = async (skip, limit) => {
    return await log_action_model.log_action.find().skip(skip).limit(limit).populate('action_code');
}

// Fetch with filters
export const filter_log_actions = async (filter, skip, limit) => {
    return await log_action_model.log_action.find(filter).skip(skip).limit(limit).populate('action_code');
}

// Count log actions
export const count_log_actions = async () => {
    return await log_action_model.log_action.countDocuments();
}

// Fetch by ID
export const find_log_action_by_id = async (id) => {
    return await log_action_model.log_action.findById(id).populate('action_code') || null;
}

// Update log action
export const update_log_action = async (id, updates) => {
    return await log_action_model.log_action.findByIdAndUpdate(id, updates /* , {new: true, runValidators: true} */);
}

// Delete log action
export const delete_log_action = async (id) => {
    return await log_action_model.log_action.findByIdAndDelete(id);
}