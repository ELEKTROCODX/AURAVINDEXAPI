import { app_config } from '../config/app.config.js';
import { ObjectNotFound, ObjectAlreadyExists, ObjectMissingParameters, ObjectInvalidQueryFilters } from '../config/errors.js';
import * as room_service from './room.service.js';
import * as audit_log_service from '../audit_log/audit_log.service.js';
/**
 * Handles creating a new room.
 * @param {Object} req - The request object containing room data in the body.
 * @param {Object} res - The response object used to send a status message.
 * @returns {void} - Sends a success or error response.
 */
export const create_room = async (req, res) => {
    const {name, min_people, max_people, room_location, room_status} = req.body;
    try {
        const room_img = req.file ? `/images/rooms/${req.file.filename}` : app_config.DEFAULT_ROOM_IMG_PATH;
        await room_service.create_new_room(name, min_people, max_people, room_location, room_status, room_img);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.CREATE_ROOM, name);
        res.status(201).json({message: 'Room registered successfully'});
    } catch (error) {
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        res.status(500).json({message: 'Error creating room', error: error.message});
    }
}
/**
 * Handles fetching all rooms with optional filtering and pagination.
 * @param {Object} req - The request object containing optional query parameters for filtering and pagination.
 * @param {Object} res - The response object used to send the list of rooms.
 * @returns {void} - Sends the list of rooms or error response.
 */
export const get_all_rooms = async (req, res) => {
    try {
        const { filter_field, filter_value, page = 1, limit = app_config.DEFAULT_PAGINATION_LIMIT } = req.query;
        if(!filter_field || !filter_value) {
            const rooms = await room_service.get_all_rooms(page, limit);
            res.json(rooms);
        } else {
            const rooms = await room_service.filter_rooms(filter_field, filter_value, page, limit);
            res.json(rooms);
        }
    } catch (error) {
        if(error instanceof ObjectInvalidQueryFilters) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Error fetching rooms', error: error.message});
    }
}
/**
 * Handles fetching a room by its ID.
 * @param {Object} req - The request object containing the room ID as a parameter.
 * @param {Object} res - The response object used to send the room data.
 * @returns {void} - Sends the room data or error response.
 */
export const get_room_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        
        const room = await room_service.get_room_by_id(id);
        res.json(room);
    } catch (error) {
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Error fetching room by ID', error: error.message});
    }
}
/**
 * Handles updating an existing room by its ID.
 * @param {Object} req - The request object containing the room ID in the URL and the update data in the body.
 * @param {Object} res - The response object used to send a success or error response.
 * @returns {void} - Sends a success message or error response.
 */
export const update_room = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        if(req.file) {
            const room_data = await room_service.get_room_by_id(id);
            const old_image_path = path.join(__dirname, '..', 'public', room_data.room_img);
            if((room_data.room_img !== app_config.DEFAULT_ROOM_IMG_PATH) && (fs.existsSync(old_image_path))) {
                fs.unlinkSync(old_image_path);
            }
            const new_image_path = req.file ? `/images/rooms/${req.file.filename}` : app_config.DEFAULT_ROOM_IMG_PATH;
            updates.room_img = new_image_path;
        }
        await room_service.update_room(id, updates);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.UPDATE_ROOM, id);
        res.json({message: 'Room updated successfully'});
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
        res.status(500).json({message: 'Error updating room', error: error.message});
    }
}
/**
 * Handles deleting a room by its ID.
 * @param {Object} req - The request object containing the room ID as a parameter.
 * @param {Object} res - The response object used to send a success or error response.
 * @returns {void} - Sends a success message or error response.
 */
export const delete_room = async (req, res) => {
    try {
        const id = req.params.id;
        await room_service.delete_room(id);        
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.DELETE_ROOM, id);
        res.json({message: 'Room deleted successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        // Internal error
        res.status(500).json({message: 'Error deleting room', error: error.message});
    }
}