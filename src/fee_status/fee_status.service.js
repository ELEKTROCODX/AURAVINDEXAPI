import {ObjectAlreadyExists, ObjectMissingParameters, ObjectNotFound } from '../config/errors.js';
import * as fee_status_repository from './fee_status.repository.js';
import { generate_filter } from '../config/util.js';
/**
 * Creates a new fee status.
 * Checks if the fee status already exists before creating it.
 * @param {string} fee_status - The fee status to create.
 * @returns {Promise<Object>} The newly created fee status.
 * @throws {ObjectAlreadyExists} If the fee status already exists.
 */
export const create_new_fee_status = async (fee_status) => {
    const fee_status_exists = await fee_status_repository.filter_fee_statuses({['fee_status']: new RegExp(fee_status, 'i')}, 0, 10);
    if(fee_status_exists.length != 0) {
        throw new ObjectAlreadyExists("fee_status");
    }
    const new_fee_status = await fee_status_repository.create_fee_status({fee_status});
    return new_fee_status;
}
/**
 * Retrieves all fee statuses with pagination.
 * @param {number} page - The page number to retrieve.
 * @param {number} limit - The number of items per page.
 * @returns {Promise<Array>} List of fee statuses.
 * @throws {ObjectInvalidQueryFilters} If invalid query filters are provided.
 */
export const get_all_fee_statuses = async (page, limit) => {
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("fee_status");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const fee_statuses = await fee_status_repository.find_all_fee_statuses(skip, limit);
    const total_fee_statuses = await fee_status_repository.count_fee_statuses();
    const total_pages = Math.ceil(total_fee_statuses / limit);
    return {
        data: fee_statuses,
        pagination: {
            totalItems: total_fee_statuses,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Filters fee statuses based on a specific field and value with pagination.
 * @param {string} filter_field - The field to filter by (e.g., 'fee_status').
 * @param {string} filter_value - The value to filter by.
 * @param {number} page - The page number to retrieve.
 * @param {number} limit - The number of items per page.
 * @returns {Promise<Array>} List of filtered fee statuses.
 * @throws {ObjectInvalidQueryFilters} If invalid query filters are provided.
 */
export const filter_fee_statuses = async (filter_field, filter_value, page, limit) => {
    const field_types = {
        fee_status: 'String'
    };
    const allowed_fields = Object.keys(field_types);
    if(!allowed_fields.includes(filter_field)) {
        throw new ObjectInvalidQueryFilters("fee_status");
    }
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("fee_status");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = generate_filter(field_types, filter_field, filter_value);
    const skip = (page - 1) * limit;
    const fee_statuses = await fee_status_repository.filter_fee_statuses(filter, skip, limit);
    const total_fee_statuses = await fee_status_repository.count_fee_statuses();
    const total_pages = Math.ceil(total_fee_statuses / limit);
    return {
        data: fee_statuses,
        pagination: {
            totalItems: total_fee_statuses,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Retrieves a fee status by its ID.
 * @param {string} id - The ID of the fee status to retrieve.
 * @returns {Promise<Object>} The fee status.
 * @throws {ObjectNotFound} If the fee status with the provided ID is not found.
 */
export const get_fee_status_by_id = async (id) => {
    const fee_status_exists = await fee_status_repository.find_fee_status_by_id(id);
    if(!fee_status_exists) {
        throw new ObjectNotFound("fee_status");
    }
    return fee_status_exists;
}
/**
 * Updates a fee status by its ID.
 * @param {string} id - The ID of the fee status to update.
 * @param {Object} updates - The updates to apply to the fee status.
 * @returns {Promise<Object>} The updated fee status.
 * @throws {ObjectMissingParameters} If the ID or updates are missing.
 * @throws {ObjectAlreadyExists} If the updated fee status already exists.
 * @throws {ObjectNotFound} If the fee status with the provided ID is not found.
 */
export const update_fee_status = async (id, updates) => { 
    if(!id) {
        throw new ObjectMissingParameters("fee_status");
    }
    const fee_status_exists_id = await fee_status_repository.find_fee_status_by_id(id);
    const fee_status_exists = await fee_status_repository.filter_fee_statuses({['fee_status']: new RegExp(fee_status, 'i')}, 0, 10);
    if(!fee_status_exists_id){
        throw new ObjectNotFound("fee_status");
    }
    if( (fee_status_exists.length != 0) && (fee_status_exists[0]._id.toString() != id)) {
        throw new ObjectAlreadyExists("fee_status");
    }
    return await fee_status_repository.update_fee_status(id, updates);
}
/**
 * Deletes a fee status by its ID.
 * @param {string} id - The ID of the fee status to delete.
 * @returns {Promise<Object>} The result of the deletion.
 * @throws {ObjectMissingParameters} If the ID is missing.
 * @throws {ObjectNotFound} If the fee status with the provided ID is not found.
 */
export const delete_fee_status = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("fee_status");
    }
    
    const fee_status_exists = await fee_status_repository.find_fee_status_by_id(id);

    if(!fee_status_exists){
        throw new ObjectNotFound("fee_status");
    }
    return await fee_status_repository.delete_fee_status(id);
}