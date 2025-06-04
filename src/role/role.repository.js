// Import model
import * as role_model from './role.model.js';

// Create role
export const create_role = async (role_data) => {
    const new_role = new role_model.role(role_data);
    return await new_role.save();
}

// Fetch all
export const find_all_roles = async (skip, limit) => {
    return await role_model.role.find().skip(skip).limit(limit).populate('name permissions');
}

// Fetch with filters
export const filter_roles = async (filter, skip, limit) => {
    return await role_model.role.find(filter).skip(skip).limit(limit).populate('name permissions');
}

// Count roles
export const count_roles = async () => {
    return await role_model.role.countDocuments();
}

// Fetch by ID
export const find_role_by_id = async (id) => {
    return await role_model.role.findById(id).populate('name permissions') || null;
}

// Update role
export const update_role = async (id, updates) => {
    return await role_model.role.findByIdAndUpdate(id, updates /* , {new: true, runValidators: true} */);
}

// Add permission
export const add_permission_to_role = async (id, permission_code) => {
    return await role_model.role.findByIdAndUpdate(id, {$addToSet: {permissions: permission_code}});
}

// Remove permission
export const remove_permission_from_role = async (id, permission_code) => {
    return await role_model.role.findByIdAndUpdate(id, {$pull: {permissions: permission_code}});
}

// Delete role
export const delete_role = async (id) => {
    return await role_model.role.findByIdAndDelete(id);
}