import {ObjectAlreadyExists, ObjectInvalidQueryFilters, ObjectMissingParameters, ObjectNotFound } from '../config/errors.js';
import * as log_action_repository from './log_action.repository.js';
import { generate_filter } from '../config/util.js';
/**
 * Creates a new log action with the provided action code.
 * @param {string} action_code - The code for the new log action.
 * @returns {Object} The newly created log action.
 * @throws {ObjectAlreadyExists} If a log action with the given code already exists.
 */
export const create_new_log_action = async (action_code) => {
    const log_action_exists = await log_action_repository.filter_log_actions({['action_code']: new RegExp(action_code, 'i')}, 0, 10);
    if(log_action_exists.length != 0) {
        throw new ObjectAlreadyExists("log_action");
    }
    const new_log_action = await log_action_repository.create_log_action({action_code});
    return new_log_action;
}
/**
 * Retrieves all log actions with pagination.
 * @param {number} page - The page number.
 * @param {number} limit - The number of log actions per page.
 * @returns {Array} The list of log actions.
 * @throws {ObjectInvalidQueryFilters} If the page or limit are invalid.
 */
export const get_all_log_actions = async (page, limit) => {
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("log_action");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const log_actions = await log_action_repository.find_all_log_actions(skip, limit);
    const total_log_actions = await log_action_repository.count_log_actions();
    const total_pages = Math.ceil(total_log_actions / limit);
    return {
        data: log_actions,
        pagination: {
            totalItems: total_log_actions,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Filters log actions based on the provided field and value.
 * @param {string} filter_field - The field to filter by.
 * @param {string} filter_value - The value to filter the field by.
 * @param {number} page - The page number.
 * @param {number} limit - The number of log actions per page.
 * @returns {Array} The list of filtered log actions.
 * @throws {ObjectInvalidQueryFilters} If the field or pagination parameters are invalid.
 */
export const filter_log_actions = async (filter_field, filter_value, page, limit) => {
    const field_types = {
        action_code: 'String'
    };
    const allowed_fields = Object.keys(field_types);
    if(!allowed_fields.includes(filter_field)) {
        throw new ObjectInvalidQueryFilters("log_action");
    }
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("log_action");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = generate_filter(field_types, filter_field, filter_value);
    const skip = (page - 1) * limit;
    const log_actions = await log_action_repository.filter_log_actions(filter, skip, limit);
    const total_log_actions = await log_action_repository.count_log_actions();
    const total_pages = Math.ceil(total_log_actions / limit);
    return {
        data: log_actions,
        pagination: {
            totalItems: total_log_actions,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Retrieves a log action by its ID.
 * @param {string} id - The ID of the log action.
 * @returns {Object} The log action.
 * @throws {ObjectNotFound} If the log action with the given ID is not found.
 */
export const get_log_action_by_id = async (id) => {
    const log_action_exists = await log_action_repository.find_log_action_by_id(id);
    if(!log_action_exists) {
        throw new ObjectNotFound("log_action");
    }
    return log_action_exists;
}
/**
 * Updates a log action with the specified ID and data.
 * @param {string} id - The ID of the log action to update.
 * @param {Object} updates - The updates to apply to the log action.
 * @returns {Object} The updated log action.
 * @throws {ObjectMissingParameters} If the ID is missing.
 * @throws {ObjectAlreadyExists} If a log action with the updated action code already exists.
 * @throws {ObjectNotFound} If the log action with the given ID is not found.
 */
export const update_log_action = async (id, updates) => { 
    if(!id) {
        throw new ObjectMissingParameters("log_action");
    }
    const log_action_exists_id = await log_action_repository.find_log_action_by_id(id);
    const log_action_exists_code = await log_action_repository.filter_log_actions({['action_code']: new RegExp(updates.action_code, 'i')}, 0, 10);
    if(!log_action_exists_id){
        throw new ObjectNotFound("log_action");
    }
    if( (log_action_exists_code.length != 0) && (log_action_exists_code[0]._id.toString() != id) ) {
        throw new ObjectAlreadyExists("log_action");
    }
    return await log_action_repository.update_log_action(id, updates);
}
/**
 * Deletes a log action by its ID.
 * @param {string} id - The ID of the log action to delete.
 * @returns {Object} The result of the deletion.
 * @throws {ObjectMissingParameters} If the ID is missing.
 * @throws {ObjectNotFound} If the log action with the given ID is not found.
 */
export const delete_log_action = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("log_action");
    }
    
    const log_action_exists = await log_action_repository.find_log_action_by_id(id);

    if(!log_action_exists){
        throw new ObjectNotFound("log_action");
    }
    return await log_action_repository.delete_log_action(id);
}