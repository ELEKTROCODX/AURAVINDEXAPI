import {ObjectAlreadyExists, ObjectInvalidQueryFilters, ObjectMissingParameters, ObjectNotFound } from '../config/errors.js';
import * as author_repository from './author.repository.js';
import * as gender_repository from '../gender/gender.repository.js';
import { generate_filter } from '../config/util.js';
/**
 * Creates a new author entry in the database.
 * 
 * @param {string} name - The name of the author.
 * @param {string} last_name - The last name of the author.
 * @param {Date} birthdate - The birthdate of the author.
 * @param {string} gender - The gender ID of the author.
 * @returns {Object} The newly created author object.
 * @throws {ObjectAlreadyExists} If the author already exists in the database.
 * @throws {ObjectNotFound} If the gender ID does not exist.
 */
export const create_new_author = async (name, last_name, birthdate, gender) => {
    const author_exists = await author_repository.filter_authors({['name']: new RegExp(name, 'i'), ['last_name']: new RegExp(last_name, 'i')}, 0, 10);
    const gender_exists = await gender_repository.find_gender_by_id(gender);
    if(author_exists.length != 0) {
        throw new ObjectAlreadyExists("author");
    }
    if(!gender_exists) {
        throw new ObjectNotFound("gender");
    }
    const new_author = await author_repository.create_author({name, last_name, birthdate, gender});
    return new_author;
}
/**
 * Retrieves all authors with pagination.
 * 
 * @param {number} page - The page number to retrieve.
 * @param {number} limit - The number of authors per page.
 * @returns {Array} List of authors for the given page and limit.
 * @throws {ObjectInvalidQueryFilters} If the query filters are invalid.
 */
export const get_all_authors = async (page, limit) => {
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("author");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const authors = await author_repository.find_all_authors(skip, limit);
    const total_authors = await author_repository.count_authors();
    const total_pages = Math.ceil(total_authors / limit);
    return {
        data: authors,
        pagination: {
            totalItems: total_authors,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Filters authors based on the given filter field and value.
 * 
 * @param {string} filter_field - The field to filter by (name, last_name, birthdate, gender).
 * @param {string} filter_value - The value to filter the authors by.
 * @param {number} page - The page number to retrieve.
 * @param {number} limit - The number of authors per page.
 * @returns {Array} List of authors matching the filter criteria.
 * @throws {ObjectInvalidQueryFilters} If the query filters are invalid.
 */
export const filter_authors = async (filter_field, filter_value, page, limit) => {
    const field_types = {
        name: 'String',
        last_name: 'String',
        birthdate: 'Date',
        gender: 'ObjectId'
    };
    const allowed_fields = Object.keys(field_types);
    if(!allowed_fields.includes(filter_field)) {
        throw new ObjectInvalidQueryFilters("author");
    }
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("author");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = generate_filter(field_types, filter_field, filter_value);
    const skip = (page - 1) * limit;
    const authors = await author_repository.filter_authors(filter, skip, limit);
    const total_authors = authors.length;
    const total_pages = Math.ceil(total_authors / limit);
    return {
        data: authors,
        pagination: {
            totalItems: total_authors,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Retrieves an author by their ID.
 * 
 * @param {string} id - The ID of the author to retrieve.
 * @returns {Object} The author object.
 * @throws {ObjectNotFound} If the author with the specified ID is not found.
 */
export const get_author_by_id = async (id) => {
    const author_exists = await author_repository.find_author_by_id(id);
    if(!author_exists) {
        throw new ObjectNotFound("author");
    }
    return author_exists;
}
/**
 * Updates an existing author by their ID.
 * 
 * @param {string} id - The ID of the author to update.
 * @param {Object} updates - The fields to update.
 * @returns {Object} The updated author object.
 * @throws {ObjectNotFound} If the author with the specified ID is not found.
 * @throws {ObjectAlreadyExists} If the updated name and last name already exist for another author.
 * @throws {ObjectNotFound} If the provided gender ID does not exist.
 */
export const update_author = async (id, updates) => { 
    if(!id) {
        throw new ObjectMissingParameters("author");
    }
    const author_exists_id = await author_repository.find_author_by_id(id);
    const author_exists_name = await author_repository.filter_authors({['name']: new RegExp(updates.name, 'i'), ['last_name']: new RegExp(updates.last_name, 'i')}, 0, 10);;
    const author_exists_gender = await gender_repository.find_gender_by_id(updates.gender);
    if(!author_exists_id){
        throw new ObjectNotFound("author");
    }
    if( (author_exists_name.length != 0) && (author_exists_name[0]._id.toString() != id ) ) {
        throw new ObjectAlreadyExists("author");
    }
    if(!author_exists_gender) {
        throw new ObjectNotFound("gender");
    }
    return await author_repository.update_author(id, updates);
}
/**
 * Deletes an author by their ID.
 * 
 * @param {string} id - The ID of the author to delete.
 * @returns {Object} A confirmation message that the author has been deleted.
 * @throws {ObjectNotFound} If the author with the specified ID is not found.
 * @throws {ObjectMissingParameters} If the ID is not provided.
 */
export const delete_author = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("author");
    }
    
    const author_exists = await author_repository.find_author_by_id(id);

    if(!author_exists){
        throw new ObjectNotFound("author");
    }
    return await author_repository.delete_author(id);
}