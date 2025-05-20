// Import model
import * as audit_log_model from './audit_log.model.js';

// Create audit log
export const create_audit_log = async (audit_log_data) => {
    const new_audit_log = new audit_log_model.audit_log(audit_log_data);
    return await new_audit_log.save();
}

// Fetch all
export const find_all_audit_logs = async (skip, limit) => {
    return await audit_log_model.audit_log.find().skip(skip).limit(limit).populate([
        { path: 'user', populate: [{ path: 'gender' }, { path: 'role'} ]},
        { path: 'action' }
    ]);
}

// Fetch with filters
export const filter_audit_logs = async (filter, skip, limit) => {
    return await audit_log_model.audit_log.find(filter).skip(skip).limit(limit).populate([
        { path: 'user', populate: [{ path: 'gender' }, { path: 'role'} ]},
        { path: 'action' }
    ]);;
}

// Count audit logs
export const count_audit_logs = async () => {
    return await audit_log_model.audit_log.countDocuments();
}

// Fetch by ID
export const find_audit_log_by_id = async (id) => {
    return await audit_log_model.audit_log.findById(id).populate([
        { path: 'user', populate: [{ path: 'gender' }, { path: 'role'} ]},
        { path: 'action' }
    ]) || null;
}

// Update alert type
export const update_audit_log = async (id, updates) => {
    return await audit_log_model.audit_log.findByIdAndUpdate(id, updates /* , {new: true, runValidators: true} */);
}

// Delete alert type
export const delete_audit_log = async (id) => {
    return await audit_log_model.audit_log.findByIdAndDelete(id);
}