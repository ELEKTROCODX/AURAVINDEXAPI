import { app_config } from '../config/app.config.js';
import { ObjectNotFound, ObjectAlreadyExists, ObjectMissingParameters, ObjectInvalidQueryFilters } from '../config/errors.js';
import * as equipment_service from './equipment.service.js';
import * as audit_log_service from '../audit_log/audit_log.service.js';
/**
 * Creates a new equipment entry in the system.
 * 
 * @param {Object} req - The request object containing the equipment data.
 * @param {Object} res - The response object to send back the result.
 * @throws {ObjectAlreadyExists} - If the equipment already exists, respond with a 409 status.
 * @throws {ObjectMissingParameters} - If the request data is incomplete, respond with a 400 status.
 * @throws {ObjectNotFound} - If the equipment is not found, respond with a 404 status.
 * @throws {ObjectInvalidQueryFilters} - If invalid filters are provided, respond with a 400 status.
 */
export const create_equipment = async (req, res) => {
    const {name, inventory, brand} = req.body;
    try {
        await equipment_service.create_new_equipment(name, inventory, brand);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.CREATE_EQUIPMENT, inventory);
        res.status(201).json({message: 'Equipment registered successfully'});
    } catch (error) {
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        res.status(500).json({message: 'Error creating equipment', error: error.message});
    }
}
/**
 * Retrieves all equipment entries with optional filters and pagination.
 * 
 * @param {Object} req - The request object containing query parameters.
 * @param {Object} res - The response object to send back the result.
 * @throws {ObjectInvalidQueryFilters} - If invalid filters or pagination parameters are provided, respond with a 400 status.
 */
export const get_all_equipments = async (req, res) => {
    try {
        const { filter_field, filter_value, page = 1, limit = app_config.DEFAULT_PAGINATION_LIMIT } = req.query;
        if(!filter_field || !filter_value) {
            const equipments = await equipment_service.get_all_equipments(page, limit);
            res.json(equipments);
        } else {
            const equipments = await equipment_service.filter_equipments(filter_field, filter_value, page, limit);
            res.json(equipments);
        }
    } catch (error) {
        if(error instanceof ObjectInvalidQueryFilters) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Error fetching equipments', error: error.message});
    }
}
/**
 * Retrieves a specific equipment entry by its ID.
 * 
 * @param {Object} req - The request object containing the equipment ID.
 * @param {Object} res - The response object to send back the equipment data.
 * @throws {ObjectNotFound} - If the equipment is not found, respond with a 404 status.
 * @throws {ObjectMissingParameters} - If the ID parameter is missing, respond with a 400 status.
 */
export const get_equipment_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        
        const equipment = await equipment_service.get_equipment_by_id(id);
        res.json(equipment);
    } catch (error) {
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Error fetching equipment by ID', error: error.message});
    }
}
/**
 * Updates an existing equipment entry by its ID.
 * 
 * @param {Object} req - The request object containing the updated data and equipment ID.
 * @param {Object} res - The response object to send back the result.
 * @throws {ObjectMissingParameters} - If the ID or data is missing, respond with a 400 status.
 * @throws {ObjectAlreadyExists} - If the updated equipment already exists, respond with a 409 status.
 * @throws {ObjectNotFound} - If the equipment is not found, respond with a 404 status.
 */
export const update_equipment = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        await equipment_service.update_equipment(id, updates);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.UPDATE_EQUIPMENT, id);
        res.json({message: 'Equipment updated successfully'});
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
        res.status(500).json({message: 'Error updating equipment', error: error.message});
    }
}
/**
 * Deletes an equipment entry by its ID.
 * 
 * @param {Object} req - The request object containing the equipment ID.
 * @param {Object} res - The response object to send back the result.
 * @throws {ObjectMissingParameters} - If the ID is missing, respond with a 400 status.
 * @throws {ObjectNotFound} - If the equipment is not found, respond with a 404 status.
 */
export const delete_equipment = async (req, res) => {
    try {
        const id = req.params.id;
        await equipment_service.delete_equipment(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.DELETE_EQUIPMENT, id);
        res.json({message: 'Equipment deleted successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        // Internal error
        res.status(500).json({message: 'Error deleting equipment', error: error.message});
    }
}