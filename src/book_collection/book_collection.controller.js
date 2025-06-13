import { app_config } from '../config/app.config.js';
import { ObjectNotFound, ObjectAlreadyExists, ObjectMissingParameters, ObjectInvalidQueryFilters } from '../config/errors.js';
import * as book_collection_service from './book_collection.service.js';
import * as audit_log_service from '../audit_log/audit_log.service.js';
import { apiLogger } from '../config/util.js';
/**
 * Controller function to create a new book collection.
 * 
 * @param {Object} req - The request object containing the name in the body.
 * @param {Object} res - The response object to send the result.
 * @returns {void} The result of the book collection creation.
 */
export const create_book_collection = async (req, res) => {
    const {name} = req.body;
    try {
        await book_collection_service.create_new_book_collection(name);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.CREATE_BOOK_COLLECTION, name);
        res.status(201).json({message: 'Book collection registered successfully'});
    } catch (error) {
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        apiLogger.error('Error creating book collection: ' + error.message);
        res.status(500).json({message: 'Error creating book collection', error: error.message});
    }
}
/**
 * Controller function to get all book collections, with optional filters and pagination.
 * 
 * @param {Object} req - The request object containing query parameters for filters and pagination.
 * @param {Object} res - The response object to send the results.
 * @returns {void} A list of book collections.
 */
export const get_all_book_collections = async (req, res) => {
    try {
        const { filter_field, filter_value, page = 1, limit = app_config.DEFAULT_PAGINATION_LIMIT } = req.query;
        if(!filter_field || !filter_value) {
            const book_collections = await book_collection_service.get_all_book_collections(page, limit);
            res.json(book_collections);
        } else {
            const book_collections = await book_collection_service.filter_book_collections(filter_field, filter_value, page, limit);
            res.json(book_collections);
        }
    } catch (error) {
        if(error instanceof ObjectInvalidQueryFilters) {
            return res.status(400).json({message: error.message});
        }
        apiLogger.error('Error fetching book collections: ' + error.message);
        res.status(500).json({message: 'Error fetching book collections', error: error.message});
    }
}
/**
 * Controller function to get a book collection by its ID.
 * 
 * @param {Object} req - The request object containing the book collection ID in the params.
 * @param {Object} res - The response object to send the result.
 * @returns {void} The requested book collection.
 */
export const get_book_collection_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        
        const book_collection = await book_collection_service.get_book_collection_by_id(id);
        res.json(book_collection);
    } catch (error) {
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        apiLogger.error('Error fetching book collection by ID: ' + error.message);
        res.status(500).json({message: 'Error fetching book collection by ID', error: error.message});
    }
}
/**
 * Controller function to update an existing book collection by ID.
 * 
 * @param {Object} req - The request object containing the book collection ID in the params and updates in the body.
 * @param {Object} res - The response object to send the result.
 * @returns {void} The result of the book collection update.
 */
export const update_book_collection = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        
        await book_collection_service.update_book_collection(id, updates);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.UPDATE_BOOK_COLLECTION, id);
        res.json({message: 'Book collection updated successfully'});
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
        apiLogger.error('Error updating book collection: ' + error.message);
        res.status(500).json({message: 'Error updating book collection', error: error.message});
    }
}
/**
 * Controller function to delete a book collection by ID.
 * 
 * @param {Object} req - The request object containing the book collection ID in the params.
 * @param {Object} res - The response object to send the result.
 * @returns {void} The result of the book collection deletion.
 */
export const delete_book_collection = async (req, res) => {
    try {
        const id = req.params.id;
        await book_collection_service.delete_book_collection(id);   
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.DELETE_BOOK_COLLECTION, id);     
        res.json({message: 'Book collection deleted successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        apiLogger.error('Error deleting book collection: ' + error.message);
        res.status(500).json({message: 'Error deleting book collection', error: error.message});
    }
}