import { app_config } from '../config/app.config.js';
import { ObjectNotFound, ObjectAlreadyExists, ObjectMissingParameters, ObjectInvalidQueryFilters } from '../config/errors.js';
import * as room_status_service from './room_status.service.js';
import * as audit_log_service from '../audit_log/audit_log.service.js';
/**
 * Controller method to create a new room status.
 * 
 * @param {Object} req - The request object containing the room status to create.
 * @param {Object} res - The response object to send the result.
 * @returns {void} 
 * @throws {ObjectAlreadyExists} If the room status already exists.
 */
export const create_room_status = async (req, res) => {
    const {room_status} = req.body;
    try {
        await room_status_service.create_new_room_status(room_status);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.CREATE_ROOM_STATUS, room_status);
        res.status(201).json({message: 'Room status registered successfully'});
    } catch (error) {
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        res.status(500).json({message: 'Error creating room status', error: error.message});
    }
}
/**
 * Controller method to fetch all room statuses, with optional filtering.
 * 
 * @param {Object} req - The request object, containing query parameters like page, limit, filter_field, and filter_value.
 * @param {Object} res - The response object to send the result.
 * @returns {void} 
 * @throws {ObjectInvalidQueryFilters} If invalid query filters are provided.
 */
export const get_all_room_statuses = async (req, res) => {
    try {
        const { filter_field, filter_value, page = 1, limit = app_config.DEFAULT_PAGINATION_LIMIT } = req.query;
        if(!filter_field || !filter_value) {
            const room_statuses = await room_status_service.get_all_room_statuses(page, limit);
            res.json(room_statuses);
        } else {
            const room_statuses = await room_status_service.filter_room_statuses(filter_field, filter_value, page, limit);
            res.json(room_statuses);
        }
    } catch (error) {
        if(error instanceof ObjectInvalidQueryFilters) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Error fetching room statuses', error: error.message});
    }
}
/**
 * Controller method to fetch a specific room status by its ID.
 * 
 * @param {Object} req - The request object containing the ID of the room status to fetch.
 * @param {Object} res - The response object to send the result.
 * @returns {void} 
 * @throws {ObjectNotFound} If the room status is not found.
 * @throws {ObjectMissingParameters} If the ID parameter is missing.
 */
export const get_room_status_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        
        const room_status = await room_status_service.get_room_status_by_id(id);
        res.json(room_status);
    } catch (error) {
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Error fetching room status by ID', error: error.message});
    }
}
/**
 * Controller method to update a room status by its ID.
 * 
 * @param {Object} req - The request object containing the ID and updates for the room status.
 * @param {Object} res - The response object to send the result.
 * @returns {void} 
 * @throws {ObjectMissingParameters} If the ID is missing.
 * @throws {ObjectAlreadyExists} If a room status with the same name already exists.
 * @throws {ObjectNotFound} If the room status is not found.
 */
export const update_room_status = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        await room_status_service.update_room_status(id, updates);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.UPDATE_ROOM_STATUS, id);
        res.json({message: 'Room status updated successfully'});
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
        // Internal error
        res.status(500).json({message: 'Error updating room status', error: error.message});
    }
}
/**
 * Controller method to delete a room status by its ID.
 * 
 * @param {Object} req - The request object containing the ID of the room status to delete.
 * @param {Object} res - The response object to send the result.
 * @returns {void} 
 * @throws {ObjectNotFound} If the room status is not found.
 * @throws {ObjectMissingParameters} If the ID parameter is missing.
 */
export const delete_room_status = async (req, res) => {
    try {
        const id = req.params.id;
        await room_status_service.delete_room_status(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.DELETE_ROOM_STATUS, id);
        res.json({message: 'Room status deleted successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        // Internal error
        res.status(500).json({message: 'Error deleting room status', error: error.message});
    }
}