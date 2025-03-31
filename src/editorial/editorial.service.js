import {ObjectAlreadyExists, ObjectInvalidQueryFilters, ObjectMissingParameters, ObjectNotFound } from '../config/errors.js';
import * as editorial_repository from './editorial.repository.js';
import { generate_filter } from '../config/util.js';
/**
 * Creates a new editorial if it does not already exist.
 *
 * @param {string} name - The name of the editorial.
 * @param {string} address - The address of the editorial.
 * @param {string} email - The email of the editorial.
 * @throws {ObjectAlreadyExists} If an editorial with the same name or email already exists.
 * @returns {Object} The newly created editorial object.
 */
export const create_new_editorial = async (name, address, email) => {
    const editorial_exists = await editorial_repository.filter_editorials({['name']: new RegExp(name, 'i'), ['email']: new RegExp(email, 'i')}, 0, 10);
    if(editorial_exists.length != 0) {
        throw new ObjectAlreadyExists("editorial");
    }
    const new_editorial = await editorial_repository.create_editorial({name, address, email});
    return new_editorial;
}
/**
 * Retrieves all editorials with pagination.
 *
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The number of items per page.
 * @throws {ObjectInvalidQueryFilters} If the page or limit parameters are invalid.
 * @returns {Array} A list of editorials.
 */
export const get_all_editorials = async (page, limit) => {
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("editorial");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const editorials = await editorial_repository.find_all_editorials(skip, limit);
    const total_editorials = await editorial_repository.count_editorials();
    const total_pages = Math.ceil(total_editorials / limit);
    return {
        data: editorials,
        pagination: {
            totalItems: total_editorials,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Filters editorials based on a specific field and value with pagination.
 *
 * @param {string} filter_field - The field to filter by (e.g., name, address, email).
 * @param {string} filter_value - The value to match against the filter field.
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The number of items per page.
 * @throws {ObjectInvalidQueryFilters} If the filter field, page, or limit are invalid.
 * @returns {Array} A list of filtered editorials.
 */
export const filter_editorials = async (filter_field, filter_value, page, limit) => {
    const field_types = {
        name: 'String',
        address: 'String',
        email: 'String'
    };
    const allowed_fields = Object.keys(field_types);
    if(!allowed_fields.includes(filter_field)) {
        throw new ObjectInvalidQueryFilters("editorial");
    }
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("editorial");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = generate_filter(field_types, filter_field, filter_value);
    const skip = (page - 1) * limit;
    const editorials = await editorial_repository.filter_editorials(filter, skip, limit);
    const total_editorials = await editorial_repository.count_editorials();
    const total_pages = Math.ceil(total_editorials / limit);
    return {
        data: editorials,
        pagination: {
            totalItems: total_editorials,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Retrieves an editorial by its unique ID.
 *
 * @param {string} id - The ID of the editorial.
 * @throws {ObjectNotFound} If no editorial with the given ID is found.
 * @returns {Object} The editorial object.
 */
export const get_editorial_by_id = async (id) => {
    const editorial_exists = await editorial_repository.find_editorial_by_id(id);
    if(!editorial_exists) {
        throw new ObjectNotFound("editorial");
    }
    return editorial_exists;
}
/**
 * Updates an existing editorial's details.
 *
 * @param {string} id - The ID of the editorial to update.
 * @param {Object} updates - The updates to apply to the editorial.
 * @throws {ObjectMissingParameters} If the ID is missing.
 * @throws {ObjectNotFound} If no editorial with the given ID is found.
 * @throws {ObjectAlreadyExists} If another editorial with the same name or email already exists.
 * @returns {Object} The updated editorial object.
 */
export const update_editorial = async (id, updates) => { 
    if(!id) {
        throw new ObjectMissingParameters("editorial");
    }
    const editorial_exists_id = await editorial_repository.find_editorial_by_id(id);
    const editorial_exists_name = await editorial_repository.filter_editorials({['name']: new RegExp(updates.name, 'i'), ['email']: new RegExp(updates.email, 'i')}, 0, 10);
    if(!editorial_exists_id){
        throw new ObjectNotFound("editorial");
    }
    if( (editorial_exists_name.length != 0) && (editorial_exists_name[0]._id.toString() != id) ) {
        throw new ObjectAlreadyExists("editorial");
    }
    return await editorial_repository.update_editorial(id, updates);
}
/**
 * Deletes an editorial by its ID.
 *
 * @param {string} id - The ID of the editorial to delete.
 * @throws {ObjectMissingParameters} If the ID is missing.
 * @throws {ObjectNotFound} If no editorial with the given ID is found.
 * @returns {Object} The result of the delete operation.
 */
export const delete_editorial = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("editorial");
    }
    
    const editorial_exists = await editorial_repository.find_editorial_by_id(id);

    if(!editorial_exists){
        throw new ObjectNotFound("editorial");
    }
    return await editorial_repository.delete_editorial(id);
}