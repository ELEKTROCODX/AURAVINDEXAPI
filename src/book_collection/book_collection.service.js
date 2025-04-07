import {ObjectAlreadyExists, ObjectInvalidQueryFilters, ObjectMissingParameters, ObjectNotFound } from '../config/errors.js';
import * as book_collection_repository from './book_collection.repository.js';
import { generate_filter } from '../config/util.js';
/**
 * Creates a new book collection.
 * 
 * @param {string} name - The name of the book collection to create.
 * @returns {Promise<Object>} The newly created book collection.
 * @throws {ObjectAlreadyExists} If a book collection with the given name already exists.
 */
export const create_new_book_collection = async (name) => {
    const book_collection_exists = await book_collection_repository.filter_book_collections({['name']: new RegExp(name, 'i')}, 0, 10);
    if(book_collection_exists.length != 0) {
        throw new ObjectAlreadyExists("book_collection");
    }
    const new_book_collection = await book_collection_repository.create_book_collection({name});
    return new_book_collection;
}
/**
 * Retrieves all book collections with pagination.
 * 
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of collections per page.
 * @returns {Promise<Array>} A list of book collections.
 * @throws {ObjectInvalidQueryFilters} If the query parameters are invalid.
 */
export const get_all_book_collections = async (page, limit) => {
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("book_collection");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const book_collections = await book_collection_repository.find_all_book_collections(skip, limit);
    const total_book_collections = await book_collection_repository.count_book_collections();
    const total_pages = Math.ceil(total_book_collections / limit);
    return {
        data: book_collections,
        pagination: {
            totalItems: total_book_collections,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Filters book collections based on a specific field and value with pagination.
 * 
 * @param {string} filter_field - The field to filter by.
 * @param {string} filter_value - The value to filter by.
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of collections per page.
 * @returns {Promise<Array>} A list of filtered book collections.
 * @throws {ObjectInvalidQueryFilters} If the filter field is not allowed or if query parameters are invalid.
 */
export const filter_book_collections = async (filter_field, filter_value, page, limit) => {
    const field_types = {
        name: 'String'
    };
    const allowed_fields = Object.keys(field_types);
    if(!allowed_fields.includes(filter_field)) {
        throw new ObjectInvalidQueryFilters("book_collection");
    }
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("book_collection");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = generate_filter(field_types, filter_field, filter_value);
    const skip = (page - 1) * limit;
    const book_collections = await book_collection_repository.filter_book_collections(filter, skip, limit);
    const total_book_collections = book_collections.length;
    const total_pages = Math.ceil(total_book_collections / limit);
    return {
        data: book_collections,
        pagination: {
            totalItems: total_book_collections,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Retrieves a book collection by its ID.
 * 
 * @param {string} id - The ID of the book collection.
 * @returns {Promise<Object>} The book collection.
 * @throws {ObjectNotFound} If the book collection with the given ID is not found.
 */
export const get_book_collection_by_id = async (id) => {
    const book_collection_exists = await book_collection_repository.find_book_collection_by_id(id);
    if(!book_collection_exists) {
        throw new ObjectNotFound("book_collection");
    }
    return book_collection_exists;
}
/**
 * Updates an existing book collection by ID.
 * 
 * @param {string} id - The ID of the book collection to update.
 * @param {Object} updates - The fields to update.
 * @returns {Promise<Object>} The updated book collection.
 * @throws {ObjectMissingParameters} If the ID is not provided.
 * @throws {ObjectAlreadyExists} If another collection with the same name exists.
 * @throws {ObjectNotFound} If the book collection with the given ID is not found.
 */
export const update_book_collection = async (id, updates) => { 
    if(!id) {
        throw new ObjectMissingParameters("book_collection");
    }
    const book_collection_exists_id = await book_collection_repository.find_book_collection_by_id(id);
    const book_collection_exists_name = await book_collection_repository.filter_book_collections({['name']: new RegExp(updates.name, 'i')}, 0, 10);
    if(!book_collection_exists_id){
        throw new ObjectNotFound("book_collection");
    }
    if( (book_collection_exists_name.length != 0) && (book_collection_exists_name[0]._id.toString() != id) ) {
        throw new ObjectAlreadyExists("book_collection");
    }
    return await book_collection_repository.update_book_collection(id, updates);
}
/**
 * Deletes a book collection by ID.
 * 
 * @param {string} id - The ID of the book collection to delete.
 * @returns {Promise<Object>} The result of the deletion.
 * @throws {ObjectMissingParameters} If the ID is not provided.
 * @throws {ObjectNotFound} If the book collection with the given ID is not found.
 */
export const delete_book_collection = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("book_collection");
    }
    
    const book_collection_exists = await book_collection_repository.find_book_collection_by_id(id);

    if(!book_collection_exists){
        throw new ObjectNotFound("book_collection");
    }
    return await book_collection_repository.delete_book_collection(id);
}