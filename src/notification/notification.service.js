import {ObjectAlreadyExists, ObjectInvalidQueryFilters, ObjectMissingParameters, ObjectNotFound } from '../config/errors.js';
import * as notification_repository from './notification.repository.js';
import * as user_repository from '../user/user.repository.js';
import { generate_filter } from '../config/util.js';
/**
 * Creates a new notification in the system.
 * @param {string} sender - The ID of the user sending the notification.
 * @param {string} receiver - The ID of the user receiving the notification.
 * @param {string} title - The notification title.
 * @param {string} description - The notification description.
 * @returns {Promise<Object>} The newly created notification object.
 * @throws {ObjectNotFound} If the sender or receiver does not exist.
 */
export const create_new_notification = async (sender, receiver, title, description) => {
    const sender_exists = user_repository.find_user_by_id(sender);
    const receiver_exists = user_repository.find_user_by_id(receiver);
    if(!sender_exists) {
        throw new ObjectNotFound("sender");
    }
    if (!receiver_exists) {
        throw new ObjectNotFound("receiver");
    }
    const new_notification = await notification_repository.create_notification({sender, receiver, title, description});
    return new_notification;
}
/**
 * Retrieves all notifications with pagination.
 *
 * @param {number} page - The page number to retrieve.
 * @param {number} limit - The number of notifications per page.
 * @returns {Promise<Array>} An array of notification objects.
 * @throws {ObjectInvalidQueryFilters} If page or limit are invalid values.
 */
export const get_all_notifications = async (page, limit) => {
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("notification");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const notifications = await notification_repository.find_all_notifications(skip, limit);
    const total_notifications = await notification_repository.count_notifications();
    const total_pages = Math.ceil(total_notifications / limit);
    return {
        data: notifications,
        pagination: {
            totalItems: total_notifications,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Filters notifications based on a field and value with pagination.
 *
 * @param {string} filter_field - The field to filter by (e.g. sender, receiver).
 * @param {string} filter_value - The value to match for the specified field.
 * @param {number} page - The page number to retrieve.
 * @param {number} limit - The number of notifications per page.
 * @returns {Promise<Array>} An array of filtered notification objects.
 * @throws {ObjectInvalidQueryFilters} If the filter field, page, or limit are invalid.
 */
export const filter_notifications = async (filter_field, filter_value, page, limit) => {
    const field_types = {
        sender: 'ObjectId',
        receiver: 'ObjectId',
        title: 'String',
        description: 'String'
    };
    const allowed_fields = Object.keys(field_types);
    if(!allowed_fields.includes(filter_field)) {
        throw new ObjectInvalidQueryFilters("notification");
    }
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("notification");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = generate_filter(field_types, filter_field, filter_value);
    const skip = (page - 1) * limit;
    const notifications = await notification_repository.filter_notifications(filter, skip, limit);
    const total_notifications = notifications.length;
    const total_pages = Math.ceil(total_notifications / limit);
    return {
        data: notifications,
        pagination: {
            totalItems: total_notifications,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Retrieves a specific notification by its ID.
 *
 * @param {string} id - The ID of the notification to retrieve.
 * @returns {Promise<Object>} The notification object.
 * @throws {ObjectNotFound} If no notification is found with the given ID.
 */
export const get_notification_by_id = async (id) => {
    const notification_exists = await notification_repository.find_notification_by_id(id);
    if(!notification_exists) {
        throw new ObjectNotFound("notification");
    }
    return notification_exists;
}
/**
 * Updates an existing notification by its ID.
 *
 * @param {string} id - The ID of the notification to update.
 * @param {Object} updates - The properties to update in the notification.
 * @returns {Promise<Object>} The updated notification object.
 * @throws {ObjectMissingParameters} If the ID is not provided.
 * @throws {ObjectNotFound} If the sender, receiver, or notification does not exist.
 */
export const update_notification = async (id, updates) => { 
    if(!id) {
        throw new ObjectMissingParameters("notification");
    }
    const sender_exists = user_repository.find_user_by_id(updates.sender);
    const receiver_exists = user_repository.find_user_by_id(updates.receiver);
    if(!sender_exists) {
        throw new ObjectNotFound("sender");
    }
    if (!receiver_exists) {
        throw new ObjectNotFound("receiver");
    }
    const notification_exists_id = await notification_repository.find_notification_by_id(id);
    if(!notification_exists_id){
        throw new ObjectNotFound("notification");
    }
    return await notification_repository.update_notification(id, updates);
}
/**
 * Deletes a notification by its ID.
 *
 * @param {string} id - The ID of the notification to delete.
 * @returns {Promise<Object>} The result of the deletion operation.
 * @throws {ObjectMissingParameters} If the ID is not provided.
 * @throws {ObjectNotFound} If no notification is found with the given ID.
 */
export const delete_notification = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("notification");
    }
    
    const notification_exists = await notification_repository.find_notification_by_id(id);

    if(!notification_exists){
        throw new ObjectNotFound("notification");
    }
    return await notification_repository.delete_notification(id);
}