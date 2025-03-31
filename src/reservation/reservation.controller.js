import { app_config } from '../config/app.config.js';
import { ObjectNotFound, ObjectAlreadyExists, ObjectMissingParameters, RoomPeopleUnauthorized, ReservationLongerThanAuthorized, ObjectInvalidQueryFilters, FinishDateBeforeStartDate, ReservationOutsideWorkingHours, DateInPast } from '../config/errors.js';
import * as reservation_service from './reservation.service.js';
import * as audit_log_service from '../audit_log/audit_log.service.js';
/**
 * Creates a new reservation by calling the service function.
 * 
 * @param {Object} req - The request object containing the reservation details.
 * @param {Object} res - The response object to send the result back to the client.
 * @throws {ObjectAlreadyExists} If there is already a reservation for the given room and date range.
 * @throws {RoomPeopleUnauthorized} If the number of people exceeds the room's capacity.
 * @throws {ReservationLongerThanAuthorized} If the reservation duration exceeds the allowed maximum time.
 * @throws {ObjectNotFound} If the user or room does not exist.
 */
export const create_reservation = async (req, res) => {
    const {user, room, start_date, finish_date, people, equipments} = req.body;
    try {
        await reservation_service.create_new_reservation(user, room, start_date, finish_date, people, equipments);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.CREATE_RESERVATION, `${user} - ${room}`);
        res.status(201).json({message: 'Reservation registered successfully'});
    } catch (error) {
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        if(error instanceof RoomPeopleUnauthorized){
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ReservationLongerThanAuthorized) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof FinishDateBeforeStartDate) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof DateInPast) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ReservationOutsideWorkingHours) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Error creating reservation', error: error.message});
    }
}
/**
 * Retrieves all reservations, optionally filtered by a specified field and value.
 * 
 * @param {Object} req - The request object containing the filter parameters and pagination.
 * @param {Object} res - The response object to send the result back to the client.
 * @throws {ObjectInvalidQueryFilters} If the query parameters are invalid.
 */
export const get_all_reservations = async (req, res) => {
    try {
        const { filter_field, filter_value, page = 1, limit = app_config.DEFAULT_PAGINATION_LIMIT } = req.query;
        if(!filter_field || !filter_value) {
            const reservations = await reservation_service.get_all_reservations(page, limit);
            res.json(reservations);
        } else {
            const reservations = await reservation_service.filter_reservations(filter_field, filter_value, page, limit);
            res.json(reservations);
        }
    } catch (error) {
        if(error instanceof ObjectInvalidQueryFilters) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Error fetching reservations', error: error.message});
    }
}
/**
 * Retrieves a reservation by its ID.
 * 
 * @param {Object} req - The request object containing the reservation ID in the URL parameters.
 * @param {Object} res - The response object to send the reservation data back to the client.
 * @throws {ObjectNotFound} If the reservation does not exist.
 * @throws {ObjectMissingParameters} If the reservation ID is missing from the request.
 */
export const get_reservation_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        
        const reservation = await reservation_service.get_reservation_by_id(id);
        res.json(reservation);
    } catch (error) {
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Error fetching reservation by ID', error: error.message});
    }
}
/**
 * Updates an existing reservation.
 * 
 * @param {Object} req - The request object containing the reservation ID and updates in the body.
 * @param {Object} res - The response object to send the updated reservation data back to the client.
 * @throws {ObjectMissingParameters} If the reservation ID or updates are missing.
 * @throws {ObjectAlreadyExists} If a conflicting reservation already exists.
 * @throws {RoomPeopleUnauthorized} If the updated reservation exceeds the room's people capacity.
 * @throws {ReservationLongerThanAuthorized} If the updated reservation duration exceeds the allowed maximum time.
 * @throws {ObjectNotFound} If the reservation, user, or room does not exist.
 */
export const update_reservation = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        await reservation_service.update_reservation(id, updates);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.UPDATE_RESERVATION, id);
        res.json({message: 'Reservation updated successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        if(error instanceof RoomPeopleUnauthorized){
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ReservationLongerThanAuthorized) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        // Internal error
        res.status(500).json({message: 'Error updating reservation', error: error.message});
    }
}
/**
 * Deletes a reservation by its ID.
 * 
 * @param {Object} req - The request object containing the reservation ID in the URL parameters.
 * @param {Object} res - The response object to send a confirmation of deletion back to the client.
 * @throws {ObjectMissingParameters} If the reservation ID is missing from the request.
 * @throws {ObjectNotFound} If the reservation does not exist.
 */
export const delete_reservation = async (req, res) => {
    try {
        const id = req.params.id;
        await reservation_service.delete_reservation(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.DELETE_RESERVATION, id);   
        res.json({message: 'Reservation deleted successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        // Internal error
        res.status(500).json({message: 'Error deleting reservation', error: error.message});
    }
}