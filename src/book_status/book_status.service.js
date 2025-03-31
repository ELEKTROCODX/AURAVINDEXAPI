import {ObjectAlreadyExists, ObjectInvalidQueryFilters, ObjectMissingParameters, ObjectNotFound } from '../config/errors.js';
import * as book_status_repository from './book_status.repository.js';
import { generate_filter } from '../config/util.js';
/**
 * Creates a new book status if it doesn't already exist.
 * 
 * @param {string} book_status The status of the book to create.
 * @returns {Promise<Object>} The newly created book status.
 * @throws {ObjectAlreadyExists} If the book status already exists.
 */
export const create_new_book_status = async (book_status) => {
    const book_status_exists = await book_status_repository.filter_book_statuses({['book_status']: new RegExp(book_status, 'i')}, 0, 10);
    if(book_status_exists.length != 0) {
        throw new ObjectAlreadyExists("book_status");
    }
    const new_book_status = await book_status_repository.create_book_status({book_status});
    return new_book_status;
}
/**
 * Retrieves all book statuses with pagination.
 * 
 * @param {number} page The page number for pagination.
 * @param {number} limit The number of results per page.
 * @returns {Promise<Array>} A list of book statuses.
 * @throws {ObjectInvalidQueryFilters} If the page or limit is invalid.
 */
export const get_all_book_statuses = async (page, limit) => {
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("book_status");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const book_statuses = await book_status_repository.find_all_book_statuses(skip, limit);
    const total_book_statuses = await book_status_repository.count_book_statuses();
    const total_pages = Math.ceil(total_book_statuses / limit);
    return {
        data: book_statuses,
        pagination: {
            totalItems: total_book_statuses,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Filters book statuses based on specified filter field and value with pagination.
 * 
 * @param {string} filter_field The field to filter by (e.g., "book_status").
 * @param {string} filter_value The value to filter the field by.
 * @param {number} page The page number for pagination.
 * @param {number} limit The number of results per page.
 * @returns {Promise<Array>} A list of filtered book statuses.
 * @throws {ObjectInvalidQueryFilters} If the filter field is not allowed or page/limit are invalid.
 */
export const filter_book_statuses = async (filter_field, filter_value, page, limit) => {
    const field_types = {
        book_status: 'String'
    };
    const allowed_fields = Object.keys(field_types);
    if(!allowed_fields.includes(filter_field)) {
        throw new ObjectInvalidQueryFilters("book_status");
    }
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("book_status");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = generate_filter(field_types, filter_field, filter_value);
    const skip = (page - 1) * limit;
    const book_statuses = await book_status_repository.filter_book_statuses(filter, skip, limit);
    const total_book_statuses = await book_status_repository.count_book_statuses();
    const total_pages = Math.ceil(total_book_statuses / limit);
    return {
        data: book_statuses,
        pagination: {
            totalItems: total_book_statuses,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Retrieves a specific book status by its ID.
 * 
 * @param {string} id The ID of the book status to retrieve.
 * @returns {Promise<Object>} The book status with the specified ID.
 * @throws {ObjectNotFound} If no book status is found with the provided ID.
 */
export const get_book_status_by_id = async (id) => {
    const book_status_exists = await book_status_repository.find_book_status_by_id(id);
    if(!book_status_exists) {
        throw new ObjectNotFound("book_status");
    }
    return book_status_exists;
}
/**
 * Updates an existing book status by its ID.
 * 
 * @param {string} id The ID of the book status to update.
 * @param {Object} updates The updates to apply to the book status.
 * @returns {Promise<Object>} The updated book status.
 * @throws {ObjectNotFound} If no book status is found with the provided ID.
 * @throws {ObjectAlreadyExists} If the updated status already exists.
 * @throws {ObjectMissingParameters} If the ID or updates are missing.
 */
export const update_book_status = async (id, updates) => { 
    if(!id) {
        throw new ObjectMissingParameters("book_status");
    }
    const book_status_exists_id = await book_status_repository.find_book_status_by_id(id);
    const book_status_exists_status = await book_status_repository.filter_book_statuses({['book_status']: new RegExp(updates.book_status, 'i')}, 0, 10);
    if(!book_status_exists_id){
        throw new ObjectNotFound("book_status");
    }
    if( (book_status_exists_status.length != 0) && (book_status_exists_status[0]._id.toString() != id) ) {
        throw new ObjectAlreadyExists("book_status");
    }
    return await book_status_repository.update_book_status(id, updates);
}
/**
 * Deletes a book status by its ID.
 * 
 * @param {string} id The ID of the book status to delete.
 * @returns {Promise<Object>} The result of the deletion.
 * @throws {ObjectNotFound} If no book status is found with the provided ID.
 * @throws {ObjectMissingParameters} If the ID is missing.
 */
export const delete_book_status = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("book_status");
    }
    
    const book_status_exists = await book_status_repository.find_book_status_by_id(id);

    if(!book_status_exists){
        throw new ObjectNotFound("book_status");
    }
    return await book_status_repository.delete_book_status(id);
}