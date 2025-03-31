// Import model
import * as alert_type_model from './alert_type.model.js';

// Create alert type
export const create_alert_type = async (alert_type_data) => {
    const new_alert_type = new alert_type_model.alert_type(alert_type_data);
    return await new_alert_type.save();
}

// Fetch all
export const find_all_alert_types = async (skip, limit) => {
    return await alert_type_model.alert_type.find().skip(skip).limit(limit).populate('alert_code');
}

// Fetch with filters
export const filter_alert_types = async (filter, skip, limit) => {
    return await alert_type_model.alert_type.find(filter).skip(skip).limit(limit).populate('alert_code');
}

// Count alert types
export const count_alert_types = async () => {
    return await alert_type_model.alert_type.countDocuments();
}

// Fetch by ID
export const find_alert_type_by_id = async (id) => {
    return await alert_type_model.alert_type.findById(id) || null;
}

// Update alert type
export const update_alert_type = async (id, updates) => {
    return await alert_type_model.alert_type.findByIdAndUpdate(id, updates /* , {new: true, runValidators: true} */);
}

// Delete alert type
export const delete_alert_type = async (id) => {
    return await alert_type_model.alert_type.findByIdAndDelete(id);
}