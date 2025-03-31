import {DateInPast, FinishDateBeforeStartDate, ObjectAlreadyExists, ObjectInvalidQueryFilters, ObjectMissingParameters, ObjectNotFound, ReservationLongerThanAuthorized, ReservationOutsideWorkingHours, RoomPeopleUnauthorized } from '../config/errors.js';
import * as reservation_repository from './reservation.repository.js';
import * as user_repository from '../user/user.repository.js';
import * as room_repository from '../room/room.repository.js';
import { app_config } from '../config/app.config.js';
import { generate_filter, is_within_working_hours } from '../config/util.js';
/**
 * Creates a new reservation.
 * 
 * @param {string} user - The ID of the user making the reservation.
 * @param {string} room - The ID of the room being reserved.
 * @param {string} start_date - The start date of the reservation.
 * @param {string} finish_date - The finish date of the reservation.
 * @param {number} people - The number of people for the reservation.
 * @param {Array} equipments - The equipment required for the reservation.
 * @returns {Object} The newly created reservation object.
 * @throws {ObjectNotFound} If the user or room does not exist.
 * @throws {ObjectAlreadyExists} If there is already a reservation for the given room and date range.
 * @throws {RoomPeopleUnauthorized} If the number of people exceeds the room's capacity.
 * @throws {ReservationLongerThanAuthorized} If the reservation duration exceeds the allowed maximum time.
 */
export const create_new_reservation = async (user, room, start_date, finish_date, people, equipments) => {
    const user_exists = await user_repository.find_user_by_id(user);
    const room_exists = await room_repository.find_room_by_id(room);
    /* Create validation to check if there's a reservation for a specific user and/or room between reservation date */
    const reservation_exists = await reservation_repository.find_reservation_by_date(room, start_date, finish_date, equipments);
    /* Create validation to check if people is less than max allowed and more than min required */
    const reservation_people_authorized = await room_repository.find_room_by_people(room, people);
    /* Create validation to check if reservation lasts longer than allowed */
    const start = new Date(start_date.replace(" ", "T"));
    const finish = new Date(finish_date.replace(" ", "T"));
    if(start < new Date()) {
        throw new DateInPast();
    }
    if(start > finish) {
        throw new FinishDateBeforeStartDate();
    }
    const reservation_duration = (finish - start) / (1000 * 60 * 60);
    
    if(!user_exists) {
        throw new ObjectNotFound("user");
    }
    if(!room_exists) {
        throw new ObjectNotFound("room");
    }
    if(reservation_exists) {
        throw new ObjectAlreadyExists("reservation");
    }
    if(!reservation_people_authorized) {
        throw new RoomPeopleUnauthorized();
    }
    if(reservation_duration > app_config.RESERVATION_MAX_TIME_HOURS) {
        throw new ReservationLongerThanAuthorized();
    }
    if (!is_within_working_hours(start, finish)) {
        throw new ReservationOutsideWorkingHours();
    }
    const new_reservation = await reservation_repository.create_reservation({user, room, start_date, finish_date, people});
    return new_reservation;
}
/**
 * Fetches all reservations with pagination.
 * 
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The maximum number of reservations to return.
 * @returns {Array} A list of reservations for the given page and limit.
 * @throws {ObjectInvalidQueryFilters} If the query parameters for pagination are invalid.
 */
export const get_all_reservations = async (page, limit) => {
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("gender");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const reservations = await reservation_repository.find_all_reservations(skip, limit);
    const total_reservations = await reservation_repository.count_reservations();
    const total_pages = Math.ceil(total_reservations / limit);
    return {
        data: reservations,
        pagination: {
            totalItems: total_reservations,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Filters reservations based on a specific field and value.
 * 
 * @param {string} filter_field - The field to filter by (user, room, start_date, finish_date, people).
 * @param {string} filter_value - The value to filter by.
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The maximum number of reservations to return.
 * @returns {Array} A filtered list of reservations.
 * @throws {ObjectInvalidQueryFilters} If the filter field is invalid or pagination parameters are incorrect.
 */
export const filter_reservations = async (filter_field, filter_value, page, limit) => {
    const field_types = {
        user: 'ObjectId',
        room: 'ObjectId',
        start_date: 'Date',
        finish_date: 'Date',
        people: 'Number'
    };
    const allowed_fields = Object.keys(field_types);
    if(!allowed_fields.includes(filter_field)) {
        throw new ObjectInvalidQueryFilters("reservation");
    }
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("reservation");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = generate_filter(field_types, filter_field, filter_value);
    const skip = (page - 1) * limit;
    const reservations = await reservation_repository.filter_reservations(filter, skip, limit);
    const total_reservations = await reservation_repository.count_reservations();
    const total_pages = Math.ceil(total_reservations / limit);
    return {
        data: reservations,
        pagination: {
            totalItems: total_reservations,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Fetches a reservation by its ID.
 * 
 * @param {string} id - The ID of the reservation to fetch.
 * @returns {Object} The reservation object.
 * @throws {ObjectNotFound} If the reservation with the specified ID does not exist.
 */
export const get_reservation_by_id = async (id) => {
    const reservation_exists = await reservation_repository.find_reservation_by_id(id);
    if(!reservation_exists) {
        throw new ObjectNotFound("reservation");
    }
    return reservation_exists;
}
/**
 * Updates an existing reservation.
 * 
 * @param {string} id - The ID of the reservation to update.
 * @param {Object} updates - The updates to apply to the reservation.
 * @returns {Object} The updated reservation object.
 * @throws {ObjectMissingParameters} If the reservation ID is missing.
 * @throws {ObjectNotFound} If the reservation, user, or room does not exist.
 * @throws {ObjectAlreadyExists} If a conflicting reservation already exists.
 * @throws {RoomPeopleUnauthorized} If the updated reservation exceeds the room’s people capacity.
 * @throws {ReservationLongerThanAuthorized} If the updated reservation duration exceeds the allowed maximum time.
 */
export const update_reservation = async (id, updates) => { 
    if(!id) {
        throw new ObjectMissingParameters("reservation");
    }
    const reservation_exists_id = await reservation_repository.find_reservation_by_id(id);
    const user_exists = await user_repository.find_user_by_id(updates.user);
    const room_exists = await room_repository.find_room_by_id(updates.room);

    const reservation_exists_date = await reservation_repository.find_reservation_by_date(updates.room, updates.start_date, updates.finish_date);
    const reservation_people_authorized = await room_repository.find_room_by_people(updates.room, updates.people);
    const reservation_duration = (new Date(updates.finish_date.replace(" ", "T")) - new Date(updates.start_date.replace(" ", "T"))) / (1000 * 60 * 60);
    
    if(!reservation_exists_id){
        throw new ObjectNotFound("reservation");
    }
    if(!user_exists) {
        throw new ObjectNotFound("user");
    }
    if(!room_exists) {
        throw new ObjectNotFound("room");
    }        
    if( (reservation_exists_date) && (reservation_exists_date._id.toString() != id ) ) {
        throw new ObjectAlreadyExists("reservation");
    }
    if(!reservation_people_authorized) {
        throw new RoomPeopleUnauthorized();
    }
    if(reservation_duration > app_config.RESERVATION_MAX_TIME_HOURS) {
        throw new ReservationLongerThanAuthorized();
    }
    return await reservation_repository.update_reservation(id, updates);
}
/**
 * Deletes a reservation.
 * 
 * @param {string} id - The ID of the reservation to delete.
 * @returns {Object} A confirmation message for the deletion.
 * @throws {ObjectMissingParameters} If the reservation ID is missing.
 * @throws {ObjectNotFound} If the reservation with the specified ID does not exist.
 */
export const delete_reservation = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("reservation");
    }
    
    const reservation_exists = await reservation_repository.find_reservation_by_id(id);

    if(!reservation_exists){
        throw new ObjectNotFound("reservation");
    }
    return await reservation_repository.delete_reservation(id);
}