import {ObjectAlreadyExists, ObjectInvalidQueryFilters, ObjectMissingParameters, ObjectNotFound } from '../config/errors.js';
import * as plan_repository from './plan.repository.js';
import * as user_repository from '../user/user.repository.js';
import { generate_filter } from '../config/util.js';
/**
 * Creates a new plan in the system.
 * @param {string} name - The plan name.
 * @param {string} fixed_price - The plan fixed price.
 * @param {string} monthly_price - The plan monthly price.
 * @param {string} max_simultaneous_loans - The maximum loans that users can have at the same time.
 * @param {string} max_return_days - The maximum days the user has to return the book.
 * @param {string} max_renovations_per_loan - The maximum renovations an user can request per loan.
 * @returns {Promise<Object>} The newly created plan object.
 * @throws {ObjectAlreadyExists} If the plan already exists.
 */
export const create_new_plan = async (name, fixed_price, monthly_price, max_simultaneous_loans, max_return_days, max_renovations_per_loan) => {
    const plan_exists = await plan_repository.filter_plans({['name']: new RegExp(name, 'i')}, 0, 10);
    if(plan_exists.length != 0) {
        throw new ObjectAlreadyExists("plan");
    }
    const new_plan = await plan_repository.create_plan({name, fixed_price, monthly_price, max_simultaneous_loans, max_return_days, max_renovations_per_loan});
    return new_plan;
}
/**
 * Retrieves all plans with pagination.
 *
 * @param {number} page - The page number to retrieve.
 * @param {number} limit - The number of plans per page.
 * @returns {Promise<Array>} An array of plan objects.
 * @throws {ObjectInvalidQueryFilters} If page or limit are invalid values.
 */
export const get_all_plans = async (page, limit) => {
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("plan");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const plans = await plan_repository.find_all_plans(skip, limit);
    const total_plans = await plan_repository.count_plans();
    const total_pages = Math.ceil(total_plans / limit);
    return {
        data: plans,
        pagination: {
            totalItems: total_plans,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Filters plans based on a field and value with pagination.
 *
 * @param {string} filter_field - The field to filter by ().
 * @param {string} filter_value - The value to match for the specified field.
 * @param {number} page - The page number to retrieve.
 * @param {number} limit - The number of plans per page.
 * @returns {Promise<Array>} An array of filtered plan objects.
 * @throws {ObjectInvalidQueryFilters} If the filter field, page, or limit are invalid.
 */
export const filter_plans = async (filter_field, filter_value, page, limit) => {
    const field_types = {
        name: 'String',
        fixed_price: 'String',
        monthly_price: 'String',
        max_simultaneous_loans: 'Number',
        max_return_days: 'Number',
        max_renovations_per_loan: 'Number'
    };
    const allowed_fields = Object.keys(field_types);
    if(!allowed_fields.includes(filter_field)) {
        throw new ObjectInvalidQueryFilters("plan");
    }
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("plan");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = generate_filter(field_types, filter_field, filter_value);
    const skip = (page - 1) * limit;
    const plans = await plan_repository.filter_plans(filter, skip, limit);
    const total_plans = plans.length;
    const total_pages = Math.ceil(total_plans / limit);
    return {
        data: plans,
        pagination: {
            totalItems: total_plans,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Retrieves a specific plan by its ID.
 *
 * @param {string} id - The ID of the plan to retrieve.
 * @returns {Promise<Object>} The plan object.
 * @throws {ObjectNotFound} If no plan is found with the given ID.
 */
export const get_plan_by_id = async (id) => {
    const plan_exists = await plan_repository.find_plan_by_id(id);
    if(!plan_exists) {
        throw new ObjectNotFound("plan");
    }
    return plan_exists;
}
/**
 * Updates an existing plan by its ID.
 *
 * @param {string} id - The ID of the plan to update.
 * @param {Object} updates - The properties to update in the plan.
 * @returns {Promise<Object>} The updated plan object.
 * @throws {ObjectMissingParameters} If the ID is not provided.
 * @throws {ObjectAlreadyExists} if a plan with that name already exists.
 * @throws {ObjectNotFound} If the sender, receiver, or plan does not exist.
 */
export const update_plan = async (id, updates) => { 
    if(!id) {
        throw new ObjectMissingParameters("plan");
    }
    const plan_exists = await plan_repository.filter_plans({['name']: new RegExp(name, 'i')}, 0, 10);
    if(plan_exists.length != 0) {
        throw new ObjectAlreadyExists("plan");
    }
    const plan_exists_id = await plan_repository.find_plan_by_id(id);
    if(!plan_exists_id){
        throw new ObjectNotFound("plan");
    }
    return await plan_repository.update_plan(id, updates);
}
/**
 * Deletes a plan by its ID.
 *
 * @param {string} id - The ID of the plan to delete.
 * @returns {Promise<Object>} The result of the deletion operation.
 * @throws {ObjectMissingParameters} If the ID is not provided.
 * @throws {ObjectNotFound} If no plan is found with the given ID.
 */
export const delete_plan = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("plan");
    }
    
    const plan_exists = await plan_repository.find_plan_by_id(id);

    if(!plan_exists){
        throw new ObjectNotFound("plan");
    }
    return await plan_repository.delete_plan(id);
}