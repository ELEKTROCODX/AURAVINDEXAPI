import {ObjectAlreadyExists, ObjectInvalidQueryFilters, ObjectMissingParameters, ObjectNotFound } from '../config/errors.js';
import * as plan_status_repository from './plan_status.repository.js';
import { generate_filter } from '../config/util.js';
/**
 * Creates a new plan status if it doesn't already exist.
 * 
 * @param {string} plan_status The status of the plan to create.
 * @returns {Promise<Object>} The newly created plan status.
 * @throws {ObjectAlreadyExists} If the plan status already exists.
 */
export const create_new_plan_status = async (plan_status) => {
    const plan_status_exists = await plan_status_repository.filter_plan_statuses({['plan_status']: new RegExp(plan_status, 'i')}, 0, 10);
    if(plan_status_exists.length != 0) {
        throw new ObjectAlreadyExists("plan_status");
    }
    const new_plan_status = await plan_status_repository.create_plan_status({plan_status});
    return new_plan_status;
}
/**
 * Retrieves all plan statuses with pagination.
 * 
 * @param {number} page The page number for pagination.
 * @param {number} limit The number of results per page.
 * @returns {Promise<Array>} A list of plan statuses.
 * @throws {ObjectInvalidQueryFilters} If the page or limit is invalid.
 */
export const get_all_plan_statuses = async (page, limit) => {
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("plan_status");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const plan_statuses = await plan_status_repository.find_all_plan_statuses(skip, limit);
    const total_plan_statuses = await plan_status_repository.count_plan_statuses();
    const total_pages = Math.ceil(total_plan_statuses / limit);
    return {
        data: plan_statuses,
        pagination: {
            totalItems: total_plan_statuses,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Filters plan statuses based on specified filter field and value with pagination.
 * 
 * @param {string} filter_field The field to filter by (e.g., "plan_status").
 * @param {string} filter_value The value to filter the field by.
 * @param {number} page The page number for pagination.
 * @param {number} limit The number of results per page.
 * @returns {Promise<Array>} A list of filtered plan statuses.
 * @throws {ObjectInvalidQueryFilters} If the filter field is not allowed or page/limit are invalid.
 */
export const filter_plan_statuses = async (filter_field, filter_value, page, limit) => {
    const field_types = {
        plan_status: 'String'
    };
    const allowed_fields = Object.keys(field_types);
    if(!allowed_fields.includes(filter_field)) {
        throw new ObjectInvalidQueryFilters("plan_status");
    }
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("plan_status");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = generate_filter(field_types, filter_field, filter_value);
    const skip = (page - 1) * limit;
    const plan_statuses = await plan_status_repository.filter_plan_statuses(filter, skip, limit);
    const total_plan_statuses = await plan_status_repository.count_plan_statuses();
    const total_pages = Math.ceil(total_plan_statuses / limit);
    return {
        data: plan_statuses,
        pagination: {
            totalItems: total_plan_statuses,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Retrieves a specific plan status by its ID.
 * 
 * @param {string} id The ID of the plan status to retrieve.
 * @returns {Promise<Object>} The plan status with the specified ID.
 * @throws {ObjectNotFound} If no plan status is found with the provided ID.
 */
export const get_plan_status_by_id = async (id) => {
    const plan_status_exists = await plan_status_repository.find_plan_status_by_id(id);
    if(!plan_status_exists) {
        throw new ObjectNotFound("plan_status");
    }
    return plan_status_exists;
}
/**
 * Updates an existing plan status by its ID.
 * 
 * @param {string} id The ID of the plan status to update.
 * @param {Object} updates The updates to apply to the plan status.
 * @returns {Promise<Object>} The updated plan status.
 * @throws {ObjectNotFound} If no plan status is found with the provided ID.
 * @throws {ObjectAlreadyExists} If the updated status already exists.
 * @throws {ObjectMissingParameters} If the ID or updates are missing.
 */
export const update_plan_status = async (id, updates) => { 
    if(!id) {
        throw new ObjectMissingParameters("plan_status");
    }
    const plan_status_exists_id = await plan_status_repository.find_plan_status_by_id(id);
    const plan_status_exists_status = await plan_status_repository.filter_plan_statuses({['plan_status']: new RegExp(updates.plan_status, 'i')}, 0, 10);
    if(!plan_status_exists_id){
        throw new ObjectNotFound("plan_status");
    }
    if( (plan_status_exists_status.length != 0) && (plan_status_exists_status[0]._id.toString() != id) ) {
        throw new ObjectAlreadyExists("plan_status");
    }
    return await plan_status_repository.update_plan_status(id, updates);
}
/**
 * Deletes a plan status by its ID.
 * 
 * @param {string} id The ID of the plan status to delete.
 * @returns {Promise<Object>} The result of the deletion.
 * @throws {ObjectNotFound} If no plan status is found with the provided ID.
 * @throws {ObjectMissingParameters} If the ID is missing.
 */
export const delete_plan_status = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("plan_status");
    }
    
    const plan_status_exists = await plan_status_repository.find_plan_status_by_id(id);

    if(!plan_status_exists){
        throw new ObjectNotFound("plan_status");
    }
    return await plan_status_repository.delete_plan_status(id);
}