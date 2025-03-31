import {ObjectAlreadyExists, ObjectInvalidQueryFilters, ObjectMissingParameters, ObjectNotFound } from '../config/errors.js';
import * as alert_repository from './alert.repository.js';
import * as user_repository from '../user/user.repository.js';
import { generate_filter } from '../config/util.js';
/**
 * Creates a new alert in the system.
 *
 * @param {string} alert_type - The type of the alert to be created.
 * @param {string} sender - The ID of the user sending the alert.
 * @param {string} receiver - The ID of the user receiving the alert.
 * @returns {Promise<Object>} The newly created alert object.
 * @throws {ObjectNotFound} If the sender or receiver does not exist.
 */
export const create_new_alert = async (alert_type, sender, receiver) => {
    const sender_exists = user_repository.find_user_by_id(sender);
    const receiver_exists = user_repository.find_user_by_id(receiver);
    if(!sender_exists) {
        throw new ObjectNotFound("sender");
    }
    if (!receiver_exists) {
        throw new ObjectNotFound("receiver");
    }
    const new_alert = await alert_repository.create_alert({alert_type, sender, receiver});
    return new_alert;
}
/**
 * Retrieves all alerts with pagination.
 *
 * @param {number} page - The page number to retrieve.
 * @param {number} limit - The number of alerts per page.
 * @returns {Promise<Array>} An array of alert objects.
 * @throws {ObjectInvalidQueryFilters} If page or limit are invalid values.
 */
export const get_all_alerts = async (page, limit) => {
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("alert");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const alerts = await alert_repository.find_all_alerts(skip, limit);
    const total_alerts = await alert_repository.count_alerts();
    const total_pages = Math.ceil(total_alerts / limit);
    return {
        data: alerts,
        pagination: {
            totalItems: total_alerts,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Filters alerts based on a field and value with pagination.
 *
 * @param {string} filter_field - The field to filter by (e.g., alert_type, sender, receiver).
 * @param {string} filter_value - The value to match for the specified field.
 * @param {number} page - The page number to retrieve.
 * @param {number} limit - The number of alerts per page.
 * @returns {Promise<Array>} An array of filtered alert objects.
 * @throws {ObjectInvalidQueryFilters} If the filter field, page, or limit are invalid.
 */
export const filter_alerts = async (filter_field, filter_value, page, limit) => {
    const field_types = {
        alert_type: 'ObjectId',
        sender: 'ObjectId',
        receiver: 'ObjectId'
    };
    const allowed_fields = Object.keys(field_types);
    if(!allowed_fields.includes(filter_field)) {
        throw new ObjectInvalidQueryFilters("alert");
    }
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("alert");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = generate_filter(field_types, filter_field, filter_value);
    const skip = (page - 1) * limit;
    const alerts = await alert_repository.filter_alerts(filter, skip, limit);
    const total_alerts = await alert_repository.count_alerts();
    const total_pages = Math.ceil(total_alerts / limit);
    return {
        data: alerts,
        pagination: {
            totalItems: total_alerts,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Retrieves a specific alert by its ID.
 *
 * @param {string} id - The ID of the alert to retrieve.
 * @returns {Promise<Object>} The alert object.
 * @throws {ObjectNotFound} If no alert is found with the given ID.
 */
export const get_alert_by_id = async (id) => {
    const alert_exists = await alert_repository.find_alert_by_id(id);
    if(!alert_exists) {
        throw new ObjectNotFound("alert");
    }
    return alert_exists;
}
/**
 * Updates an existing alert by its ID.
 *
 * @param {string} id - The ID of the alert to update.
 * @param {Object} updates - The properties to update in the alert.
 * @returns {Promise<Object>} The updated alert object.
 * @throws {ObjectMissingParameters} If the ID is not provided.
 * @throws {ObjectNotFound} If the sender, receiver, or alert does not exist.
 */
export const update_alert = async (id, updates) => { 
    if(!id) {
        throw new ObjectMissingParameters("alert");
    }
    const sender_exists = user_repository.find_user_by_id(updates.sender);
    const receiver_exists = user_repository.find_user_by_id(updates.receiver);
    if(!sender_exists) {
        throw new ObjectNotFound("sender");
    }
    if (!receiver_exists) {
        throw new ObjectNotFound("receiver");
    }
    const alert_exists_id = await alert_repository.find_alert_by_id(id);
    if(!alert_exists_id){
        throw new ObjectNotFound("alert");
    }
    return await alert_repository.update_alert(id, updates);
}
/**
 * Deletes an alert by its ID.
 *
 * @param {string} id - The ID of the alert to delete.
 * @returns {Promise<Object>} The result of the deletion operation.
 * @throws {ObjectMissingParameters} If the ID is not provided.
 * @throws {ObjectNotFound} If no alert is found with the given ID.
 */
export const delete_alert = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("alert");
    }
    
    const alert_exists = await alert_repository.find_alert_by_id(id);

    if(!alert_exists){
        throw new ObjectNotFound("alert");
    }
    return await alert_repository.delete_alert(id);
}