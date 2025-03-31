import {ObjectAlreadyExists, ObjectInvalidQueryFilters, ObjectMissingParameters, ObjectNotFound } from '../config/errors.js';
import * as role_repository from './role.repository.js';
import { generate_filter } from '../config/util.js';
/**
 * Creates a new role with the specified name and permissions.
 * @param {string} name - The name of the new role.
 * @param {Array<string>} permissions - The permissions to be assigned to the role.
 * @returns {Object} - The newly created role object.
 * @throws {ObjectAlreadyExists} - Throws if the role already exists.
 */
export const create_new_role = async (name, permissions) => {
    const role_exists = await role_repository.filter_roles({['name']: new RegExp(name, 'i')}, 0, 10);
    if(role_exists.length != 0) {
        throw new ObjectAlreadyExists("role");
    }
    const new_role = await role_repository.create_role({name, permissions});
    return new_role;
}
/**
 * Retrieves all roles with pagination.
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The number of roles per page.
 * @returns {Array<Object>} - A list of roles.
 * @throws {ObjectInvalidQueryFilters} - Throws if pagination parameters are invalid.
 */
export const get_all_roles = async (page, limit) => {
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("role");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const roles = await role_repository.find_all_roles(skip, limit);
    const total_roles = await role_repository.count_roles();
    const total_pages = Math.ceil(total_roles / limit);
    return {
        data: roles,
        pagination: {
            totalItems: total_roles,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Filters roles based on a specific field and value with pagination.
 * @param {string} filter_field - The field to filter roles by (e.g., 'name', 'permissions').
 * @param {string} filter_value - The value to search for in the specified field.
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The number of roles per page.
 * @returns {Array<Object>} - A list of filtered roles.
 * @throws {ObjectInvalidQueryFilters} - Throws if the filter field is invalid or pagination parameters are invalid.
 */
export const filter_roles = async (filter_field, filter_value, page, limit) => {
    const field_types = {
        name: 'String',
        permissions: 'String'
    };
    const allowed_fields = Object.keys(field_types);
    if(!allowed_fields.includes(filter_field)) {
        throw new ObjectInvalidQueryFilters("role");
    }
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("role");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = generate_filter(field_types, filter_field, filter_value);
    const skip = (page - 1) * limit;
    const roles = await role_repository.filter_roles(filter, skip, limit);
    const total_roles = await role_repository.count_roles();
    const total_pages = Math.ceil(total_roles / limit);
    return {
        data: roles,
        pagination: {
            totalItems: total_roles,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Retrieves a role by its ID.
 * @param {string} id - The ID of the role to retrieve.
 * @returns {Object} - The role object if found.
 * @throws {ObjectNotFound} - Throws if the role with the specified ID is not found.
 */
export const get_role_by_id = async (id) => {
    const role_exists = await role_repository.find_role_by_id(id);
    if(!role_exists) {
        throw new ObjectNotFound("role");
    }
    return role_exists;
}
/**
 * Updates a role's information by ID.
 * @param {string} id - The ID of the role to update.
 * @param {Object} updates - The fields to update.
 * @returns {Object} - The updated role object.
 * @throws {ObjectNotFound} - Throws if the role is not found.
 * @throws {ObjectAlreadyExists} - Throws if the role with the updated name already exists.
 * @throws {ObjectMissingParameters} - Throws if required parameters are missing.
 */
export const update_role = async (id, updates) => { 
    if(!id) {
        throw new ObjectMissingParameters("role");
    }
    const role_exists_id = await role_repository.find_role_by_id(id);
    const role_exists_name = await role_repository.filter_roles({['name']: new RegExp(updates.name, 'i')}, 0, 10);
    if(!role_exists_id){
        throw new ObjectNotFound("role");
    }
    if( (role_exists_name.length != 0) && (role_exists_name[0]._id.toString() != id) ) {
        throw new ObjectAlreadyExists("role");
    }
    return await role_repository.update_role(id, updates);
}
/**
 * Adds a permission to a role.
 * @param {string} id - The ID of the role.
 * @param {string} permission_code - The permission code to add to the role.
 * @throws {ObjectMissingParameters} - Throws if the ID or permission is missing.
 * @throws {ObjectNotFound} - Throws if the role is not found.
 */
export const add_permission_to_role = async (id, permission_code) => {
    if(!id) {
        throw new ObjectMissingParameters("role");
    }
    const role_exists_id = await role_repository.find_role_by_id(id);
    if(!role_exists_id) {
        throw new ObjectNotFound("role");
    }
    await role_repository.add_permission_to_role(id, permission_code);
}
/**
 * Removes a permission from a role.
 * @param {string} id - The ID of the role.
 * @param {string} permission_code - The permission code to remove from the role.
 * @throws {ObjectMissingParameters} - Throws if the ID or permission is missing.
 * @throws {ObjectNotFound} - Throws if the role is not found.
 */
export const remove_permission_from_role = async (id, permission_code) => {
    if(!id) {
        throw new ObjectMissingParameters("role");
    }
    const role_exists_id = await role_repository.find_role_by_id(id);
    if(!role_exists_id) {
        throw new ObjectNotFound("role");
    }
    return await role_repository.remove_permission_from_role(id, permission_code);
}
/**
 * Deletes a role by its ID.
 * @param {string} id - The ID of the role to delete.
 * @throws {ObjectMissingParameters} - Throws if the ID is missing.
 * @throws {ObjectNotFound} - Throws if the role is not found.
 */
export const delete_role = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("role");
    }
    
    const role_exists = await role_repository.find_role_by_id(id);

    if(!role_exists){
        throw new ObjectNotFound("role");
    }
    return await role_repository.delete_role(id);
}