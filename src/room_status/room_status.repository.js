// Import model
import * as room_status_model from './room_status.model.js';

// Create room status
export const create_room_status = async (room_status_data) => {
    const new_room_status = new room_status_model.room_status(room_status_data);
    return await new_room_status.save();
}

// Fetch all
export const find_all_room_statuses = async (skip, limit) => {
    return await room_status_model.room_status.find().skip(skip).limit(limit).populate('room_status');
}

// Fetch with filters
export const filter_room_statuses = async (filter, skip, limit) => {
    return await room_status_model.room_status.find(filter).skip(skip).limit(limit).populate('room_status');
}

// Count room statuses
export const count_room_statuses = async () => {
    return await room_status_model.room_status.countDocuments();
}

// Fetch by ID
export const find_room_status_by_id = async (id) => {
    return await room_status_model.room_status.findById(id).populate('room_status') || null;
}

// Update room status
export const update_room_status = async (id, updates) => {
    return await room_status_model.room_status.findByIdAndUpdate(id, updates /* , {new: true, runValidators: true} */);
}

// Delete room status
export const delete_room_status = async (id) => {
    return await room_status_model.room_status.findByIdAndDelete(id);
}