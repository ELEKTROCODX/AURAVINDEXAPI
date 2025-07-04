import { app_config } from '../config/app.config.js';
import { ObjectNotFound, ObjectAlreadyExists, ObjectMissingParameters, ObjectInvalidQueryFilters, NotificationAlreadyMarkedAsRed} from '../config/errors.js';
import * as notification_service from './notification.service.js';
import * as audit_log_service from '../audit_log/audit_log.service.js';
import { apiLogger } from '../config/util.js';
/**
 * Controller to handle the creation of a new notification.
 *
 * @param {Object} req - The HTTP request object containing title and receiver in the body.
 * @param {Object} res - The HTTP response object used to send the response.
 * @returns {void}
 */
export const create_notification = async (req, res) => {
    const {receiver, title, message, notification_type, is_read} = req.body;
    try {
        await notification_service.create_new_notification(receiver, title, message, notification_type, is_read);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.CREATE_NOTIFICATION, `${receiver} - ${title}`);
        res.status(201).json({message: 'Notification registered successfully'});
    } catch (error) {
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        apiLogger.error('Error creating notification: ' + error.message);
        res.status(500).json({message: 'Error creating notification', error: error.message});
    }
}
/**
 * Controller to handle the creation of notifications for all users.
 * This endpoint allows the creation of a notification that will be sent to all users in the system.
 */
export const create_notifications_for_all_users = async (req, res) => {
    const {title, message, notification_type, is_read} = req.body;
    try {
        await notification_service.create_notifications_for_all_users(title, message, notification_type, is_read);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.CREATE_NOTIFICATIONS_FOR_ALL_USERS, title);
        apiLogger.info(`Notifications for all users created by user ${req.user.id} with title: ${title}`);
        res.status(201).json({message: 'Notifications for all users registered successfully'});
    } catch (error) {
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        apiLogger.error('Error creating notifications for all users: ' + error.message);
        res.status(500).json({message: 'Error creating notifications for all users', error: error.message});
    } 
}
/**
 * Controller to retrieve all notifications, with optional filtering and pagination.
 *
 * @param {Object} req - The HTTP request object containing filter_field, filter_value, page, and limit in the query.
 * @param {Object} res - The HTTP response object used to send the response.
 * @returns {void}
 */
export const get_all_notifications = async (req, res) => {
    try {
        const { filter_field, filter_value, page = 1, limit = app_config.DEFAULT_PAGINATION_LIMIT, sort = "asc", sort_by = "createdAt" } = req.query;
        if(!filter_field || !filter_value) {
            const notifications = await notification_service.get_all_notifications(page, limit, sort, sort_by);
            await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_NOTIFICATION, 'ALL_NOTIFICATIONS');
            res.json(notifications);
        } else {
            const notifications = await notification_service.filter_notifications(filter_field, filter_value, page, limit, sort, sort_by);
            await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_NOTIFICATION, 'FILTERED_NOTIFICATIONS');
            res.json(notifications);
        }
    } catch (error) {
        if(error instanceof ObjectInvalidQueryFilters) {
            return res.status(400).json({message: error.message});
        }
        apiLogger.error('Error fetching notifications: ' + error.message);
        res.status(500).json({message: 'Error fetching notifications', error: error.message});
    }
}
/**
 * Controller to retrieve a specific notification by its ID.
 *
 * @param {Object} req - The HTTP request object containing the notification ID in the route parameters.
 * @param {Object} res - The HTTP response object used to send the response.
 * @returns {void}
 */
export const get_notification_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        const notification = await notification_service.get_notification_by_id(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_NOTIFICATION, id);
        res.json(notification);
    } catch (error) {
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        apiLogger.error('Error fetching notification by ID: ' + error.message);
        res.status(500).json({message: 'Error fetching notification by ID', error: error.message});
    }
}
/**
 * Controller to update an existing notification by its ID.
 *
 * @param {Object} req - The HTTP request object containing the notification ID in the route parameters and update fields in the body.
 * @param {Object} res - The HTTP response object used to send the response.
 * @returns {void}
 */
export const update_notification = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        
        await notification_service.update_notification(id, updates);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.UPDATE_NOTIFICATION, id);
        res.json({message: 'Notification updated successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        apiLogger.error('Error updating notification: ' + error.message);
        res.status(500).json({message: 'Error updating notification', error: error.message});
    }
}
/**
 * Controller to delete a notification by its ID.
 *
 * @param {Object} req - The HTTP request object containing the notification ID in the route parameters.
 * @param {Object} res - The HTTP response object used to send the response.
 * @returns {void}
 */
export const delete_notification = async (req, res) => {
    try {
        const id = req.params.id;
        await notification_service.delete_notification(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.DELETE_NOTIFICATION, id);
        res.json({message: 'Notification deleted successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        apiLogger.error('Error deleting notification: ' + error.message);
        res.status(500).json({message: 'Error deleting notification', error: error.message});
    }
}

/**
 * Controller to mark a notification as read by its ID.
 *
 * @param {Object} req - The HTTP request object containing the notification ID in the route parameters.
 * @param {Object} res - The HTTP response object used to send the response.
 * @returns {void}
 */
export const mark_notification_as_read = async (req, res) => {
    try {
        const id = req.params.id;
        await notification_service.mark_notification_as_read(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.MARK_NOTIFICATION_AS_READ, id);
        res.json({message: 'Notification marked as read successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof NotificationAlreadyMarkedAsRed) {
            return res.status(409).json({message: error.message});
        }
        apiLogger.error('Error marking notification as read: ' + error.message);
        res.status(500).json({message: 'Error marking notification as read', error: error.message});
    }
}