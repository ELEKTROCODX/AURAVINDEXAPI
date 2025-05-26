import {ObjectAlreadyExists, ObjectInvalidQueryFilters, ObjectMissingParameters, ObjectNotFound, ActivePlanAlreadyFinished} from '../config/errors.js';
import * as active_plan_repository from './active_plan.repository.js';
import * as plan_repository from '../plan/plan.repository.js'
import * as user_repository from '../user/user.repository.js';
import * as plan_status_repository from '../plan_status/plan_status.repository.js';
import { generate_filter } from '../config/util.js';
import { app_config } from '../config/app.config.js';
/**
 * Creates a new active plan in the system.
 * @param {string} plan - The plan ID.
 * @param {string} user - The user ID.
 * @param {string} ending_date - The date the plan ends.
 * @param {string} finished_date - The date the plan ended.
 * @param {string} plan_status - The current status of the plan.
 * @returns {Promise<Object>} The newly created active plan object.
 * @throws {ObjectAlreadyExists} If the active plan already exists.
 */
export const create_new_active_plan = async (user, plan, plan_status, ending_date, finished_date) => {
    const plan_exists = await plan_repository.find_plan_by_id(plan);
    const user_exists = await user_repository.find_user_by_id(user);
    let plan_status_exists = null;
    if(plan_status) {
        plan_status_exists = await plan_status_repository.find_plan_status_by_id(plan_status);
    } else {
        let plan_status_active = await plan_status_repository.filter_plan_statuses({['plan_status']: new RegExp("ACTIVE", 'i')}, 0, 10);
        if(plan_status_active.length == 0) {
            throw new ObjectNotFound("plan_status");
        }
        plan_status_exists = plan_status_active[0];
        plan_status = plan_status_exists._id;
    }

    if(!ending_date) {
        const date = new Date();
        date.setDate(date.getDate() + app_config.ACTIVE_PLAN_MAX_SUSCRIPTION_DAYS);
        ending_date = date;
    }
    const active_plan_exists = await active_plan_repository.find_active_plan_by_date(user, Date.now(), ending_date);
    
    if(!plan_exists) {
        throw new ObjectNotFound("plan");
    }
    if(!user_exists) {
        throw new ObjectNotFound("user");
    }
    if(!plan_status_exists) {
        throw new ObjectNotFound("plan_status");
    }
    if(active_plan_exists) {
        throw new ObjectAlreadyExists("active_plan");
    }
    
    const new_active_plan = await active_plan_repository.create_active_plan({user, plan, plan_status, ending_date, finished_date});
    return new_active_plan;
}
/**
 * Retrieves all plans with pagination.
 *
 * @param {number} page - The page number to retrieve.
 * @param {number} limit - The number of plans per page.
 * @returns {Promise<Array>} An array of active_plan_objects.
 * @throws {ObjectInvalidQueryFilters} If page or limit are invalid values.
 */
export const get_all_active_plans = async (page, limit) => {
    if(isNaN(page) || (isNaN(limit) && (limit != "none")) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("plan");
    }

    const active_plans = await active_plan_repository.find_all_active_plans(null);
    const total_active_plans = active_plans.length;
    if(limit == "none") limit = total_active_plans;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const total_pages = Math.ceil(total_active_plans / limit);
    const paginated_active_plans = active_plans.slice(skip, skip + limit);
    return {
        data: paginated_active_plans,
        pagination: {
            totalItems: total_active_plans,
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
 * @returns {Promise<Array>} An array of filtered active plan objects.
 * @throws {ObjectInvalidQueryFilters} If the filter field, page, or limit are invalid.
 */
export const filter_active_plans = async (filter_field, filter_value, page, limit) => {
    const field_types = {
        user: 'ObjectId',
        plan: 'ObjectId',
        plan_status: 'ObjectId',
        ending_date: 'Date',
        finished_date: 'Date'
    };
    const allowed_fields = Object.keys(field_types);
    if(!allowed_fields.includes(filter_field)) {
        throw new ObjectInvalidQueryFilters("plan");
    }
    if(isNaN(page) || (isNaN(limit) && (limit != "none")) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("plan");
    }
    const filter = generate_filter(field_types, filter_field, filter_value);
    const active_plans = await active_plan_repository.filter_active_plans(filter, null, null);
    const total_active_plans = active_plans.length;
    if(limit == "none") limit = total_active_plans;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const total_pages = Math.ceil(total_active_plans / limit);
    const paginated_active_plans = active_plans.slice(skip, skip + limit);
    return {
        data: paginated_active_plans,
        pagination: {
            totalItems: total_active_plans,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Retrieves a specific active plan by its ID.
 *
 * @param {string} id - The ID of the active plan to retrieve.
 * @returns {Promise<Object>} The active plan object.
 * @throws {ObjectNotFound} If no active plan is found with the given ID.
 */
export const get_active_plan_by_id = async (id) => {
    const active_plan_exists = await active_plan_repository.find_active_plan_by_id(id);
    if(!plan_exists) {
        throw new ObjectNotFound("plan");
    }
    return active_plan_exists;
}
/**
 * Updates an existing active plan by its ID.
 *
 * @param {string} id - The ID of the active plan to update.
 * @param {Object} updates - The properties to update in the plan.
 * @returns {Promise<Object>} The updated active plan object.
 * @throws {ObjectMissingParameters} If the ID is not provided.
 * @throws {ObjectAlreadyExists} if an active plan with that name already exists.
 * @throws {ObjectNotFound} If one of the objects does not exist.
 */
export const update_active_plan = async (id, updates) => { 
    if(!id) {
        throw new ObjectMissingParameters("plan");
    }
    const plan_exists = await plan_repository.find_plan_by_id(plan);
    const user_exists = await user_repository.find_user_by_id(user);
    const plan_status_exists = await plan_status_repository.find_plan_status_by_id(plan_status);

    const active_plan_exists = await active_plan_repository.find_active_plan_by_date(user, Date.now(), ending_date);
    
    if(!plan_exists) {
        throw new ObjectNotFound("plan");
    }
    if(!user_exists) {
        throw new ObjectNotFound("user");
    }
    if(!plan_status_exists) {
        throw new ObjectNotFound("plan_status");
    }
    if(active_plan_exists) {
        throw new ObjectAlreadyExists("active_plan");
    }
    const active_plan_exists_id = await active_plan_repository.find_active_plan_by_id(id);
    if(!active_plan_exists_id){
        throw new ObjectNotFound("active_plan");
    }
    return await active_plan_repository.update_active_plan(id, updates);
}
/**
 * Deletes an active plan by its ID.
 *
 * @param {string} id - The ID of the active plan to delete.
 * @returns {Promise<Object>} The result of the deletion operation.
 * @throws {ObjectMissingParameters} If the ID is not provided.
 * @throws {ObjectNotFound} If no active plan is found with the given ID.
 */
export const delete_active_plan = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("plan");
    }
    const active_plan_exists = await active_plan_repository.find_active_plan_by_id(id);
    if(!active_plan_exists){
        throw new ObjectNotFound("plan");
    }
    return await active_plan_repository.delete_active_plan(id);
}

/**
 * Requests a renewal for an existing active plan.
 * 
 * @param {string} id - The ID of the active plan to renew.
 * @returns {Promise<Object>} The updated active plan with the new return date.
 * @throws {LoanExceededMaxRenewals} If the active plan exceeds the maximum number of allowed renewals.
 * @throws {LoanAlreadyFinished} If the active plan has already been finished.
 * @throws {ObjectNotFound} If the active plan with the specified ID does not exist.
 * @throws {ObjectMissingParameters} If the active plan ID is missing.
 * @throws {ObjectNotAvailable} If the plan is not available for renewal.
 */
export const request_active_plan_renewal = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("active_plan");
    }
    const active_plan_exists = await active_plan_repository.find_active_plan_by_id(id);
    if(!active_plan_exists) {
        throw new ObjectNotFound("active_plan");
    }
    if(active_plan_exists.finished_date || active_plan_exists.plan_status.plan_status == "FINISHED") {
        throw new ActivePlanAlreadyFinished();
    }
    const date = new Date(active_plan_exists.ending_date);
    date.setDate(date.getDate() + app_config.ACTIVE_PLAN_MAX_SUSCRIPTION_DAYS);
    return await active_plan_repository.update_active_plan(id, {
        "user": active_plan_exists.user,
        "plan": active_plan_exists.plan,
        "plan_status": active_plan_exists.plan_status,
        "ending_date": date,
    });
}
/**
 * Finish a suscription.
 *
 * @param {string} id - The ID of the active plan to finish.
 * @throws {ObjectMissingParameters} If the active plan ID is missing.
 * @throws {ObjectNotFound} If the active plan is not found.
 * @throws {ActivePlanAlreadyFinished} If the active plan has already been finished.
 * @returns {Object} The updated active plan object.
 */
export const finish_active_plan = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("active_plan");
    }
    const active_plan_exists = await active_plan_repository.find_active_plan_by_id(id);
    if(!active_plan_exists) {
        throw new ObjectNotFound("active_plan");
    }
    const finished_active_plan_status = await plan_status_repository.filter_plan_statuses({plan_status: 'FINISHED'}, 0, 1);
    if(active_plan_exists.finished_date || active_plan_exists.plan_status.plan_status == "FINISHED") {
        throw new ActivePlanAlreadyFinished();
    }
    active_plan_exists.finished_date = new Date();
    active_plan_exists.plan_status = finished_active_plan_status[0]._id;
    const updated_active_plan = await active_plan_repository.update_active_plan(id, active_plan_exists);
    return updated_active_plan;
}
/**
 * Cancel a suscription.
 *
 * @param {string} id - The ID of the active plan to cancel.
 * @throws {ObjectMissingParameters} If the active plan ID is missing.
 * @throws {ObjectNotFound} If the active plan is not found.
 * @throws {ActivePlanAlreadyCancelled} If the active plan has already been cancelled.
 * @returns {Object} The updated active plan object.
 */
export const cancel_active_plan = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("active_plan");
    }
    const active_plan_exists = await active_plan_repository.find_active_plan_by_id(id);
    if(!active_plan_exists) {
        throw new ObjectNotFound("active_plan");
    }
    const finished_active_plan_status = await plan_status_repository.filter_plan_statuses({plan_status: 'CANCELED'}, 0, 1);
    if(active_plan_exists.finished_date || active_plan_exists.plan_status.plan_status == "CANCELED") {
        throw new ActivePlanAlreadyCancelled();
    }
    active_plan_exists.finished_date = new Date();
    active_plan_exists.plan_status = finished_active_plan_status[0]._id;
    const updated_active_plan = await active_plan_repository.update_active_plan(id, active_plan_exists);
    return updated_active_plan;
}