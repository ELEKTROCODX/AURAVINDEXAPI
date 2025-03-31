import {ObjectAlreadyExists, ObjectInvalidQueryFilters, ObjectMissingParameters, ObjectNotFound } from '../config/errors.js';
import * as alert_type_repository from './alert_type.repository.js';
import { generate_filter } from '../config/util.js';
/**
 * Creates a new alert type.
 * @param {string} alert_code - The unique code for the alert type.
 * @param {string} message - The message associated with the alert type.
 * @returns {Promise<Object>} The created alert type object.
 * @throws {ObjectAlreadyExists} If an alert type with the same code already exists.
 */
export const create_new_alert_type = async (alert_code, message) => {
    const alert_type_exists = await alert_type_repository.filter_alert_types({['alert_code']: new RegExp(alert_code, 'i')}, 0, 10);
    
    if(alert_type_exists.length != 0) {
        throw new ObjectAlreadyExists("alert_type");
    }
    const new_alert_type = await alert_type_repository.create_alert_type({alert_code, message});
    return new_alert_type;
}
/**
 * Retrieves all alert types with pagination.
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of items per page.
 * @returns {Promise<Object[]>} An array of alert types.
 * @throws {ObjectInvalidQueryFilters} If the pagination parameters are invalid.
 */
export const get_all_alert_types = async (page, limit) => {
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("alert_type");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const alert_types = await alert_type_repository.find_all_alert_types(skip, limit);
    const total_alert_types = await alert_type_repository.count_alert_types();
    const total_pages = Math.ceil(total_alert_types / limit);
    return {
        data: alert_types,
        pagination: {
            totalItems: total_alert_types,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Filters alert types based on a specified field and value.
 * @param {string} filter_field - The field to filter by.
 * @param {string} filter_value - The value to match for the filter.
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of items per page.
 * @returns {Promise<Object[]>} An array of filtered alert types.
 * @throws {ObjectInvalidQueryFilters} If the filters or pagination parameters are invalid.
 */
export const filter_alert_types = async (filter_field, filter_value, page, limit) => {
    const field_types = {
        alert_code: 'String',
        message: 'String'
    };
    const allowed_fields = Object.keys(field_types);
    if(!allowed_fields.includes(filter_field)) {
        throw new ObjectInvalidQueryFilters("alert_type");
    }
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("alert_type");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = generate_filter(field_types, filter_field, filter_value);
    const skip = (page - 1) * limit;
    const alert_types = await alert_type_repository.filter_alert_types(filter, skip, limit);
    const total_alert_types = await book_repository.count_books();
    const total_pages = Math.ceil(total_alert_types / limit);
    return {
        data: alert_types,
        pagination: {
            totalItems: total_alert_types,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Retrieves a single alert type by its ID.
 * @param {string} id - The ID of the alert type.
 * @returns {Promise<Object>} The alert type object.
 * @throws {ObjectNotFound} If the alert type with the given ID does not exist.
 */
export const get_alert_type_by_id = async (id) => {
    const alert_type_exists = await alert_type_repository.find_alert_type_by_id(id);
    if(!alert_type_exists) {
        throw new ObjectNotFound("alert_type");
    }
    return alert_type_exists;
}
/**
 * Updates an existing alert type.
 * @param {string} id - The ID of the alert type to update.
 * @param {Object} updates - The updates to apply.
 * @returns {Promise<Object>} The updated alert type object.
 * @throws {ObjectMissingParameters} If the ID is not provided.
 * @throws {ObjectNotFound} If the alert type with the given ID does not exist.
 * @throws {ObjectAlreadyExists} If the updated alert type code conflicts with an existing alert type.
 */
export const update_alert_type = async (id, updates) => { 
    if(!id) {
        throw new ObjectMissingParameters("alert_type");
    }
    const alert_type_exists_id = await alert_type_repository.find_alert_type_by_id(id);
    const alert_type_exists_code = await alert_type_repository.filter_alert_types({['alert_code']: new RegExp(updates.alert_code, 'i')}, 0, 10);
    if(!alert_type_exists_id){
        throw new ObjectNotFound("alert_type");
    }
    
    if( (alert_type_exists_code.length != 0) && (alert_type_exists_code[0]._id.toString() != id) ) {
        throw new ObjectAlreadyExists("alert_type");
    }
    return await alert_type_repository.update_alert_type(id, updates);
}
/**
 * Deletes an alert type by its ID.
 * @param {string} id - The ID of the alert type to delete.
 * @returns {Promise<Object>} The deleted alert type object.
 * @throws {ObjectMissingParameters} If the ID is not provided.
 * @throws {ObjectNotFound} If the alert type with the given ID does not exist.
 */
export const delete_alert_type = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("alert_type");
    }
    
    const alert_type_exists = await alert_type_repository.find_alert_type_by_id(id);

    if(!alert_type_exists){
        throw new ObjectNotFound("alert_type");
    }
    return await alert_type_repository.delete_alert_type(id);
}