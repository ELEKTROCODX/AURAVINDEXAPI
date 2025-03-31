// Import model
import * as fee_status_model from './fee_status.model.js';

// Create fee status
export const create_fee_status = async (fee_status_data) => {
    const new_fee_status = new fee_status_model.fee_status(fee_status_data);
    return await new_fee_status.save();
}

// Fetch all
export const find_all_fee_statuses = async (skip, limit) => {
    return await fee_status_model.fee_status.find().skip(skip).limit(limit).populate('fee_status');
}

// Fetch with filters
export const filter_fee_statuses = async (filter, skip, limit) => {
    return await fee_status_model.fee_status.find(filter).skip(skip).limit(limit).populate('fee_status');
}

// Count fee statuses
export const count_fee_statuses = async () => {
    return await fee_status_model.fee_status.countDocuments();
}

// Fetch by ID
export const find_fee_status_by_id = async (id) => {
    return await fee_status_model.fee_status.findById(id).populate('fee_status') || null;
}


// Update fee status
export const update_fee_status = async (id, updates) => {
    return await fee_status_model.fee_status.findByIdAndUpdate(id, updates /* , {new: true, runValidators: true} */);
}

// Delete fee status
export const delete_fee_status = async (id) => {
    return await fee_status_model.fee_status.findByIdAndDelete(id);
}