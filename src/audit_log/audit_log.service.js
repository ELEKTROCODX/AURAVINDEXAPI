import {ObjectAlreadyExists, ObjectInvalidQueryFilters, ObjectMissingParameters, ObjectNotFound } from '../config/errors.js';
import * as audit_log_repository from './audit_log.repository.js';
import * as user_repository from '../user/user.repository.js';
import * as log_action_repository from '../log_action/log_action.repository.js';
import { generate_filter } from '../config/util.js';
import mongoose from 'mongoose';
import { app_config } from '../config/app.config.js';
/**
 * Creates a new audit log entry in the database.
 * 
 * @param {string} user - The user ID who performed the action.
 * @param {string} action - The action that was performed.
 * @param {string} object - The object that was affected by the action.
 * @returns {object} The newly created audit log entry.
 * @throws {ObjectNotFound} If the user or action doesn't exist.
 */
export const create_new_audit_log = async (user, action, object) => {
    const user_exists = await user_repository.find_user_by_id(user);
    let log_action_exists;
    if( (!user_exists) && (action != app_config.PERMISSIONS.IMPORT_DEFAULT_DATA) ) {
        throw new ObjectNotFound("user");
    }
    if(mongoose.Types.ObjectId.isValid(action)) {
        log_action_exists = await log_action_repository.find_log_action_by_id(action);
    } else {
        log_action_exists = await log_action_repository.filter_log_actions({action_code: new RegExp(action, 'i')}, 0, 10);        
        if(log_action_exists.length == 0) {
            throw new ObjectNotFound("log_action");
        }
        action = log_action_exists[0]._id;
    }
    const new_audit_log = await audit_log_repository.create_audit_log({user, action, object});
    return new_audit_log;
}
/**
 * Retrieves all audit logs with pagination.
 * 
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of results per page.
 * @returns {array} List of audit logs.
 * @throws {ObjectInvalidQueryFilters} If page or limit are invalid.
 */
export const get_all_audit_logs = async (page, limit) => {
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("audit_log");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const audit_logs = await audit_log_repository.find_all_audit_logs(skip, limit);
    const total_audit_logs = await audit_log_repository.count_audit_logs();
    const total_pages = Math.ceil(total_audit_logs / limit);
    return {
        data: audit_logs,
        pagination: {
            totalItems: total_audit_logs,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Filters the audit logs based on specific fields.
 * 
 * @param {string} filter_field - The field to filter by (e.g., user, action).
 * @param {string} filter_value - The value to search for in the field.
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of results per page.
 * @returns {array} Filtered audit logs.
 * @throws {ObjectInvalidQueryFilters} If the filter field is invalid or query parameters are incorrect.
 */
export const filter_audit_logs = async (filter_field, filter_value, page, limit) => {
    const field_types = {
        user: 'ObjectId',
        action: 'ObjectId',
        object: 'String'
    };
    const allowed_fields = Object.keys(field_types);
    if(!allowed_fields.includes(filter_field)) {
        throw new ObjectInvalidQueryFilters("audit_log");
    }
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("audit_log");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = generate_filter(field_types, filter_field, filter_value);
    const skip = (page - 1) * limit;
    const audit_logs = await audit_log_repository.filter_audit_logs(filter, skip, limit);
    const total_audit_logs = audit_logs.length;
    const total_pages = Math.ceil(total_audit_logs / limit);
    return {
        data: audit_logs,
        pagination: {
            totalItems: total_audit_logs,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Retrieves a specific audit log by its ID.
 * 
 * @param {string} id - The ID of the audit log to retrieve.
 * @returns {object} The requested audit log.
 * @throws {ObjectNotFound} If no audit log is found with the provided ID.
 */
export const get_audit_log_by_id = async (id) => {
    const audit_log_exists = await audit_log_repository.find_audit_log_by_id(id);
    if(!audit_log_exists) {
        throw new ObjectNotFound("audit_log");
    }
    return audit_log_exists;
}
/**
 * Updates an existing audit log entry.
 * 
 * @param {string} id - The ID of the audit log to update.
 * @param {object} updates - The fields to update in the audit log.
 * @returns {object} The updated audit log.
 * @throws {ObjectMissingParameters} If no ID is provided.
 * @throws {ObjectNotFound} If no audit log is found with the provided ID.
 */
export const update_audit_log = async (id, updates) => { 
    if(!id) {
        throw new ObjectMissingParameters("audit_log");
    }
    const user_exists = await user_repository.find_user_by_id(user);
    const log_action_exists = await log_action_repository.find_log_action_by_id(action);
    if(!user_exists) {
        throw new ObjectNotFound("user");
    }
    if(!log_action_exists) {
        throw new ObjectNotFound("log_action");
    }
    const audit_log_exists_id = await audit_log_repository.find_audit_log_by_id(id);
    if(!audit_log_exists_id){
        throw new ObjectNotFound("audit_log");
    }
    return await audit_log_repository.update_audit_log(id, updates);
}
/**
 * Deletes an audit log entry by its ID.
 * 
 * @param {string} id - The ID of the audit log to delete.
 * @returns {object} Confirmation message or the deleted audit log.
 * @throws {ObjectMissingParameters} If no ID is provided.
 * @throws {ObjectNotFound} If no audit log is found with the provided ID.
 */
export const delete_audit_log = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("audit_log");
    }
    
    const audit_log_exists = await audit_log_repository.find_audit_log_by_id(id);

    if(!audit_log_exists){
        throw new ObjectNotFound("audit_log");
    }
    return await audit_log_repository.delete_audit_log(id);
}