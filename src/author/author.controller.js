import { app_config } from '../config/app.config.js';
import { ObjectNotFound, ObjectAlreadyExists, ObjectMissingParameters, ObjectInvalidQueryFilters } from '../config/errors.js';
import * as author_service from './author.service.js';
import * as audit_log_service from '../audit_log/audit_log.service.js';
import { apiLogger } from '../config/util.js';
/**
 * Controller method to create a new author.
 * 
 * @param {Object} req - The request object containing the author's data.
 * @param {Object} res - The response object to send the result.
 * @returns {void}
 */
export const create_author = async (req, res) => {
    const {name, last_name, birthdate, gender} = req.body;
    try {
        await author_service.create_new_author(name, last_name, birthdate, gender);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.CREATE_AUTHOR, `${name} ${last_name}`);
        res.status(201).json({message: 'Author registered successfully'});
    } catch (error) {
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        apiLogger.error('Error creating author: ' + error.message);
        res.status(500).json({message: 'Error creating author', error: error.message});
    }
}
/**
 * Controller method to retrieve all authors with optional filters and pagination.
 * 
 * @param {Object} req - The request object containing query parameters.
 * @param {Object} res - The response object to send the result.
 * @returns {void}
 */
export const get_all_authors = async (req, res) => {
    try {
        const { filter_field, filter_value, page = 1, limit = app_config.DEFAULT_PAGINATION_LIMIT } = req.query;
        if(!filter_field || !filter_value) {
            const authors = await author_service.get_all_authors(page, limit);
            res.json(authors);
        } else {
            const authors = await author_service.filter_authors(filter_field, filter_value, page, limit);
            res.json(authors);
        }
    } catch (error) {
        if(error instanceof ObjectInvalidQueryFilters) {
            return res.status(400).json({message: error.message});
        }
        apiLogger.error('Error fetching authors: ' + error.message);
        res.status(500).json({message: 'Error fetching authors', error: error.message});
    }
}
/**
 * Controller method to retrieve a single author by their ID.
 * 
 * @param {Object} req - The request object containing the author ID.
 * @param {Object} res - The response object to send the result.
 * @returns {void}
 */
export const get_author_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        const author = await author_service.get_author_by_id(id);
        res.json(author);
    } catch (error) {
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        apiLogger.error('Error fetching author by ID: ' + error.message);
        res.status(500).json({message: 'Error fetching author by ID', error: error.message});
    }
}
/**
 * Controller method to update an existing author by their ID.
 * 
 * @param {Object} req - The request object containing the author ID and updates.
 * @param {Object} res - The response object to send the result.
 * @returns {void}
 */
export const update_author = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        
        await author_service.update_author(id, updates);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.UPDATE_AUTHOR, id);
        res.json({message: 'Author updated successfully'});
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
        apiLogger.error('Error updating author: ' + error.message);
        res.status(500).json({message: 'Error updating author', error: error.message});
    }
}
/**
 * Controller method to delete an author by their ID.
 * 
 * @param {Object} req - The request object containing the author ID.
 * @param {Object} res - The response object to send the result.
 * @returns {void}
 */
export const delete_author = async (req, res) => {
    try {
        const id = req.params.id;
        await author_service.delete_author(id);        
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.DELETE_AUTHOR, id);
        res.json({message: 'Author deleted successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        apiLogger.error('Error deleting author: ' + error.message);
        res.status(500).json({message: 'Error deleting author', error: error.message});
    }
}