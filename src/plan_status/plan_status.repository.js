// Import model
import * as plan_status_model from './plan_status.model.js';

// Create plan status
export const create_plan_status = async (plan_status_data) => {
    const new_plan_status = new plan_status_model.plan_status(plan_status_data);
    return await new_plan_status.save();
}

// Fetch all
export const find_all_plan_statuses = async (skip, limit) => {
    return await plan_status_model.plan_status.find().skip(skip).limit(limit).populate('plan_status');
}

// Fetch with filters
export const filter_plan_statuses = async (filter, skip, limit) => {
    return await plan_status_model.plan_status.find(filter).skip(skip).limit(limit).populate('plan_status');
}

// Count plan_statuses
export const count_plan_statuses = async () => {
    return await plan_status_model.plan_status.countDocuments();
}

// Fetch by ID
export const find_plan_status_by_id = async (id) => {
    return await plan_status_model.plan_status.findById(id).populate('plan_status') || null;
}

// Update plan status
export const update_plan_status = async (id, updates) => {
    return await plan_status_model.plan_status.findByIdAndUpdate(id, updates /* , {new: true, runValidators: true} */);
}

// Delete plan status
export const delete_plan_status = async (id) => {
    return await plan_status_model.plan_status.findByIdAndDelete(id);
}