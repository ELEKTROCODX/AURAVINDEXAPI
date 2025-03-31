import {ObjectAlreadyExists, ObjectInvalidQueryFilters, ObjectMissingParameters, ObjectNotFound } from '../config/errors.js';
import * as room_location_repository from './room_location.repository.js';
import { generate_filter } from '../config/util.js';
/**
 * Creates a new room location.
 * Checks if the room location already exists before creating it.
 * 
 * @param {string} location - The location to be created.
 * @returns {Object} - The newly created room location.
 * @throws {ObjectAlreadyExists} - If the room location already exists.
 */
export const create_new_room_location = async (location) => {
    const room_location_exists = await room_location_repository.filter_room_locations({['location']: new RegExp(location, 'i')}, 0, 10);    
    if(room_location_exists.length != 0) {
        throw new ObjectAlreadyExists("room_location");
    }
    const new_room_location = await room_location_repository.create_room_location({location});
    return new_room_location;
}
/**
 * Fetches all room locations with pagination.
 * 
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of items per page.
 * @returns {Array} - List of room locations.
 * @throws {ObjectInvalidQueryFilters} - If invalid query filters are provided.
 */
export const get_all_room_locations = async (page, limit) => {
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("room_location");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const room_locations = await room_location_repository.find_all_room_locations(skip, limit);
    const total_room_locations = await room_location_repository.count_room_locations();
    const total_pages = Math.ceil(total_room_locations / limit);
    return {
        data: room_locations,
        pagination: {
            totalItems: total_room_locations,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Filters room locations based on the provided filter and pagination.
 * 
 * @param {string} filter_field - The field to filter by (e.g., 'location').
 * @param {string} filter_value - The value to filter by.
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of items per page.
 * @returns {Array} - List of filtered room locations.
 * @throws {ObjectInvalidQueryFilters} - If invalid query filters are provided.
 */
export const filter_room_locations = async (filter_field, filter_value, page, limit) => {
    const field_types = {
        location: 'String'
    };
    const allowed_fields = Object.keys(field_types);
    if(!allowed_fields.includes(filter_field)) {
        throw new ObjectInvalidQueryFilters("room_location");
    }
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("room_location");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = generate_filter(field_types, filter_field, filter_value);
    const skip = (page - 1) * limit;
    const room_locations = await room_location_repository.filter_room_locations(filter, skip, limit);
    const total_room_locations = await room_location_repository.count_room_locations();
    const total_pages = Math.ceil(total_room_locations / limit);
    return {
        data: room_locations,
        pagination: {
            totalItems: total_room_locations,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Fetches a room location by its ID.
 * 
 * @param {string} id - The ID of the room location to fetch.
 * @returns {Object} - The room location data.
 * @throws {ObjectNotFound} - If the room location is not found.
 */
export const get_room_location_by_id = async (id) => {
    const room_location_exists = await room_location_repository.find_room_location_by_id(id);
    if(!room_location_exists) {
        throw new ObjectNotFound("room_location");
    }
    return room_location_exists;
}
/**
 * Updates a room location by its ID.
 * 
 * @param {string} id - The ID of the room location to update.
 * @param {Object} updates - The updates to apply.
 * @returns {Object} - The updated room location.
 * @throws {ObjectMissingParameters} - If required parameters are missing.
 * @throws {ObjectNotFound} - If the room location is not found.
 * @throws {ObjectAlreadyExists} - If the room location with the updated location already exists.
 */
export const update_room_location = async (id, updates) => { 
    if(!id) {
        throw new ObjectMissingParameters("room_location");
    }
    const room_location_exists_id = await room_location_repository.find_room_location_by_id(id);
    const room_location_exists = await room_location_repository.filter_room_locations({['location']: new RegExp(updates.location, 'i')}, 0, 10);

    if(!room_location_exists_id){
        throw new ObjectNotFound("room_location");
    }
    
    if( (room_location_exists.length != 0) && (room_location_exists[0]._id.toString() != id) ) {
        throw new ObjectAlreadyExists("room_location");
    }
    return await room_location_repository.update_room_location(id, updates);
}
/**
 * Deletes a room location by its ID.
 * 
 * @param {string} id - The ID of the room location to delete.
 * @returns {Object} - A message confirming the deletion.
 * @throws {ObjectMissingParameters} - If required parameters are missing.
 * @throws {ObjectNotFound} - If the room location is not found.
 */
export const delete_room_location = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("room_location");
    }
    
    const room_location_exists = await room_location_repository.find_room_location_by_id(id);

    if(!room_location_exists){
        throw new ObjectNotFound("room_location");
    }
    return await room_location_repository.delete_room_location(id);
}