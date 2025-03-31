// Import model
import * as room_location_model from './room_location.model.js';

// Create room location
export const create_room_location = async (room_location_data) => {
    const new_room_location = new room_location_model.room_location(room_location_data);
    return await new_room_location.save();
}

// Fetch all
export const find_all_room_locations = async (skip, limit) => {
    return await room_location_model.room_location.find().skip(skip).limit(limit).populate('location');
}

// Fetch with filters
export const filter_room_locations = async (filter, skip, limit) => {
    return await room_location_model.room_location.find(filter).skip(skip).limit(limit).populate('location');
}

// Count room locations
export const count_room_locations = async () => {
    return await room_location_model.room_location.countDocuments();
}

// Fetch by ID
export const find_room_location_by_id = async (id) => {
    return await room_location_model.room_location.findById(id).populate('location') || null;
}

// Update room location
export const update_room_location = async (id, updates) => {
    return await room_location_model.room_location.findByIdAndUpdate(id, updates /* , {new: true, runValidators: true} */);
}

// Delete room location
export const delete_room_location = async (id) => {
    return await room_location_model.room_location.findByIdAndDelete(id);
}