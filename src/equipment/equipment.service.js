import {ObjectAlreadyExists, ObjectInvalidQueryFilters, ObjectMissingParameters, ObjectNotFound } from '../config/errors.js';
import * as equipment_repository from './equipment.repository.js';
import { generate_filter } from '../config/util.js';
/**
 * Creates a new equipment entry in the system.
 * 
 * @param {string} name - The name of the equipment.
 * @param {string} inventory - The inventory number of the equipment.
 * @param {string} brand - The brand of the equipment.
 * @returns {Object} - The created equipment object.
 * @throws {ObjectAlreadyExists} - Throws an error if equipment already exists.
 */
export const create_new_equipment = async (name, inventory, brand) => {
    const equipment_exists = await equipment_repository.filter_equipments({['inventory']: new RegExp(inventory, 'i')}, 0, 10);
    if(equipment_exists.length != 0) {
        throw new ObjectAlreadyExists("equipment");
    }
    const new_equipment = await equipment_repository.create_equipment({name, inventory, brand});
    return new_equipment;
}
/**
 * Retrieves all equipment entries with pagination.
 * 
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of entries per page.
 * @returns {Array} - A list of equipment entries.
 * @throws {ObjectInvalidQueryFilters} - Throws an error if pagination parameters are invalid.
 */
export const get_all_equipments = async (page, limit) => {
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("equipment");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const equipments = await equipment_repository.find_all_equipments(skip, limit);
    const total_equipments = await equipment_repository.count_equipments();
    const total_pages = Math.ceil(total_equipments / limit);
    return {
        data: equipments,
        pagination: {
            totalItems: total_equipments,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Filters equipment entries based on a field and value.
 * 
 * @param {string} filter_field - The field to filter by (e.g., name, inventory).
 * @param {string} filter_value - The value to filter by.
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of entries per page.
 * @returns {Array} - A list of filtered equipment entries.
 * @throws {ObjectInvalidQueryFilters} - Throws an error if an invalid filter field is provided.
 */
export const filter_equipments = async (filter_field, filter_value, page, limit) => {
    const field_types = {
        name: 'String',
        inventory: 'String',
        brand: 'String'
    };
    const allowed_fields = Object.keys(field_types);
    if(!allowed_fields.includes(filter_field)) {
        throw new ObjectInvalidQueryFilters("equipment");
    }
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("equipment");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = generate_filter(field_types, filter_field, filter_value);
    const skip = (page - 1) * limit;
    const equipments = await equipment_repository.filter_equipments(filter, skip, limit);
    const total_equipments = await equipment_repository.count_equipments();
    const total_pages = Math.ceil(total_equipments / limit);
    return {
        data: equipments,
        pagination: {
            totalItems: total_equipments,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Retrieves a specific equipment entry by its ID.
 * 
 * @param {string} id - The ID of the equipment.
 * @returns {Object} - The equipment object.
 * @throws {ObjectNotFound} - Throws an error if the equipment is not found.
 */
export const get_equipment_by_id = async (id) => {
    const equipment_exists = await equipment_repository.find_equipment_by_id(id);
    if(!equipment_exists) {
        throw new ObjectNotFound("equipment");
    }
    return equipment_exists;
}
/**
 * Updates an existing equipment entry based on the ID.
 * 
 * @param {string} id - The ID of the equipment to update.
 * @param {Object} updates - The fields to update.
 * @returns {Object} - The updated equipment object.
 * @throws {ObjectMissingParameters} - Throws an error if the ID is missing.
 * @throws {ObjectAlreadyExists} - Throws an error if the updated equipment already exists.
 * @throws {ObjectNotFound} - Throws an error if the equipment is not found.
 */
export const update_equipment = async (id, updates) => { 
    if(!id) {
        throw new ObjectMissingParameters("equipment");
    }
    const equipment_exists_id = await equipment_repository.find_equipment_by_id(id);
    const equipment_exists = await equipment_repository.filter_equipments({['inventory']: new RegExp(updates.inventory, 'i')}, 0, 10);
    if(!equipment_exists_id){
        throw new ObjectNotFound("equipment");
    }
    if( (equipment_exists.length != 0) && (equipment_exists[0]._id.toString() != id) ) {
        throw new ObjectAlreadyExists("equipment");
    }
    return await equipment_repository.update_equipment(id, updates);
}
/**
 * Deletes an equipment entry by its ID.
 * 
 * @param {string} id - The ID of the equipment to delete.
 * @returns {Object} - The deleted equipment object.
 * @throws {ObjectMissingParameters} - Throws an error if the ID is missing.
 * @throws {ObjectNotFound} - Throws an error if the equipment is not found.
 */
export const delete_equipment = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("equipment");
    }
    
    const equipment_exists = await equipment_repository.find_equipment_by_id(id);

    if(!equipment_exists){
        throw new ObjectNotFound("equipment");
    }
    return await equipment_repository.delete_equipment(id);
}