import { app_config } from '../config/app.config.js';
import { ObjectNotFound, ObjectAlreadyExists, ObjectMissingParameters, ObjectInvalidQueryFilters, InvalidLogin, InvalidPasswordReset, FailedToSendEmail, InvalidOrExpiredToken } from '../config/errors.js';
import * as user_service from './user.service.js';
import * as book_list_service from '../book_list/book_list.service.js';
import * as audit_log_service from '../audit_log/audit_log.service.js';
import fs from 'fs';
/**
 * Creates a new user by calling the user service.
 * 
 * @param {Object} req - The request object containing user information.
 * @param {Object} res - The response object to send the result.
 * 
 * @returns {void} 
 * @throws {ObjectAlreadyExists} If a user with the same email already exists.
 * @throws {ObjectMissingParameters} If required parameters are missing.
 */
export const create_user = async (req, res) => {
    try {
        const {name, last_name, email, biography, gender, birthdate, address, role, password} = req.body;
        const user_img = req.file ? `/images/users/${req.file.filename}` : app_config.DEFAULT_USER_IMG_PATH;
        await user_service.create_new_user(name, last_name, email, biography, gender, birthdate, user_img, address, role, password);
        const user_data = await user_service.filter_users('email', email, 1, 1);
        await book_list_service.create_new_book_list({title: 'Favorites', description: 'My favorite books.', owner: user_data.data[0]._id, books: []});
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.CREATE_USER, email);
        res.status(201).json({message: 'User created successfully'});
    } catch (error) {
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        res.status(500).json({message: 'Error creating user', error: error.message});
    }
  
}
/**
 * Retrieves a list of users, optionally filtering by field and value, with pagination.
 * 
 * @param {Object} req - The request object containing the query parameters.
 * @param {Object} res - The response object to send the result.
 * 
 * @returns {void} 
 * @throws {ObjectInvalidQueryFilters} If the query parameters for filtering are invalid.
 */
export const get_all_users = async (req, res) => {
    try {
        const { filter_field, filter_value, page = 1, limit = app_config.DEFAULT_PAGINATION_LIMIT } = req.query;
        if(!filter_field || !filter_value) {
            const users = await user_service.get_all_users(page, limit);
            await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_USER, 'ALL_USERS');
            res.json(users);
        } else {
            const users = await user_service.filter_users(filter_field, filter_value, page, limit);
            await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_USER, 'FILTERED_USERS');
            res.json(users);
        }
    } catch (error) {
        if(error instanceof ObjectInvalidQueryFilters) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Error fetching users', error: error.message});
    }
}
/**
 * Retrieves a specific user by their ID.
 * 
 * @param {Object} req - The request object containing the user ID.
 * @param {Object} res - The response object to send the result.
 * 
 * @returns {void} 
 * @throws {ObjectNotFound} If no user is found with the provided ID.
 * @throws {ObjectMissingParameters} If the ID parameter is missing.
 */
export const get_user_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await user_service.get_user_by_id(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_USER, id);
        res.json(user);
    } catch (error) {
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Error fetching user by ID', error: error.message});
    }
}
/**
 * Updates the information of a user by their ID.
 * 
 * @param {Object} req - The request object containing the user ID and update data.
 * @param {Object} res - The response object to send the result.
 * 
 * @returns {void} 
 * @throws {ObjectMissingParameters} If the ID or update parameters are missing.
 * @throws {ObjectAlreadyExists} If another user exists with the same email.
 * @throws {ObjectNotFound} If no user is found with the provided ID.
 */
export const update_user = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        if(req.file) {
            const user_data = await user_service.get_user_by_id(id);
            const old_image_path = path.join(__dirname, '..', 'public', user_data.user_img);
            if((user_data.user_img !== app_config.DEFAULT_USER_IMG_PATH) && (fs.existsSync(old_image_path))) {
                fs.unlinkSync(old_image_path);
            }
            const new_image_path = req.file ? `/images/users/${req.file.filename}` : app_config.DEFAULT_USER_IMG_PATH;
            updates.user_img = new_image_path;
        }

        await user_service.update_user(id, updates);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.UPDATE_USER, id);
        res.json({message: 'User updated successfully'});
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
        res.status(500).json({message: 'Error updating user', error: error.message});
    }
}
/**
 * Deletes a user by their ID.
 * 
 * @param {Object} req - The request object containing the user ID.
 * @param {Object} res - The response object to send the result.
 * 
 * @returns {void} 
 * @throws {ObjectMissingParameters} If the ID parameter is missing.
 * @throws {ObjectNotFound} If no user is found with the provided ID.
 */
export const delete_user = async (req, res) => {
    try {
        const id = req.params.id;
        await user_service.delete_user(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.DELETE_USER, id);
        res.json({message: 'User deleted successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        // Internal error
        res.status(500).json({message: 'Error deleting user', error: error.message});
    }
}
