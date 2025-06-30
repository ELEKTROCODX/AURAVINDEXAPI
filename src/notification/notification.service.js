import {ObjectAlreadyExists, ObjectInvalidQueryFilters, ObjectMissingParameters, ObjectNotFound, NotificationAlreadyMarkedAsRed } from '../config/errors.js';
import * as notification_repository from './notification.repository.js';
import * as user_repository from '../user/user.repository.js';
import { generate_filter } from '../config/util.js';
import { send_push_notification } from '../config/fcm.js';
/**
 * Creates a new notification in the system.
 * @param {string} receiver - The ID of the user receiving the notification.
 * @param {string} title - The notification title.
 * @param {string} message - The notification message.
 * @returns {Promise<Object>} The newly created notification object.
 * @throws {ObjectNotFound} If the receiver does not exist.
 */
export const create_new_notification = async (receiver, title, message, notification_type, is_read) => {
    const receiver_exists = await user_repository.find_user_by_id(receiver);
    if (!receiver_exists) {
        throw new ObjectNotFound("receiver");
    }
    const new_notification = await notification_repository.create_notification({receiver, title, message, notification_type, is_read});
    if(receiver_exists.fcm_token) {
        await send_push_notification(receiver_exists.fcm_token, title, message);
    }
    return new_notification;
}
/**
 * Retrieves all notifications with pagi    nation.
 *
 * @param {number} page - The page number to retrieve.
 * @param {number} limit - The number of notifications per page.
 * @returns {Promise<Array>} An array of notification objects.
 * @throws {ObjectInvalidQueryFilters} If page or limit are invalid values.
 */
export const get_all_notifications = async (page, limit, sort, sort_by) => {
    if(isNaN(page) || (isNaN(limit) && (limit != "none")) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("notification");
    }
    const sort_field = sort_by || 'createdAt';
    const sort_direction = sort === 'desc' ? -1 : 1;
    const notifications = await notification_repository.find_all_notifications(null, null, sort_field, sort_direction);
    const total_notifications = notifications.length;
    if(limit == "none") limit = total_notifications;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const total_pages = Math.ceil(total_notifications / limit);
    const paginated_notifications = notifications.slice(skip, skip + limit);
    return {
        data: paginated_notifications,
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
 * @param {string} filter_field - The field to filter by (e.g. receiver).
 * @param {string} filter_value - The value to match for the specified field.
 * @param {number} page - The page number to retrieve.
 * @param {number} limit - The number of notifications per page.
 * @returns {Promise<Array>} An array of filtered notification objects.
 * @throws {ObjectInvalidQueryFilters} If the filter field, page, or limit are invalid.
 */
export const filter_notifications = async (filter_field, filter_value, page, limit, sort, sort_by) => {
    const field_types = {
        receiver: 'ObjectId',
        title: 'String',
        message: 'String',
        notification_type: 'String',
        is_read: 'Boolean'
    };
    const allowed_fields = Object.keys(field_types);
    if(!allowed_fields.includes(filter_field)) {
        throw new ObjectInvalidQueryFilters("notification");
    }
    if(isNaN(page) || (isNaN(limit) && (limit != "none")) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("notification");
    }
    const sort_field = sort_by || 'createdAt';
    const sort_direction = sort === 'desc' ? -1 : 1;
    const filter = generate_filter(field_types, filter_field, filter_value);
    const notifications = await notification_repository.filter_notifications(filter, null, null, sort_field, sort_direction);
    const total_notifications = notifications.length;
    if(limit == "none") limit = total_notifications;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const total_pages = Math.ceil(total_notifications / limit);
    const paginated_notifications = notifications.slice(skip, skip + limit);
    return {
        data: paginated_notifications,
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
 * @throws {ObjectNotFound} If the receiver, or notification does not exist.
 */
export const update_notification = async (id, updates) => { 
    if(!id) {
        throw new ObjectMissingParameters("notification");
    }
    const receiver_exists = user_repository.find_user_by_id(updates.receiver);
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

/**
 * Mark a notification as read.
 *
 * @param {string} id - The ID of the notification to mark as read.
 * @returns {Promise<Object>} The result of the deletion operation.
 * @throws {ObjectMissingParameters} If the ID is not provided.
 * @throws {NotificationAlreadyMarkedAsRed} If the notification is already marked as read.
 * @throws {ObjectNotFound} If no notification is found with the given ID.
 */
export const mark_notification_as_read = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("notification");
    }
    
    const notification_exists = await notification_repository.find_notification_by_id(id);

    if(!notification_exists){
        throw new ObjectNotFound("notification");
    }
    if(notification_exists.is_read) {
        throw new NotificationAlreadyMarkedAsRed("notification");
    }
    notification_exists.is_read = true;
    return await notification_repository.update_notification(id, notification_exists);
}