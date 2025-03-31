// Import model
import * as fee_type_model from './fee_type.model.js';

// Create fee type
export const create_fee_type = async (fee_type_data) => {
    const new_fee_type = new fee_type_model.fee_type(fee_type_data);
    return await new_fee_type.save();
}

// Fetch all
export const find_all_fee_types = async (skip, limit) => {
    return await fee_type_model.fee_type.find().skip(skip).limit(limit).populate('fee_code');
}

// Fetch with filters
export const filter_fee_types = async (filter, skip, limit) => {
    return await fee_type_model.fee_type.find(filter).skip(skip).limit(limit).populate('fee_code');
}

// Count fee types
export const count_fee_types = async () => {
    return await fee_type_model.fee_type.countDocuments();
}

// Fetch by ID
export const find_fee_type_by_id = async (id) => {
    return await fee_type_model.fee_type.findById(id).populate('fee_code') || null;
}

// Update fee type
export const update_fee_type = async (id, updates) => {
    return await fee_type_model.fee_type.findByIdAndUpdate(id, updates /* , {new: true, runValidators: true} */);
}

// Delete fee type
export const delete_fee_type = async (id) => {
    return await fee_type_model.fee_type.findByIdAndDelete(id);
}