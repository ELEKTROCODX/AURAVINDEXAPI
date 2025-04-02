// Import model
import * as plan_model from './plan.model.js';

// Create plan
export const create_plan = async (plan_data) => {
    const new_plan = new plan_model.plan(plan_data);
    return await new_plan.save();
}

// Fetch all
export const find_all_plans = async (skip, limit) => {
    return await plan_model.plan.find().skip(skip).limit(limit).populate('name');
}

// Fetch with filters
export const filter_plans = async (filter, skip, limit) => {
    return await plan_model.plan.find(filter).skip(skip).limit(limit).populate('name');
}

// Count plans
export const count_plans = async () => {
    return await plan_model.plan.countDocuments();
}

// Fetch by ID
export const find_plan_by_id = async (id) => {
    return await plan_model.plan.findById(id).populate('name') || null;
}

// Update plan
export const update_plan = async (id, updates) => {
    return await plan_model.plan.findByIdAndUpdate(id, updates /* , {new: true, runValidators: true} */);
}

// Delete plan
export const delete_plan = async (id) => {
    return await plan_model.plan.findByIdAndDelete(id);
}