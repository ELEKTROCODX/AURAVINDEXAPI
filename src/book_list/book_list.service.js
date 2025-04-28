import {BookAlreadyInBookList, ExceededMaxBookLists, ExceededMaxBooksPerList, ObjectAlreadyExists, ObjectMissingParameters, ObjectNotFound } from '../config/errors.js';
import * as book_list_repository from './book_list.repository.js';
import * as book_repository from '../book/book.repository.js';
import * as user_repository from '../user/user.repository.js';
import { generate_filter } from '../config/util.js';
import { book_list } from './book_list.model.js';
import { app_config } from '../config/app.config.js';
/**
 * Creates a new book list.
 * 
 * @param {string} title - The title of the book list.
 * @param {string} description - A description for the book list.
 * @param {string} owner - The ID of the user who owns the book list.
 * @param {Array} books - The list of books in the list
 * @throws {ObjectNotFound} If the owner does not exist.
 * @throws {ObjectAlreadyExists} If a book list with the same title already exists for the owner.
 * @throws {ExceededMaxBooksPerList} If the number of books exceeds the maximum allowed.
 * @throws {ExceededMaxBookLists} If the user exceeds the maximum number of book lists allowed.
 * @returns {Promise<Object>} The created book list object.
 */
export const create_new_book_list = async (title, description, owner, books) => {
    const book_list_exists = await book_list_repository.filter_book_lists({['title']: new RegExp(title, 'i'), owner}, 0, 10);
    const book_lists_from_user = await book_list_repository.filter_book_lists({['owner']: owner}, 0, app_config.USER_MAX_BOOK_LISTS);
    const owner_exists = await user_repository.find_user_by_id(owner);
    for(let i = 0; i < books.length; i++) {
        let book_exists = await book_repository.find_book_by_id(books[i]);
        if(!book_exists) {
            books.splice(i, 1);
        }
    }
    if(!owner_exists) {
        throw new ObjectNotFound("owner");
    }
    if(book_list_exists.length != 0) {
        throw new ObjectAlreadyExists("book_list");
    }
    if(books.length > app_config.BOOK_LIST_MAX_BOOKS) {
        throw new ExceededMaxBooksPerList();
    }
    if(book_lists_from_user.length > app_config.USER_MAX_BOOK_LISTS) {
        throw new ExceededMaxBookLists();
    }
    const new_book_list = await book_list_repository.create_book_list({title, description, owner, books});
    return new_book_list;
}
/**
 * Retrieves all book lists with pagination.
 * 
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The number of book lists to fetch per page.
 * @throws {ObjectInvalidQueryFilters} If the page or limit is invalid.
 * @returns {Promise<Array>} A list of book lists.
 */
export const get_all_book_lists = async (page, limit) => {
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("book_list");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const book_lists = await book_list_repository.find_all_book_lists(skip, limit);
    const total_book_lists = await book_list_repository.count_book_lists();
    const total_pages = Math.ceil(total_book_lists / limit);
    return {
        data: book_lists,
        pagination: {
            totalItems: total_book_lists,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Filters book lists based on a given field and value with pagination.
 * 
 * @param {string} filter_field - The field to filter by (title, description, owner).
 * @param {string} filter_value - The value to filter by.
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The number of book lists to fetch per page.
 * @throws {ObjectInvalidQueryFilters} If the field is invalid or pagination parameters are incorrect.
 * @returns {Promise<Array>} A list of filtered book lists.
 */
export const filter_book_lists = async (filter_field, filter_value, page, limit) => {
    const field_types = {
        title: 'String',
        description: 'String',
        owner: 'ObjectId'
    };
    const allowed_fields = Object.keys(field_types);
    if(!allowed_fields.includes(filter_field)) {
        throw new ObjectInvalidQueryFilters("book_list");
    }
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("book_list");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = generate_filter(field_types, filter_field, filter_value);
    const skip = (page - 1) * limit;
    const book_lists = await book_list_repository.filter_book_lists(filter, skip, limit);
    const total_book_lists = book_lists.length;
    const total_pages = Math.ceil(total_book_lists / limit);
    return {
        data: book_lists,
        pagination: {
            totalItems: total_book_lists,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Retrieves a book list by its ID.
 * 
 * @param {string} id - The ID of the book list to fetch.
 * @throws {ObjectNotFound} If the book list with the given ID does not exist.
 * @returns {Promise<Object>} The book list object.
 */
export const get_book_list_by_id = async (id) => {
    const book_list_exists = await book_list_repository.find_book_list_by_id(id);
    if(!book_list_exists) {
        throw new ObjectNotFound("book_list");
    }
    return book_list_exists;
}
/**
 * Updates a book list by its ID.
 * 
 * @param {string} id - The ID of the book list to update.
 * @param {Object} updates - The updates to apply to the book list.
 * @throws {ObjectMissingParameters} If the ID is missing.
 * @throws {ObjectNotFound} If the book list with the given ID does not exist.
 * @throws {ObjectAlreadyExists} If a book list with the same title already exists.
 * @returns {Promise<Object>} The updated book list object.
 */
export const update_book_list = async (id, updates) => { 
    if(!id) {
        throw new ObjectMissingParameters("book_list");
    }
    const book_list_exists_id = await book_list_repository.find_book_list_by_id(id);
    const book_list_exists_title = await book_list_repository.filter_book_lists({['title']: new RegExp(updates.title, 'i'), owner}, 0, 10);
    if(!book_list_exists_id){
        throw new ObjectNotFound("book_list");
    }
    if( (book_list_exists_title.length != 0) && (book_list_exists_title[0]._id.toString() != id) ) {
        throw new ObjectAlreadyExists("book_list");
    }
    return await book_list_repository.update_book_list(id, updates);
}
/**
 * Adds a book to the specified book list.
 * 
 * @param {string} id - The ID of the book list.
 * @param {string} book_id - The ID of the book to add.
 * @throws {ObjectMissingParameters} If the ID or book ID is missing.
 * @throws {ObjectNotFound} If the book list or book does not exist.
 * @throws {BookAlreadyInBookList} If the book is already in the book list.
 * @throws {ExceededMaxBooksPerList} If the book list exceeds the maximum number of books allowed.
 * @returns {void}
 */
export const add_book_to_book_list = async (id, book_id) => {
    if(!id) {
        throw new ObjectMissingParameters("book_list");
    }
    const book_list_exists_id = await book_list_repository.find_book_list_by_id(id);
    const book_list_exists_book = await book_repository.find_book_by_id(book_id);
    if(!book_list_exists_id) {
        throw new ObjectNotFound("book_list");
    }
    if(!book_list_exists_book) {
        throw new ObjectNotFound("book");
    }
    if(book_list_exists_id.books.includes(book_id)) {
        throw new BookAlreadyInBookList();
    }
    if(book_list_exists_book.books.length > app_config.BOOK_LIST_MAX_BOOKS) {
        throw new ExceededMaxBooksPerList();
    }
    await book_list_repository.add_book_to_book_list(id, book_id);
}
/**
 * Removes a book from the specified book list.
 * 
 * @param {string} id - The ID of the book list.
 * @param {string} book_id - The ID of the book to remove.
 * @throws {ObjectMissingParameters} If the ID or book ID is missing.
 * @throws {ObjectNotFound} If the book list or book does not exist.
 * @returns {void}
 */
export const remove_book_from_book_list = async (id, book_id) => {
    if(!id) {
        throw new ObjectMissingParameters("book_list");
    }
    const book_list_exists_id = await book_list_repository.find_book_list_by_id(id);
    const book_list_exists_book = await book_repository.find_book_by_id(book_id);
    if(!book_list_exists_id) {
        throw new ObjectNotFound("book_list");
    }
    if(!book_list_exists_book) {
        throw new ObjectNotFound("book");
    }
    return await book_list_repository.remove_book_from_book_list(id, book_id);
}
/**
 * Deletes a book list by its ID.
 * 
 * @param {string} id - The ID of the book list to delete.
 * @throws {ObjectMissingParameters} If the ID is missing.
 * @throws {ObjectNotFound} If the book list with the given ID does not exist.
 * @returns {void}
 */
export const delete_book_list = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("book_list");
    }
    
    const book_list_exists = await book_list_repository.find_book_list_by_id(id);

    if(!book_list_exists){
        throw new ObjectNotFound("book_list");
    }
    return await book_list_repository.delete_book_list(id);
}