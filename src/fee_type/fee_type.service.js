import {ObjectAlreadyExists, ObjectInvalidQueryFilters, ObjectMissingParameters, ObjectNotFound } from '../config/errors.js';
import * as fee_type_repository from './fee_type.repository.js';
import { generate_filter } from '../config/util.js';
/**
 * Creates a new fee type if it doesn't already exist.
 * 
 * @param {string} fee_code - The unique fee code for the fee type.
 * @param {string} message - The message associated with the fee type.
 * @param {Decimal128} cost - The fee cost that the user must pay.
 * @returns {Promise<Object>} - The newly created fee type object.
 * @throws {ObjectAlreadyExists} - If the fee type with the given fee_code already exists.
 */
export const create_new_fee_type = async (fee_code, message) => {
    const fee_type_exists = await fee_type_repository.filter_fee_types({['fee_code']: new RegExp(fee_code, 'i')}, 0, 10);
    if(fee_type_exists.length != 0) {
        throw new ObjectAlreadyExists("fee_type");
    }
    const new_fee_type = await fee_type_repository.create_fee_type({fee_code, message, cost});
    return new_fee_type;
}
/**
 * Retrieves all fee types with pagination.
 * 
 * @param {number} page - The page number to retrieve.
 * @param {number} limit - The number of records per page.
 * @returns {Promise<Array>} - An array of fee types.
 * @throws {ObjectInvalidQueryFilters} - If the pagination values are invalid.
 */
export const get_all_fee_types = async (page, limit) => {
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("fee_type");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const fee_types = await fee_type_repository.find_all_fee_types(skip, limit);
    const total_fee_types = await fee_type_repository.count_fee_types();
    const total_pages = Math.ceil(total_fee_types / limit);
    return {
        data: fee_types,
        pagination: {
            totalItems: total_fee_types,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Filters fee types based on a specific field and value, with pagination.
 * 
 * @param {string} filter_field - The field to filter by (e.g., 'fee_code').
 * @param {string} filter_value - The value to filter the field by.
 * @param {number} page - The page number to retrieve.
 * @param {number} limit - The number of records per page.
 * @returns {Promise<Array>} - An array of filtered fee types.
 * @throws {ObjectInvalidQueryFilters} - If the filter field is invalid or pagination values are invalid.
 */
export const filter_fee_types = async (filter_field, filter_value, page, limit) => {
    const field_types = {
        fee_code: 'String',
        message: 'String'
    };
    const allowed_fields = Object.keys(field_types);
    if(!allowed_fields.includes(filter_field)) {
        throw new ObjectInvalidQueryFilters("fee_type");
    }
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("fee_type");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = generate_filter(field_types, filter_field, filter_value);
    const skip = (page - 1) * limit;
    const fee_types = await fee_type_repository.filter_fee_types(filter, skip, limit);
    const total_fee_types = await fee_type_repository.count_fee_types();
    const total_pages = Math.ceil(total_fee_types / limit);
    return {
        data: fee_types,
        pagination: {
            totalItems: total_fee_types,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Retrieves a fee type by its ID.
 * 
 * @param {string} id - The ID of the fee type to retrieve.
 * @returns {Promise<Object>} - The fee type object if found.
 * @throws {ObjectNotFound} - If no fee type is found with the given ID.
 */
export const get_fee_type_by_id = async (id) => {
    const fee_type_exists = await fee_type_repository.find_fee_type_by_id(id);
    if(!fee_type_exists) {
        throw new ObjectNotFound("fee_type");
    }
    return fee_type_exists;
}
/**
 * Updates an existing fee type by its ID.
 * 
 * @param {string} id - The ID of the fee type to update.
 * @param {Object} updates - The fields to update in the fee type.
 * @returns {Promise<Object>} - The updated fee type object.
 * @throws {ObjectNotFound} - If no fee type is found with the given ID.
 * @throws {ObjectAlreadyExists} - If the updated fee type code already exists.
 * @throws {ObjectMissingParameters} - If the ID is missing.
 */
export const update_fee_type = async (id, updates) => { 
    if(!id) {
        throw new ObjectMissingParameters("fee_type");
    }
    const fee_type_exists_id = await fee_type_repository.find_fee_type_by_id(id);
    const fee_type_exists_code = await fee_type_repository.filter_fee_types({['fee_code']: new RegExp(updates.fee_code, 'i')}, 0, 10);
    if(!fee_type_exists_id){
        throw new ObjectNotFound("fee_type");
    }
    if( (fee_type_exists_code.length != 0) && (fee_type_exists_code[0]._id.toString() != id )) {
        throw new ObjectAlreadyExists("fee_type");
    }
    return await fee_type_repository.update_fee_type(id, updates);
}
/**
 * Deletes a fee type by its ID.
 * 
 * @param {string} id - The ID of the fee type to delete.
 * @returns {void} - A promise indicating the deletion was successful.
 * @throws {ObjectNotFound} - If no fee type is found with the given ID.
 * @throws {ObjectMissingParameters} - If the ID is missing.
 */
export const delete_fee_type = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("fee_type");
    }
    
    const fee_type_exists = await fee_type_repository.find_fee_type_by_id(id);

    if(!fee_type_exists){
        throw new ObjectNotFound("fee_type");
    }
    return await fee_type_repository.delete_fee_type(id);
}