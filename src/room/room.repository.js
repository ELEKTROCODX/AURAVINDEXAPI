// Import model
import * as room_model from './room.model.js';

// Create room
export const create_room = async (room_data) => {
    const new_room = new room_model.room(room_data);
    return await new_room.save();
}

// Fetch all
export const find_all_rooms = async (skip, limit) => {
    return await room_model.room.find().skip(skip).limit(limit).populate('name room_location room_status');
}

// Fetch with filters
export const filter_rooms = async (filter, skip, limit) => {
    return await room_model.room.find(filter).skip(skip).limit(limit).populate('name room_location room_status');
}

// Count rooms
export const count_rooms = async () => {
    return await room_model.room.countDocuments();
}

// Fetch by ID
export const find_room_by_id = async (id) => {
    return await room_model.room.findById(id).populate('name room_location room_status') || null;
}

// Fetch by people
export const find_room_by_people = async (id, people) => {
    return await room_model.room.findOne({
        _id: id, 
        $and: [
            {min_people: {$lte: people}},
            {max_people: {$gte: people}}
        ]
    }).populate('name room_status') || null;
}

// Update room
export const update_room = async (id, updates) => {
    return await room_model.room.findByIdAndUpdate(id, updates /* , {new: true, runValidators: true} */);
}

// Delete room
export const delete_room = async (id) => {
    return await room_model.room.findByIdAndDelete(id);
}