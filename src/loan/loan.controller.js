import { app_config } from '../config/app.config.js';
import { ObjectNotFound, ObjectAlreadyExists, ObjectMissingParameters, LoanExceededMaxRenewals, ObjectNotAvailable, ObjectInvalidQueryFilters, LoanReturnDateExceedsMaxAllowedDays, LoanAlreadyFinished, LoanAlreadyApproved, LoanCannotBeApproved } from '../config/errors.js';
import * as loan_service from './loan.service.js';
import * as audit_log_service from '../audit_log/audit_log.service.js';
/**
 * Creates a new loan for a user and a book.
 * 
 * @param {Object} req - The request object containing the loan details.
 * @param {Object} res - The response object used to send the response back to the client.
 * @returns {void} Sends a response with a status code and message indicating success or failure.
 * @throws {LoanExceededMaxRenewals} If the maximum allowed renewals for the loan are exceeded.
 * @throws {ObjectAlreadyExists} If a loan already exists for the given book and user.
 * @throws {ObjectNotAvailable} If the book is not available for loan.
 * @throws {ObjectNotFound} If the user or book is not found.
 */
export const create_loan = async (req, res) => {
    const {user, book, loan_status, return_date, returned_date, renewals} = req.body;
    try {
        await loan_service.create_new_loan(user, book, loan_status, return_date, returned_date, renewals);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.CREATE_LOAN, `${user} - ${book}`);
        res.status(201).json({message: 'Loan registered successfully'});
    } catch (error) {
        if(error instanceof LoanExceededMaxRenewals) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof LoanReturnDateExceedsMaxAllowedDays) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        if(error instanceof ObjectNotAvailable) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        res.status(500).json({message: 'Error creating loan', error: error.message});
    }
}
/**
 * Retrieves all loans with pagination and optional filtering.
 * 
 * @param {Object} req - The request object containing query parameters for filtering and pagination.
 * @param {Object} res - The response object used to send the response back to the client.
 * @returns {void} Sends a response with the list of loans or an error message.
 * @throws {ObjectInvalidQueryFilters} If invalid filters are provided in the query parameters.
 */
export const get_all_loans = async (req, res) => {
    try {
        const { filter_field, filter_value, page = 1, limit = app_config.DEFAULT_PAGINATION_LIMIT } = req.query;
        if(!filter_field || !filter_value) {
            const loans = await loan_service.get_all_loans(page, limit);
            await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_LOAN, 'ALL_LOANS');
            res.json(loans);
        } else {
            const loans = await loan_service.filter_loans(filter_field, filter_value, page, limit);
            await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_LOAN, 'FILTERED_LOANS');
            res.json(loans);
        }
    } catch (error) {
        if(error instanceof ObjectInvalidQueryFilters) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Error fetching loans', error: error.message});
    }
}
/**
 * Retrieves a loan by its ID.
 * 
 * @param {Object} req - The request object containing the loan ID in the URL parameters.
 * @param {Object} res - The response object used to send the response back to the client.
 * @returns {void} Sends a response with the loan object or an error message.
 * @throws {ObjectNotFound} If the loan with the specified ID does not exist.
 * @throws {ObjectMissingParameters} If the loan ID is missing in the request.
 */
export const get_loan_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        const loan = await loan_service.get_loan_by_id(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_LOAN, id);
        res.json(loan);
    } catch (error) {
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Error fetching loan by ID', error: error.message});
    }
}
/**
 * Updates an existing loan with new information.
 * 
 * @param {Object} req - The request object containing the loan ID in the URL and the updates in the body.
 * @param {Object} res - The response object used to send the response back to the client.
 * @returns {void} Sends a response indicating that the loan was updated successfully.
 * @throws {LoanExceededMaxRenewals} If the renewal limit is exceeded.
 * @throws {ObjectMissingParameters} If the loan ID or required parameters are missing.
 * @throws {ObjectAlreadyExists} If a conflicting loan already exists.
 * @throws {ObjectNotAvailable} If the book is not available for loan.
 * @throws {ObjectNotFound} If the loan, user, or book is not found.
 */
export const update_loan = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        
        await loan_service.update_loan(id, updates);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.UPDATE_LOAN, id);
        res.json({message: 'Loan updated successfully'});
    } catch (error) {
        if(error instanceof LoanExceededMaxRenewals) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        if(error instanceof ObjectNotAvailable) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        // Internal error
        res.status(500).json({message: 'Error updating loan', error: error.message});
    }
}
/**
 * Deletes a loan by its ID.
 * 
 * @param {Object} req - The request object containing the loan ID in the URL parameters.
 * @param {Object} res - The response object used to send the response back to the client.
 * @returns {void} Sends a response indicating that the loan was deleted successfully.
 * @throws {ObjectMissingParameters} If the loan ID is missing.
 * @throws {ObjectNotFound} If the loan with the specified ID does not exist.
 */
export const delete_loan = async (req, res) => {
    try {
        const id = req.params.id;
        await loan_service.delete_loan(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.DELETE_LOAN, id);
        res.json({message: 'Loan deleted successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        // Internal error
        res.status(500).json({message: 'Error deleting loan', error: error.message});
    }
}
/**
 * Approve a loan by setting its status to 'ACTIVE'.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.id - The ID of the loan to finish.
 * @param {Object} res - The HTTP response object.
 * @throws {ObjectMissingParameters} If the loan ID is missing.
 * @throws {ObjectNotFound} If the loan or book is not found.
 * @throws {LoanAlreadyApproved} If the loan has already been aprroved.
 * @returns {void} Sends a JSON response indicating the loan completion result.
 */
export const approve_loan = async (req, res) => {
    try {
        const id = req.params.id;
        await loan_service.approve_loan(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.APPROVE_LOAN, id);
        res.json({message: 'Loan approved successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        if(error instanceof ObjectNotAvailable) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof LoanAlreadyApproved) {
            return res.status(409).json({message: error.message});
        }
        if(error instanceof LoanCannotBeApproved) {
            return res.status(409).json({message: error.message});
        }
        // Internal error
        res.status(500).json({message: 'Error finishing loan', error: error.message});
    }
}
/**
 * Requests a renewal for an existing loan.
 * 
 * @param {Object} req - The request object containing the loan ID in the URL parameters.
 * @param {Object} res - The response object used to send the response back to the client.
 * @returns {void} Sends a response indicating that the loan was renewed successfully.
 * @throws {LoanExceededMaxRenewals} If the loan exceeds the maximum number of allowed renewals.
 * @throws {LoanAlreadyFinished} If the loan has already been finished.
 * @throws {ObjectNotFound} If the loan with the specified ID does not exist.
 * @throws {ObjectMissingParameters} If the loan ID is missing.
 * @throws {ObjectNotAvailable} If the book is not available for renewal.
 */
export const request_loan_renewal = async (req, res) => {
    try {
        const id = req.params.id;
        await loan_service.request_loan_renewal(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.REQUEST_LOAN_RENEWAL, id);
        res.json({mesage: 'Loan renewed successfully'});
    } catch (error) {
        if(error instanceof LoanExceededMaxRenewals) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        if(error instanceof ObjectNotAvailable) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof LoanAlreadyFinished) {
            return res.status(400).json({message: error.message});
        }
        // Internal error
        res.status(500).json({message: 'Error reqesting loan renewal', error: error.message});
    }
}
/**
 * Completes a loan by updating its status and the associated book's status to "AVAILABLE".
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.id - The ID of the loan to finish.
 * @param {Object} res - The HTTP response object.
 * @throws {ObjectMissingParameters} If the loan ID is missing.
 * @throws {ObjectNotFound} If the loan or book is not found.
 * @throws {LoanAlreadyFinished} If the loan has already been finished.
 * @throws {ObjectAlreadyExists | ObjectNotAvailable} If other specific loan-related issues occur.
 * @returns {void} Sends a JSON response indicating the loan completion result.
 */
export const finish_loan = async (req, res) => {
    try {
        const id = req.params.id;
        await loan_service.return_book(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.FINISH_LOAN, id);
        res.json({message: 'Loan finished successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        if(error instanceof ObjectNotAvailable) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof LoanAlreadyFinished) {
            return res.status(400).json({message: error.message});
        }
        // Internal error
        res.status(500).json({message: 'Error finishing loan', error: error.message});
    }
}