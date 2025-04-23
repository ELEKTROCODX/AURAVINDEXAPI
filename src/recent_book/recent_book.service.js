import {ObjectAlreadyExists, ObjectInvalidQueryFilters, ObjectMissingParameters, ObjectNotFound } from '../config/errors.js';
import * as recent_book_repository from './recent_book.repository.js';
import * as book_repository from '../book/book.repository.js';
import { generate_filter } from '../config/util.js';
/**
 * Creates a new recent book with the specified user and books.
 * @param {string} user - The owner of the recent book list.
 * @param {Array<string>} books - The books to be added to the list.
 * @returns {Object} - The newly created recent book object.
 * @throws {ObjectAlreadyExists} - Throws if the recent book already exists.
 */
export const create_new_recent_book = async (user, books) => {
    const recent_book_exists = await recent_book_repository.filter_recent_books({['user']: new RegExp(user, 'i')}, 0, 10);
    if(recent_book_exists.length != 0) {
        throw new ObjectAlreadyExists("recent_book");
    }
    const new_recent_book = await recent_book_repository.create_recent_book({user, books});
    return new_recent_book;
}
/**
 * Retrieves all recent books with pagination.
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The number of recent books per page.
 * @returns {Array<Object>} - A list of recent books.
 * @throws {ObjectInvalidQueryFilters} - Throws if pagination parameters are invalid.
 */
export const get_all_recent_books = async (page, limit) => {
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("recent_book");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const recent_books = await recent_book_repository.find_all_recent_books(skip, limit);
    const total_recent_books = await recent_book_repository.count_recent_books();
    const total_pages = Math.ceil(total_recent_books / limit);
    return {
        data: recent_books,
        pagination: {
            totalItems: total_recent_books,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Filters recent books based on a specific field and value with pagination.
 * @param {string} filter_field - The field to filter recent books by (e.g., 'user', 'books').
 * @param {string} filter_value - The value to search for in the specified field.
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The number of recent books per page.
 * @returns {Array<Object>} - A list of filtered recent books.
 * @throws {ObjectInvalidQueryFilters} - Throws if the filter field is invalid or pagination parameters are invalid.
 */
export const filter_recent_books = async (filter_field, filter_value, page, limit) => {
    const field_types = {
        user: 'String',
        books: 'String'
    };
    const allowed_fields = Object.keys(field_types);
    if(!allowed_fields.includes(filter_field)) {
        throw new ObjectInvalidQueryFilters("recent_book");
    }
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("recent_book");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = generate_filter(field_types, filter_field, filter_value);
    const skip = (page - 1) * limit;
    const recent_books = await recent_book_repository.filter_recent_books(filter, skip, limit);
    const total_recent_books = recent_books.length;
    const total_pages = Math.ceil(total_recent_books / limit);
    return {
        data: recent_books,
        pagination: {
            totalItems: total_recent_books,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Retrieves a recent book by its ID.
 * @param {string} id - The ID of the recent book to retrieve.
 * @returns {Object} - The recent book object if found.
 * @throws {ObjectNotFound} - Throws if the recent book with the specified ID is not found.
 */
export const get_recent_book_by_id = async (id) => {
    const recent_book_exists = await recent_book_repository.find_recent_book_by_id(id);
    if(!recent_book_exists) {
        throw new ObjectNotFound("recent_book");
    }
    return recent_book_exists;
}
/**
 * Updates a recent book's information by ID.
 * @param {string} id - The ID of the recent book to update.
 * @param {Object} updates - The fields to update.
 * @returns {Object} - The updated recent book object.
 * @throws {ObjectNotFound} - Throws if the recent book is not found.
 * @throws {ObjectAlreadyExists} - Throws if the recent book with the updated user already exists.
 * @throws {ObjectMissingParameters} - Throws if required parameters are missing.
 */
export const update_recent_book = async (id, updates) => { 
    if(!id) {
        throw new ObjectMissingParameters("recent_book");
    }
    const recent_book_exists_id = await recent_book_repository.find_recent_book_by_id(id);
    const recent_book_exists_user = await recent_book_repository.filter_recent_books({['user']: new RegExp(updates.user, 'i')}, 0, 10);
    if(!recent_book_exists_id){
        throw new ObjectNotFound("recent_book");
    }
    if( (recent_book_exists_user.length != 0) && (recent_book_exists_user[0]._id.toString() != id) ) {
        throw new ObjectAlreadyExists("recent_book");
    }
    return await recent_book_repository.update_recent_book(id, updates);
}
/**
 * Adds a book to a recent book.
 * @param {string} id - The ID of the recent book.
 * @param {string} book_id - The book ID to add to the recent_book.
 * @throws {ObjectMissingParameters} - Throws if the ID or book is missing.
 * @throws {ObjectNotFound} - Throws if the recent book is not found.
 */
export const add_book_to_list = async (id, book_id) => {
    if(!id) {
        throw new ObjectMissingParameters("recent_book");
    }
    if(!book_id) {
        throw new ObjectMissingParameters("book")
    }
    const recent_book = await recent_book_repository.find_recent_book_by_id(id);
    const book = await book_repository.find_book_by_id(book_id);
    if(!recent_book) {
        throw new ObjectNotFound("recent_book");
    }
    if(!book) {
        throw new ObjectNotFound("book");
    }

    const current_list = recent_book.books || [];
    const is_book_in_list = current_list.includes(book_id);
    const updated_list = [...current_list];
    if (is_book_in_list) {
        const index = updated_list.indexOf(book_id);
        updated_list.splice(index, 1);
    }
    updated_list.unshift(book_id);

    const max_length = app_config.USER_MAX_RECENT_BOOKS_LOG || 10;
    if (updated_list.length > max_length) {
        updated_list.pop();
    }
    await recent_book_repository.updated_book_list(id, updated_list);
}
/**
 * Removes a book from a recent_book.
 * @param {string} id - The ID of the recent_book.
 * @param {string} book_code - The book code to remove from the recent_book.
 * @throws {ObjectMissingParameters} - Throws if the ID or book is missing.
 * @throws {ObjectNotFound} - Throws if the recent_book is not found.
 */
export const remove_book_from_list = async (id, book_code) => {
    if(!id) {
        throw new ObjectMissingParameters("recent_book");
    }
    const recent_book_exists_id = await recent_book_repository.find_recent_book_by_id(id);
    if(!recent_book_exists_id) {
        throw new ObjectNotFound("recent_book");
    }
    return await recent_book_repository.remove_book_from_list(id, book_code);
}
/**
 * Deletes a recent book by its ID.
 * @param {string} id - The ID of the recent book to delete.
 * @throws {ObjectMissingParameters} - Throws if the ID is missing.
 * @throws {ObjectNotFound} - Throws if the recent book is not found.
 */
export const delete_recent_book = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("recent_book");
    }
    
    const recent_book_exists = await recent_book_repository.find_recent_book_by_id(id);

    if(!recent_book_exists){
        throw new ObjectNotFound("recent_book");
    }
    return await recent_book_repository.delete_recent_book(id);
}