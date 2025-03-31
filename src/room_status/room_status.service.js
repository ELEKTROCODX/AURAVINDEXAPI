import {ObjectAlreadyExists, ObjectInvalidQueryFilters, ObjectMissingParameters, ObjectNotFound } from '../config/errors.js';
import * as room_status_repository from './room_status.repository.js';
import { generate_filter } from '../config/util.js';
/**
 * Creates a new room status if it doesn't already exist.
 * 
 * @param {string} room_status - The room status to be created.
 * @returns {Object} The newly created room status.
 * @throws {ObjectAlreadyExists} Throws an error if the room status already exists.
 */
export const create_new_room_status = async (room_status) => {
    const room_status_exists = await room_status_repository.filter_room_statuses({['room_status']: new RegExp(room_status, 'i')}, 0, 10);
    if(room_status_exists.length != 0) {
        throw new ObjectAlreadyExists("room_status");
    }
    const new_room_status = await room_status_repository.create_room_status({room_status});
    return new_room_status;
}
/**
 * Fetches all room statuses with pagination.
 * 
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The number of results per page.
 * @returns {Array} List of room statuses.
 * @throws {ObjectInvalidQueryFilters} Throws an error if invalid query parameters are provided.
 */
export const get_all_room_statuses = async (page, limit) => {
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("room_status");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const room_statuses = await room_status_repository.find_all_room_statuses(skip, limit);
    const total_room_statuses = await room_status_repository.count_room_statuses();
    const total_pages = Math.ceil(total_room_statuses / limit);
    return {
        data: room_statuses,
        pagination: {
            totalItems: total_room_statuses,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Filters room statuses based on a specified field and value with pagination.
 * 
 * @param {string} filter_field - The field to filter by (e.g., room status).
 * @param {string} filter_value - The value to filter by.
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The number of results per page.
 * @returns {Array} List of filtered room statuses.
 * @throws {ObjectInvalidQueryFilters} Throws an error if invalid filter fields or query parameters are provided.
 */
export const filter_room_statuses = async (filter_field, filter_value, page, limit) => {
    const field_types = {
        room_stats: 'String'
    };
    const allowed_fields = Object.keys(field_types);
    if(!allowed_fields.includes(filter_field)) {
        throw new ObjectInvalidQueryFilters("room_status");
    }
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("room_status");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = generate_filter(field_types, filter_field, filter_value);
    const skip = (page - 1) * limit;
    const room_statuses = await room_status_repository.filter_room_statuses(filter, skip, limit);
    const total_room_statuses = await room_status_repository.count_room_statuses();
    const total_pages = Math.ceil(total_room_statuses / limit);
    return {
        data: room_statuses,
        pagination: {
            totalItems: total_room_statuses,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Fetches a room status by its ID.
 * 
 * @param {string} id - The ID of the room status.
 * @returns {Object} The room status data.
 * @throws {ObjectNotFound} Throws an error if the room status is not found.
 */
export const get_room_status_by_id = async (id) => {
    const room_status_exists = await room_status_repository.find_room_status_by_id(id);
    if(!room_status_exists) {
        throw new ObjectNotFound("room_status");
    }
    return room_status_exists;
}
/**
 * Updates an existing room status by its ID.
 * 
 * @param {string} id - The ID of the room status to be updated.
 * @param {Object} updates - The fields to be updated.
 * @returns {Object} The updated room status.
 * @throws {ObjectMissingParameters} Throws an error if the ID is missing.
 * @throws {ObjectNotFound} Throws an error if the room status is not found.
 * @throws {ObjectAlreadyExists} Throws an error if the updated room status already exists.
 */
export const update_room_status = async (id, updates) => { 
    if(!id) {
        throw new ObjectMissingParameters("room_status");
    }
    const room_status_exists_id = await room_status_repository.find_room_status_by_id(id);
    const room_status_exists_status = await room_status_repository.filter_room_statuses({['room_status']: new RegExp(room_status, 'i')}, 0, 10);
    if(!room_status_exists_id){
        throw new ObjectNotFound("room_status");
    }
    if( (room_status_exists_status.length != 0) && (room_status_exists_status[0]._id.toString() != id) ) {
        throw new ObjectAlreadyExists("room_status");
    }
    return await room_status_repository.update_room_status(id, updates);
}
/**
 * Deletes a room status by its ID.
 * 
 * @param {string} id - The ID of the room status to be deleted.
 * @returns {void} 
 * @throws {ObjectMissingParameters} Throws an error if the ID is missing.
 * @throws {ObjectNotFound} Throws an error if the room status is not found.
 */
export const delete_room_status = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("room_status");
    }
    
    const room_status_exists = await room_status_repository.find_room_status_by_id(id);

    if(!room_status_exists){
        throw new ObjectNotFound("room_status");
    }
    return await room_status_repository.delete_room_status(id);
}