import { app_config } from '../config/app.config.js';
import { ObjectNotFound, ObjectAlreadyExists, ObjectMissingParameters, ObjectInvalidQueryFilters } from '../config/errors.js';
import * as room_location_service from './room_location.service.js';
import * as audit_log_service from '../audit_log/audit_log.service.js';
/**
 * Controller method to create a new room location.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void} - Sends a response indicating success or failure.
 */
export const create_room_location = async (req, res) => {
    const {location} = req.body;
    try {
        await room_location_service.create_new_room_location(location);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.CREATE_ROOM_LOCATION, location);
        res.status(201).json({message: 'Room location registered successfully'});
    } catch (error) {
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        res.status(500).json({message: 'Error creating room location', error: error.message});
    }
}
/**
 * Controller method to fetch all room locations or filter by a given field.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void} - Sends a response with the room locations data.
 */
export const get_all_room_locations = async (req, res) => {
    try {
        const { filter_field, filter_value, page = 1, limit = app_config.DEFAULT_PAGINATION_LIMIT } = req.query;
        if(!filter_field || !filter_value) {
            const room_locations = await room_location_service.get_all_room_locations(page, limit);
            res.json(room_locations);
        } else {
            const room_locations = await room_location_service.filter_room_locations(filter_field, filter_value, page, limit);
            res.json(room_locations);
        }
    } catch (error) {
        if(error instanceof ObjectInvalidQueryFilters) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Error fetching room locations', error: error.message});
    }
}
/**
 * Controller method to fetch a room location by ID.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void} - Sends a response with the room location data.
 */
export const get_room_location_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        const room_location = await room_location_service.get_room_location_by_id(id);
        res.json(room_location);
    } catch (error) {
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Error fetching room location by ID', error: error.message});
    }
}
/**
 * Controller method to update a room location by ID.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void} - Sends a response indicating success or failure.
 */
export const update_room_location = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        await room_location_service.update_room_location(id, updates);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.UPDATE_ROOM_LOCATION, id);
        res.json({message: 'Room location updated successfully'});
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
        res.status(500).json({message: 'Error updating room location', error: error.message});
    }
}
/**
 * Controller method to delete a room location by ID.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void} - Sends a response indicating success or failure.
 */
export const delete_room_location = async (req, res) => {
    try {
        const id = req.params.id;
        await room_location_service.delete_room_location(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.DELETE_ROOM_LOCATION, id);
        res.json({message: 'Room location deleted successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        // Internal error
        res.status(500).json({message: 'Error deleting room location', error: error.message});
    }
}