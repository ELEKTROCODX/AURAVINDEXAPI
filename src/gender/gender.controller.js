import { app_config } from '../config/app.config.js';
import { ObjectNotFound, ObjectAlreadyExists, ObjectMissingParameters, ObjectInvalidQueryFilters } from '../config/errors.js';
import * as gender_service from './gender.service.js';
import * as audit_log_service from '../audit_log/audit_log.service.js';
import { apiLogger } from '../config/util.js';
/**
 * Creates a new gender in the system.
 * 
 * @param {Object} req - The request object, containing the gender's name in the body.
 * @param {Object} res - The response object.
 * @returns {void} - The response will indicate whether the creation was successful or if an error occurred.
 */
export const create_gender = async (req, res) => {
    const {name} = req.body;
    try {
        await gender_service.create_new_gender(name);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.CREATE_GENDER, name);
        res.status(201).json({message: 'Gender registered successfully'});
    } catch (error) {
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        apiLogger.error('Error creating gender: ', error.message);
        res.status(500).json({message: 'Error creating gender', error: error.message});
    }
}
/**
 * Retrieves all genders, optionally filtered by field and value, with pagination.
 * 
 * @param {Object} req - The request object, containing query parameters (filter_field, filter_value, page, limit).
 * @param {Object} res - The response object.
 * @returns {void} - The response will contain the list of genders.
 */
export const get_all_genders = async (req, res) => {
    try {
        const { filter_field, filter_value, page = 1, limit = app_config.DEFAULT_PAGINATION_LIMIT } = req.query;
        if(!filter_field || !filter_value) {
            const genders = await gender_service.get_all_genders(page, limit);
            res.json(genders);
        } else {
            const genders = await gender_service.filter_genders(filter_field, filter_value, page, limit);
            res.json(genders);
        }
    } catch (error) {
        if(error instanceof ObjectInvalidQueryFilters) {
            return res.status(400).json({message: error.message});
        }
        apiLogger.error('Error fetching genders: ', error.message);
        res.status(500).json({message: 'Error fetching genders', error: error.message});
    }
}
/**
 * Retrieves a gender by its ID.
 * 
 * @param {Object} req - The request object, containing the gender ID as a parameter.
 * @param {Object} res - The response object.
 * @returns {void} - The response will contain the gender object.
 */
export const get_gender_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        
        const gender = await gender_service.get_gender_by_id(id);
        res.json(gender);
    } catch (error) {
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        apiLogger.error('Error fetching gender by ID: ', error.message);
        res.status(500).json({message: 'Error fetching gender by ID', error: error.message});
    }
}
/**
 * Updates the details of an existing gender.
 * 
 * @param {Object} req - The request object, containing the gender ID as a parameter and the updates in the body.
 * @param {Object} res - The response object.
 * @returns {void} - The response will indicate whether the update was successful or if an error occurred.
 */
export const update_gender = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        
        await gender_service.update_gender(id, updates);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.UPDATE_GENDER, id);
        res.json({message: 'Gender updated successfully'});
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
        apiLogger.error('Error updating gender: ', error.message);
        res.status(500).json({message: 'Error updating gender', error: error.message});
    }
}
/**
 * Deletes a gender by its ID.
 * 
 * @param {Object} req - The request object, containing the gender ID as a parameter.
 * @param {Object} res - The response object.
 * @returns {void} - The response will indicate whether the deletion was successful or if an error occurred.
 */
export const delete_gender = async (req, res) => {
    try {
        const id = req.params.id;
        await gender_service.delete_gender(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.DELETE_GENDER, id);

        res.json({message: 'Gender deleted successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        apiLogger.error('Error deleting gender: ', error.message);
        res.status(500).json({message: 'Error deleting gender', error: error.message});
    }
}