// Import model
import * as alert_model from './alert.model.js';

// Create alert
export const create_alert = async (alert_data) => {
    const new_alert = new alert_model.alert(alert_data);
    return await new_alert.save();
}

// Fetch all
export const find_all_alerts = async (skip, limit) => {
    return await alert_model.alert.find().skip(skip).limit(limit).populate('alert_type sender receiver');
}

// Fetch with filters
export const filter_alerts = async (filter, skip, limit) => {
    return await alert_model.alert.find(filter).skip(skip).limit(limit).populate('alert_type sender receiver');
}

// Count alerts
export const count_alerts = async () => {
    return await alert_model.alert.countDocuments();
}

// Fetch by ID
export const find_alert_by_id = async (id) => {
    return await alert_model.alert.findById(id).populate('alert_type sender receiver') || null;
}

// Update alert
export const update_alert = async (id, updates) => {
    return await alert_model.alert.findByIdAndUpdate(id, updates /* , {new: true, runValidators: true} */);
}

// Delete alert
export const delete_alert = async (id) => {
    return await alert_model.alert.findByIdAndDelete(id);
}