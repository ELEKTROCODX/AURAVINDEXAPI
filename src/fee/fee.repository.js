// Import model
import * as fee_model from './fee.model.js';

// Create fee
export const create_fee = async (fee_data) => {
    const new_fee = new fee_model.fee(fee_data);
    return await new_fee.save();
}

// Fetch all
export const find_all_fees = async (skip, limit, sort_field, sort_direction) => {
    return await fee_model.fee.find().sort({[sort_field]: sort_direction}).skip(skip).limit(limit).populate('fee_type fee_status loan');
}

// Fetch with filters
export const filter_fees = async (filter, skip, limit, sort_field, sort_direction) => {
    return await fee_model.fee.find(filter).sort({[sort_field]: sort_direction}).skip(skip).limit(limit).populate('fee_type fee_status loan');
}

// Count fees
export const count_fees = async () => {
    return await fee_model.fee.countDocuments();
}

// Fetch by ID
export const find_fee_by_id = async (id) => {
    return await fee_model.fee.findById(id).populate('fee_type fee_status loan') || null;
}

// Update fee
export const update_fee = async (id, updates) => {
    return await fee_model.fee.findByIdAndUpdate(id, updates /* , {new: true, runValidators: true} */);
}

// Delete fee
export const delete_fee = async (id) => {
    return await fee_model.fee.findByIdAndDelete(id);
}