import { app_config } from '../config/app.config.js';
import { ObjectNotFound, ObjectAlreadyExists, ObjectMissingParameters, ObjectInvalidQueryFilters } from '../config/errors.js';
import * as role_service from './role.service.js';
import * as audit_log_service from '../audit_log/audit_log.service.js';
import { apiLogger } from '../config/util.js';
/**
 * Creates a new role.
 * @param {Object} req - The request object containing role data.
 * @param {Object} res - The response object.
 * @returns {void} - Sends a response indicating the success or failure of the operation.
 */
export const create_role = async (req, res) => {
    const {name, permissions} = req.body;
    try {
        await role_service.create_new_role(name, permissions);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.CREATE_ROLE, name);
        res.status(201).json({message: 'Role registered successfully'});
    } catch (error) {
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        apiLogger.error('Error creating role: ', error.message);
        res.status(500).json({message: 'Error creating role', error: error.message});
    }
}
/**
 * Retrieves all roles, with optional filtering and pagination.
 * @param {Object} req - The request object containing query parameters.
 * @param {Object} res - The response object.
 * @returns {void} - Sends a response with the list of roles.
 */
export const get_all_roles = async (req, res) => {
    try {
        const { filter_field, filter_value, page = 1, limit = app_config.DEFAULT_PAGINATION_LIMIT } = req.query;
        if(!filter_field || !filter_value) {
            const roles = await role_service.get_all_roles(page, limit);
            res.json(roles);
        } else {
            const roles = await role_service.filter_roles(filter_field, filter_value, page, limit);
            res.json(roles);
        }
    } catch (error) {
        if(error instanceof ObjectInvalidQueryFilters) {
            return res.status(400).json({message: error.message});
        }
        apiLogger.error('Error fetching roles: ', error.message);
        res.status(500).json({message: 'Error fetching roles', error: error.message});
    }
}
/**
 * Retrieves a role by its ID.
 * @param {Object} req - The request object containing the role ID as a parameter.
 * @param {Object} res - The response object.
 * @returns {void} - Sends a response with the role data.
 */
export const get_role_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        
        const role = await role_service.get_role_by_id(id);
        res.json(role);
    } catch (error) {
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        apiLogger.error('Error fetching role by ID: ', error.message);
        res.status(500).json({message: 'Error fetching role by ID', error: error.message});
    }
}
/**
 * Updates a role's data by ID.
 * @param {Object} req - The request object containing the role ID and update data.
 * @param {Object} res - The response object.
 * @returns {void} - Sends a response indicating success or failure.
 */
export const update_role = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        
        await role_service.update_role(id, updates);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.UPDATE_ROLE, id);
        res.json({message: 'Role updated successfully'});
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
        apiLogger.error('Error updating role: ', error.message);
        res.status(500).json({message: 'Error updating role', error: error.message});
    }
}
/**
 * Adds a permission to a role.
 * @param {Object} req - The request object containing the role ID and permission code.
 * @param {Object} res - The response object.
 * @returns {void} - Sends a response indicating success or failure.
 */
export const add_permission_to_role = async (req, res) => {
    try {
        const {id} = req.params;
        const {permission_code} = req.body;
        await role_service.add_permission_to_role(id, permission_code);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.ADD_PERMISSION_TO_ROLE, id);
        res.json({message: "Permission added successfully"});
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
        apiLogger.error('Error adding permission to role: ', error.message);
        res.status(500).json({message: 'Error adding permission to role', error: error.message});
    }
}
/**
 * Removes a permission from a role.
 * @param {Object} req - The request object containing the role ID and permission code.
 * @param {Object} res - The response object.
 * @returns {void} - Sends a response indicating success or failure.
 */
export const remove_permission_from_role = async (req, res) => {
    try {
        const {id} = req.params;
        const {permission_code} = req.body;

        await role_service.remove_permission_from_role(id, permission_code);   
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.REMOVE_PERMISSION_FROM_ROLE, id);     
        res.json({message: "Permission removed successfully"});
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
        apiLogger.error('Error removing permission from role: ', error.message);
        res.status(500).json({message: 'Error removing permission from role', error: error.message});
    }
}
/**
 * Deletes a role by its ID.
 * @param {Object} req - The request object containing the role ID as a parameter.
 * @param {Object} res - The response object.
 * @returns {void} - Sends a response indicating success or failure.
 */
export const delete_role = async (req, res) => {
    try {
        const id = req.params.id;
        await role_service.delete_role(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.DELETE_ROLE, id);
        res.json({message: 'Role deleted successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        apiLogger.error('Error deleting role: ', error.message);
        res.status(500).json({message: 'Error deleting role', error: error.message});
    }
}