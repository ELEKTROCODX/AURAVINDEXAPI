import {ObjectAlreadyExists, ObjectInvalidQueryFilters, ObjectMissingParameters, ObjectNotFound } from '../config/errors.js';
import * as loan_status_repository from './loan_status.repository.js';
import { generate_filter } from '../config/util.js';
/**
 * Creates a new loan status if it doesn't already exist.
 * 
 * @param {string} loan_status The status of the loan to create.
 * @returns {Promise<Object>} The newly created loan status.
 * @throws {ObjectAlreadyExists} If the loan status already exists.
 */
export const create_new_loan_status = async (loan_status) => {
    const loan_status_exists = await loan_status_repository.filter_loan_statuses({['loan_status']: new RegExp(loan_status, 'i')}, 0, 10);
    if(loan_status_exists.length != 0) {
        throw new ObjectAlreadyExists("loan_status");
    }
    const new_loan_status = await loan_status_repository.create_loan_status({loan_status});
    return new_loan_status;
}
/**
 * Retrieves all loan statuses with pagination.
 * 
 * @param {number} page The page number for pagination.
 * @param {number} limit The number of results per page.
 * @returns {Promise<Array>} A list of loan statuses.
 * @throws {ObjectInvalidQueryFilters} If the page or limit is invalid.
 */
export const get_all_loan_statuses = async (page, limit) => {
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("loan_status");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const loan_statuses = await loan_status_repository.find_all_loan_statuses(skip, limit);
    const total_loan_statuses = await loan_status_repository.count_loan_statuses();
    const total_pages = Math.ceil(total_loan_statuses / limit);
    return {
        data: loan_statuses,
        pagination: {
            totalItems: total_loan_statuses,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Filters loan statuses based on specified filter field and value with pagination.
 * 
 * @param {string} filter_field The field to filter by (e.g., "loan_status").
 * @param {string} filter_value The value to filter the field by.
 * @param {number} page The page number for pagination.
 * @param {number} limit The number of results per page.
 * @returns {Promise<Array>} A list of filtered loan statuses.
 * @throws {ObjectInvalidQueryFilters} If the filter field is not allowed or page/limit are invalid.
 */
export const filter_loan_statuses = async (filter_field, filter_value, page, limit) => {
    const field_types = {
        loan_status: 'String'
    };
    const allowed_fields = Object.keys(field_types);
    if(!allowed_fields.includes(filter_field)) {
        throw new ObjectInvalidQueryFilters("loan_status");
    }
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("loan_status");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = generate_filter(field_types, filter_field, filter_value);
    const skip = (page - 1) * limit;
    const loan_statuses = await loan_status_repository.filter_loan_statuses(filter, skip, limit);
    const total_loan_statuses = await loan_status_repository.count_loan_statuses();
    const total_pages = Math.ceil(total_loan_statuses / limit);
    return {
        data: loan_statuses,
        pagination: {
            totalItems: total_loan_statuses,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Retrieves a specific loan status by its ID.
 * 
 * @param {string} id The ID of the loan status to retrieve.
 * @returns {Promise<Object>} The loan status with the specified ID.
 * @throws {ObjectNotFound} If no loan status is found with the provided ID.
 */
export const get_loan_status_by_id = async (id) => {
    const loan_status_exists = await loan_status_repository.find_loan_status_by_id(id);
    if(!loan_status_exists) {
        throw new ObjectNotFound("loan_status");
    }
    return loan_status_exists;
}
/**
 * Updates an existing loan status by its ID.
 * 
 * @param {string} id The ID of the loan status to update.
 * @param {Object} updates The updates to apply to the loan status.
 * @returns {Promise<Object>} The updated loan status.
 * @throws {ObjectNotFound} If no loan status is found with the provided ID.
 * @throws {ObjectAlreadyExists} If the updated status already exists.
 * @throws {ObjectMissingParameters} If the ID or updates are missing.
 */
export const update_loan_status = async (id, updates) => { 
    if(!id) {
        throw new ObjectMissingParameters("loan_status");
    }
    const loan_status_exists_id = await loan_status_repository.find_loan_status_by_id(id);
    const loan_status_exists_status = await loan_status_repository.filter_loan_statuses({['loan_status']: new RegExp(updates.loan_status, 'i')}, 0, 10);
    if(!loan_status_exists_id){
        throw new ObjectNotFound("loan_status");
    }
    if( (loan_status_exists_status.length != 0) && (loan_status_exists_status[0]._id.toString() != id) ) {
        throw new ObjectAlreadyExists("loan_status");
    }
    return await loan_status_repository.update_loan_status(id, updates);
}
/**
 * Deletes a loan status by its ID.
 * 
 * @param {string} id The ID of the loan status to delete.
 * @returns {Promise<Object>} The result of the deletion.
 * @throws {ObjectNotFound} If no loan status is found with the provided ID.
 * @throws {ObjectMissingParameters} If the ID is missing.
 */
export const delete_loan_status = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("loan_status");
    }
    
    const loan_status_exists = await loan_status_repository.find_loan_status_by_id(id);

    if(!loan_status_exists){
        throw new ObjectNotFound("loan_status");
    }
    return await loan_status_repository.delete_loan_status(id);
}