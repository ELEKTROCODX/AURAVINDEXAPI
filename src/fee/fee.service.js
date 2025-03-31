
import {ObjectAlreadyExists, ObjectInvalidQueryFilters, ObjectMissingParameters, ObjectNotFound } from '../config/errors.js';
import * as fee_repository from './fee.repository.js';
import * as fee_status_repository from '../fee_status/fee_status.repository.js';
import * as fee_type_repository from '../fee_type/fee_type.repository.js';
import * as loan_repository from '../loan/loan.repository.js';
import { generate_filter } from '../config/util.js';
/**
 * Creates a new fee entry in the database.
 * 
 * @param {string} fee_type - The ID of the fee type.
 * @param {string} fee_status - The ID of the fee status.
 * @param {string} loan - The ID of the loan associated with the fee.
 * @param {Date} paid_date - The date the fee was paid.
 * @param {Date} due_payment_date - The date the payment is due.
 * @returns {Promise<Object>} - The newly created fee object.
 * @throws {ObjectNotFound} - If any of the fee type, fee status, or loan do not exist.
 */
export const create_new_fee = async (fee_type, fee_status, loan, paid_date, due_payment_date) => {
    const fee_type_exists = fee_type_repository.find_fee_type_by_id(fee_type);
    const fee_status_exists = fee_status_repository.find_fee_status_by_id(fee_status);
    const loan_exists = loan_repository.find_loan_by_id(loan);

    if(!fee_type_exists) {
        throw new ObjectNotFound("editorial");
    }
    if(!fee_status_exists) {
        throw new ObjectNotFound("fee_status");
    }
    if(!loan_exists) {
        throw new ObjectNotFound("fee_collection");
    }

    const new_fee = await fee_repository.create_fee({fee_type, fee_status, loan, paid_date, due_payment_date});
    return new_fee;
}
/**
 * Retrieves all fees with pagination.
 * 
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The number of records per page.
 * @returns {Promise<Array>} - List of fee objects for the requested page.
 * @throws {ObjectInvalidQueryFilters} - If the page or limit is invalid.
 */
export const get_all_fees = async (page, limit) => {
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("fee");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const fees = await fee_repository.find_all_fees(skip, limit);
    const total_fees = await fee_repository.count_fees();
    const total_pages = Math.ceil(total_fees / limit);
    return {
        data: fees,
        pagination: {
            totalItems: total_fees,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Filters fees based on a specific field and value, with pagination.
 * 
 * @param {string} filter_field - The field to filter by (e.g., fee_type, fee_status).
 * @param {string} filter_value - The value to filter by.
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The number of records per page.
 * @returns {Promise<Array>} - List of filtered fee objects.
 * @throws {ObjectInvalidQueryFilters} - If the filter field is invalid or pagination parameters are incorrect.
 */
export const filter_fees = async (filter_field, filter_value, page, limit) => {
    const field_types = {
        fee_type: 'ObjectId',
        fee_status: 'ObjectId',
        loan: 'ObjectId',
        paid_date: 'Date',
        due_payment_date: 'Date'
    };
    const allowed_fields = Object.keys(field_types);
    if(!allowed_fields.includes(filter_field)) {
        throw new ObjectInvalidQueryFilters("fee");
    }
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("fee");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = generate_filter(field_types, filter_field, filter_value);
    const skip = (page - 1) * limit;
    const fees = await fee_repository.filter_fees(filter, skip, limit);
    const total_fees = await fee_repository.count_fees();
    const total_pages = Math.ceil(total_fees / limit);
    return {
        data: fees,
        pagination: {
            totalItems: total_fees,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Retrieves a fee by its ID.
 * 
 * @param {string} id - The ID of the fee to retrieve.
 * @returns {Promise<Object>} - The fee object if found.
 * @throws {ObjectNotFound} - If the fee with the given ID does not exist.
 */
export const get_fee_by_id = async (id) => {
    const fee_exists = await fee_repository.find_fee_by_id(id);
    if(!fee_exists) {
        throw new ObjectNotFound("fee");
    }
    return fee_exists;
}
/**
 * Updates an existing fee by its ID.
 * 
 * @param {string} id - The ID of the fee to update.
 * @param {Object} updates - The updates to apply to the fee.
 * @returns {Promise<Object>} - The updated fee object.
 * @throws {ObjectNotFound} - If the fee, fee type, fee status, or loan does not exist.
 * @throws {ObjectMissingParameters} - If the fee ID is not provided.
 */
export const update_fee = async (id, updates) => { 
    if(!id) {
        throw new ObjectMissingParameters("fee");
    }
    const fee_exists_id = await fee_repository.find_fee_by_id(id);
    const fee_type_exists = fee_type_repository.find_fee_type_by_id(updates.fee_type);
    const fee_status_exists = fee_status_repository.find_fee_status_by_id(updates.fee_status);
    const loan_exists = loan_repository.find_loan_by_id(updates.loan);
    if(!fee_exists_id){
        throw new ObjectNotFound("fee");
    }
    if(!fee_type_exists) {
        throw new ObjectNotFound("fee_type");
    }
    if(!fee_status_exists) {
        throw new ObjectNotFound("fee_status");
    }
    if(!loan_exists) {
        throw new ObjectNotFound("loan");
    }
    
    return await fee_repository.update_fee(id, updates);
}
/**
 * Deletes a fee by its ID.
 * 
 * @param {string} id - The ID of the fee to delete.
 * @returns {Promise<void>} - Resolves when the fee is deleted.
 * @throws {ObjectNotFound} - If the fee with the given ID does not exist.
 * @throws {ObjectMissingParameters} - If the fee ID is not provided.
 */
export const delete_fee = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("fee");
    }
    
    const fee_exists = await fee_repository.find_fee_by_id(id);

    if(!fee_exists){
        throw new ObjectNotFound("fee");
    }
    return await fee_repository.delete_fee(id);
}