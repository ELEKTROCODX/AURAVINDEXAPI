// Import model
import * as equipment_model from './equipment.model.js';

// Create equipment
export const create_equipment = async (equipment_data) => {
    const new_equipment = new equipment_model.equipment(equipment_data);
    return await new_equipment.save();
}

// Fetch all
export const find_all_equipments = async (skip, limit) => {
    return await equipment_model.equipment.find().skip(skip).limit(limit).populate('name');
}

// Count equipments
export const count_equipments = async () => {
    return await equipment_model.equipment.countDocuments();
}

// Fetch with filters
export const filter_equipments = async (filter, skip, limit) => {
    return await equipment_model.equipment.find(filter).skip(skip).limit(limit).populate('name');
}

// Fetch by ID
export const find_equipment_by_id = async (id) => {
    return await equipment_model.equipment.findById(id).populate('name') || null;
}

// Update equipment
export const update_equipment = async (id, updates) => {
    return await equipment_model.equipment.findByIdAndUpdate(id, updates /* , {new: true, runValidators: true} */);
}

// Delete equipment
export const delete_equipment = async (id) => {
    return await equipment_model.equipment.findByIdAndDelete(id);
}