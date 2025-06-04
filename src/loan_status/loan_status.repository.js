// Import model
import * as loan_status_model from './loan_status.model.js';

// Create loan status
export const create_loan_status = async (loan_status_data) => {
    const new_loan_status = new loan_status_model.loan_status(loan_status_data);
    return await new_loan_status.save();
}

// Fetch all
export const find_all_loan_statuses = async (skip, limit) => {
    return await loan_status_model.loan_status.find().skip(skip).limit(limit).populate('loan_status');
}

// Fetch with filters
export const filter_loan_statuses = async (filter, skip, limit) => {
    return await loan_status_model.loan_status.find(filter).skip(skip).limit(limit).populate('loan_status');
}

// Count loan_statuses
export const count_loan_statuses = async () => {
    return await loan_status_model.loan_status.countDocuments();
}

// Fetch by ID
export const find_loan_status_by_id = async (id) => {
    return await loan_status_model.loan_status.findById(id).populate('loan_status') || null;
}

// Update loan status
export const update_loan_status = async (id, updates) => {
    return await loan_status_model.loan_status.findByIdAndUpdate(id, updates /* , {new: true, runValidators: true} */);
}

// Delete loan status
export const delete_loan_status = async (id) => {
    return await loan_status_model.loan_status.findByIdAndDelete(id);
}