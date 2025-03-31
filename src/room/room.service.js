import {ObjectAlreadyExists, ObjectInvalidQueryFilters, ObjectMissingParameters, ObjectNotFound } from '../config/errors.js';
import * as room_repository from './room.repository.js';
import * as room_location_repository from '../room_location/room_location.repository.js';
import * as room_status_repository from '../room_status/room_status.repository.js';
import { generate_filter } from '../config/util.js';
/**
 * Creates a new room.
 * @param {string} name - The name of the room.
 * @param {number} min_people - The minimum number of people the room can accommodate.
 * @param {number} max_people - The maximum number of people the room can accommodate.
 * @param {string} room_location - The ID of the room's location.
 * @param {string} room_status - The ID of the room's status.
 * @param {string} room_img - The image URL for the room.
 * @returns {Promise<Object>} - Returns the created room object.
 * @throws {ObjectAlreadyExists} - Throws error if the room already exists.
 * @throws {ObjectNotFound} - Throws error if the room location or status does not exist.
 */
export const create_new_room = async (name, min_people, max_people, room_location, room_status, room_img) => {
    const room_exists = await room_repository.filter_rooms({['name']: new RegExp(name, 'i')}, 0, 10);
    const room_location_exists = await room_location_repository.find_room_location_by_id(room_location);
    const room_status_exists = await room_status_repository.find_room_status_by_id(room_status);    
    if(room_exists.length != 0) {
        throw new ObjectAlreadyExists("room");
    }
    if(!room_location_exists) {
        throw new ObjectNotFound("room_location");
    }
    if(!room_status_exists) {
        throw new ObjectNotFound("room_status");
    }
    const new_room = await room_repository.create_room({name, min_people, max_people, room_location, room_status, room_img});
    return new_room;
}
/**
 * Fetches all rooms with pagination.
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The number of rooms to return per page.
 * @returns {Promise<Array>} - Returns a list of rooms.
 * @throws {ObjectInvalidQueryFilters} - Throws error if invalid query parameters are provided.
 */
export const get_all_rooms = async (page, limit) => {
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("room");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const rooms = await room_repository.find_all_rooms(skip, limit);
    const total_rooms = await room_repository.count_rooms();
    const total_pages = Math.ceil(total_rooms / limit);
    return {
        data: rooms,
        pagination: {
            totalItems: total_rooms,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Filters rooms based on specific field and value with pagination.
 * @param {string} filter_field - The field to filter by (e.g., name, min_people).
 * @param {string} filter_value - The value of the field to filter by.
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The number of rooms to return per page.
 * @returns {Promise<Array>} - Returns a list of filtered rooms.
 * @throws {ObjectInvalidQueryFilters} - Throws error if invalid query parameters or filter field.
 */
export const filter_rooms = async (filter_field, filter_value, page, limit) => {
    const field_types = {
        name: 'String',
        min_people: 'Number',
        max_people: 'Number',
        room_location: 'ObjectId',
        room_status: 'ObjectId'
    };
    const allowed_fields = Object.keys(field_types);
    if(!allowed_fields.includes(filter_field)) {
        throw new ObjectInvalidQueryFilters("room");
    }
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("room");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = generate_filter(field_types, filter_field, filter_value);
    const skip = (page - 1) * limit;
    const rooms = await room_repository.filter_rooms(filter, skip, limit);
    const total_rooms = await room_repository.count_rooms();
    const total_pages = Math.ceil(total_rooms / limit);
    return {
        data: rooms,
        pagination: {
            totalItems: total_rooms,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Fetches a room by its ID.
 * @param {string} id - The ID of the room to fetch.
 * @returns {Promise<Object>} - Returns the room object.
 * @throws {ObjectNotFound} - Throws error if the room does not exist.
 */
export const get_room_by_id = async (id) => {
    const room_exists = await room_repository.find_room_by_id(id);
    if(!room_exists) {
        throw new ObjectNotFound("room");
    }
    return room_exists;
}
/**
 * Updates an existing room by its ID.
 * @param {string} id - The ID of the room to update.
 * @param {Object} updates - The fields to update in the room object.
 * @returns {Promise<Object>} - Returns the updated room object.
 * @throws {ObjectMissingParameters} - Throws error if the ID is missing.
 * @throws {ObjectNotFound} - Throws error if the room, room location, or room status does not exist.
 * @throws {ObjectAlreadyExists} - Throws error if a room with the updated name already exists.
 */
export const update_room = async (id, updates) => { 
    if(!id) {
        throw new ObjectMissingParameters("room");
    }
    const room_exists_id = await room_repository.find_room_by_id(id);
    const room_exists = await room_repository.filter_rooms({['name']: new RegExp(updates.name, 'i')}, 0, 10);
    const room_status_exists = await room_status_repository.find_room_status_by_id(updates.room_status);    
    const room_location_exists = await room_location_repository.find_room_location_by_id(updates.room_location);
    if(!room_location_exists) {
        throw new ObjectNotFound("room_location");
    }
    if(!room_status_exists) {
        throw new ObjectNotFound("room_status");
    }
    if(!room_exists_id){
        throw new ObjectNotFound("room");
    }
    
    if( (room_exists.length != 0) && (room_exists[0]._id.toString() != id) ) {
        throw new ObjectAlreadyExists("room");
    }
    return await room_repository.update_room(id, updates);
}
/**
 * Deletes a room by its ID.
 * @param {string} id - The ID of the room to delete.
 * @returns {Promise<void>} - No return value, only confirms deletion.
 * @throws {ObjectMissingParameters} - Throws error if the ID is missing.
 * @throws {ObjectNotFound} - Throws error if the room does not exist.
 */
export const delete_room = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("room");
    }
    
    const room_exists = await room_repository.find_room_by_id(id);

    if(!room_exists){
        throw new ObjectNotFound("room");
    }
    return await room_repository.delete_room(id);
}