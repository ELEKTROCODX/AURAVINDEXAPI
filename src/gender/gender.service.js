import {ObjectAlreadyExists, ObjectInvalidQueryFilters, ObjectMissingParameters, ObjectNotFound } from '../config/errors.js';
import * as gender_repository from './gender.repository.js';
import { generate_filter } from '../config/util.js';
/**
 * Creates a new gender if it doesn't already exist.
 * 
 * @param {string} name - The name of the gender to create.
 * @returns {Promise<Object>} - The newly created gender object.
 * @throws {ObjectAlreadyExists} - If the gender already exists.
 */
export const create_new_gender = async (name) => {
    const gender_exists = await gender_repository.filter_genders({['name']: new RegExp(name, 'i')}, 0, 10);
    if(gender_exists.length != 0) {
        throw new ObjectAlreadyExists("gender");
    }
    const new_gender = await gender_repository.create_gender({name});
    return new_gender;
}
/**
 * Retrieves all genders with pagination.
 * 
 * @param {number} page - The page number for pagination (starting from 1).
 * @param {number} limit - The number of results per page.
 * @returns {Promise<Array>} - A list of gender objects.
 * @throws {ObjectInvalidQueryFilters} - If the query filters are invalid.
 */
export const get_all_genders = async (page, limit) => {
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("gender");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const genders = await gender_repository.find_all_genders(skip, limit);
    const total_genders = await gender_repository.count_genders();
    const total_pages = Math.ceil(total_genders / limit);
    return {
        data: genders,
        pagination: {
            totalItems: total_genders,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Filters genders based on a specified field and value, with pagination.
 * 
 * @param {string} filter_field - The field to filter by (e.g., "name").
 * @param {string} filter_value - The value to filter by.
 * @param {number} page - The page number for pagination (starting from 1).
 * @param {number} limit - The number of results per page.
 * @returns {Promise<Array>} - A list of filtered gender objects.
 * @throws {ObjectInvalidQueryFilters} - If the filter field is invalid or the query filters are incorrect.
 */
export const filter_genders = async (filter_field, filter_value, page, limit) => {
    const field_types = {
        name: 'String'
    };
    const allowed_fields = Object.keys(field_types);
    if(!allowed_fields.includes(filter_field)) {
        throw new ObjectInvalidQueryFilters("gender");
    }
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("gender");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = generate_filter(field_types, filter_field, filter_value);
    const skip = (page - 1) * limit;
    const genders = await gender_repository.filter_genders(filter, skip, limit);
    const total_genders = await gender_repository.count_genders();
    const total_pages = Math.ceil(total_genders / limit);
    return {
        data: genders,
        pagination: {
            totalItems: total_genders,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Retrieves a gender by its ID.
 * 
 * @param {string} id - The ID of the gender to retrieve.
 * @returns {Promise<Object>} - The gender object.
 * @throws {ObjectNotFound} - If the gender with the given ID is not found.
 */
export const get_gender_by_id = async (id) => {
    const gender_exists = await gender_repository.find_gender_by_id(id);
    if(!gender_exists) {
        throw new ObjectNotFound("gender");
    }
    return gender_exists;
}
/**
 * Updates a gender's details.
 * 
 * @param {string} id - The ID of the gender to update.
 * @param {Object} updates - The fields to update (e.g., {name: "new name"}).
 * @returns {Promise<Object>} - The updated gender object.
 * @throws {ObjectMissingParameters} - If the ID is missing.
 * @throws {ObjectNotFound} - If the gender with the given ID does not exist.
 * @throws {ObjectAlreadyExists} - If a gender with the same name already exists.
 */
export const update_gender = async (id, updates) => { 
    if(!id) {
        throw new ObjectMissingParameters("gender");
    }
    const gender_exists_id = await gender_repository.find_gender_by_id(id);
    const gender_exists_name = await gender_repository.filter_genders({['name']: new RegExp(updates.name, 'i')}, 0, 10);
    if(!gender_exists_id){
        throw new ObjectNotFound("gender");
    }
    if( (gender_exists_name.length != 0) && (gender_exists_name[0]._id.toString() != id )) {
        throw new ObjectAlreadyExists("gender");
    }
    return await gender_repository.update_gender(id, updates);
}
/**
 * Deletes a gender by its ID.
 * 
 * @param {string} id - The ID of the gender to delete.
 * @returns {Promise<void>} - A promise indicating the deletion was successful.
 * @throws {ObjectMissingParameters} - If the ID is missing.
 * @throws {ObjectNotFound} - If the gender with the given ID does not exist.
 */
export const delete_gender = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("gender");
    }
    
    const gender_exists = await gender_repository.find_gender_by_id(id);

    if(!gender_exists){
        throw new ObjectNotFound("gender");
    }
    return await gender_repository.delete_gender(id);
}