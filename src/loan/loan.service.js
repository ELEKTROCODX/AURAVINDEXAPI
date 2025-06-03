import {LoanAlreadyApproved, LoanAlreadyFinished, LoanCannotBeApproved, LoanExceededMaxRenewals, LoanReturnDateExceedsMaxAllowedDays, ObjectAlreadyExists, ObjectInvalidQueryFilters, ObjectMissingParameters, ObjectNotAvailable, ObjectNotFound } from '../config/errors.js';
import * as loan_repository from './loan.repository.js';
import * as user_repository from '../user/user.repository.js';
import * as book_repository from '../book/book.repository.js';
import * as book_status_repository from '../book_status/book_status.repository.js'
import * as loan_status_repository from '../loan_status/loan_status.repository.js';
import { app_config } from '../config/app.config.js';
import { generate_filter } from '../config/util.js';
/**
 * Creates a new loan for a user and a book.
 * 
 * @param {string} user - The ID of the user requesting the loan.
 * @param {string} book - The ID of the book being loaned.
 * @param {string} loan_status - The ID of the loan status.
 * @param {string} return_date - The date by which the book should be returned.
 * @param {string} returned_date - The date the book is actually returned (if any).
 * @param {number} renewals - The number of times the loan has been renewed.
 * @returns {Promise<Object>} The new loan created.
 * @throws {ObjectNotAvailable} If the book is not available for loan.
 * @throws {ObjectNotFound} If the user or book is not found.
 * @throws {ObjectAlreadyExists} If a loan already exists for the given book and user.
 * @throws {LoanExceededMaxRenewals} If the maximum allowed renewals for the loan are exceeded.
 */
export const create_new_loan = async (user, book, loan_status, return_date, returned_date, renewals = 0) => {
    const user_exists = await user_repository.find_user_by_id(user);
    const book_exists = await book_repository.find_book_by_id(book);
    const loan_status_exists = await loan_status_repository.find_loan_status_by_id(loan_status);
    const finished_loan_status = await loan_status_repository.filter_loan_statuses({loan_status: 'FINISHED'}, 0, 1);
    /* Create validation to check if book status is available */
    if(book_exists.book_status.book_status != "AVAILABLE") {
        throw new ObjectNotAvailable("book")
    }
    if(!return_date) {
        const date = new Date();
        date.setDate(date.getDate() + app_config.LOAN_MAX_RETURN_DAYS);
        return_date = date;
    } else {
        // Validate that the return date does not exceed the maximum allowed days
        const loan_date = new Date();
        const max_return_date = new Date(loan_date);
        max_return_date.setDate(loan_date.getDate() + app_config.LOAN_MAX_RETURN_DAYS);

        const provided_return_date = new Date(return_date);
        if (provided_return_date > max_return_date) {
            throw new LoanReturnDateExceedsMaxAllowedDays();
        }
    }
    /* Create validation to check if there's a loan for a specific user and/or book between loan date */
    const loan_exists = await loan_repository.find_loan_by_date(book, user, finished_loan_status[0]._id, Date.now(), return_date);    
    /* Create validation to check if loan has been renewed  */
    if(renewals > app_config.LOAN_MAX_RENEWALS_PER_LOAN) {
        throw new LoanExceededMaxRenewals();
    }
    if(!user_exists) {
        throw new ObjectNotFound("user");
    }
    if(!book_exists) {
        throw new ObjectNotFound("book");
    }
    if(!loan_status_exists) {
        throw new ObjectNotFound("loan_status");
    }
    if(loan_exists) {
        throw new ObjectAlreadyExists("loan");
    }
    /* Change book status to lent */
    const lent_book_status = await book_status_repository.filter_book_statuses({book_status: 'LENT'}, 0, 1);
    book_exists.book_status = lent_book_status[0]._id;
    const new_loan = await loan_repository.create_loan({user, book, loan_status, return_date, returned_date, renewals});
    await book_repository.update_book(book_exists._id, book_exists);
    return new_loan;
}
/**
 * Retrieves all loans with pagination.
 * 
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of loans per page.
 * @returns {Promise<Array>} A list of all loans with pagination.
 * @throws {ObjectInvalidQueryFilters} If invalid filters are provided in the query parameters.
 */
export const get_all_loans = async (page, limit, sort, sort_by) => {
    if(isNaN(page) || (isNaN(limit) && (limit != "none")) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("loan");
    }
    const sort_field = sort_by || 'createdAt';
    const sort_direction = sort === 'desc' ? -1 : 1;
    const loans = await loan_repository.find_all_loans(null, null, sort_field, sort_direction);
    const total_loans = loans.length;
    if(limit == "none") limit = total_loans;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const total_pages = Math.ceil(total_loans / limit);
    const paginated_loans = loans.slice(skip, skip + limit);
    return {
        data: paginated_loans,
        pagination: {
            totalItems: total_loans,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Filters loans based on a specific field and value, with pagination.
 * 
 * @param {string} filter_field - The field to filter by (e.g., 'user', 'book', 'return_date').
 * @param {string} filter_value - The value to match for the specified field.
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of loans per page.
 * @returns {Promise<Array>} A list of loans that match the filter criteria.
 * @throws {ObjectInvalidQueryFilters} If the filter field is invalid or pagination parameters are incorrect.
 */
export const filter_loans = async (filter_field, filter_value, page, limit, sort, sort_by) => {
    const field_types = {
        user: 'ObjectId',
        book: 'ObjectId',
        loan_status: 'ObjectId',
        return_date: 'Date',
        returned_date: 'Date',
        renewals: 'Number'
    };
    const allowed_fields = Object.keys(field_types);
    if(!allowed_fields.includes(filter_field)) {
        throw new ObjectInvalidQueryFilters("loan");
    }
    if(isNaN(page) || (isNaN(limit) && (limit != "none")) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("loan");
    }
    const sort_field = sort_by || 'createdAt';
    const sort_direction = sort === 'desc' ? -1 : 1;
    const filter = generate_filter(field_types, filter_field, filter_value);
    const loans = await loan_repository.filter_loans(filter, null, null, sort_field, sort_direction);
    const total_loans = loans.length;
    if(limit == "none") limit = total_loans;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const total_pages = Math.ceil(total_loans / limit);
    const paginated_loans = loans.slice(skip, skip + limit);
    return {
        data: paginated_loans,
        pagination: {
            totalItems: total_loans,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Retrieves a loan by its ID.
 * 
 * @param {string} id - The ID of the loan.
 * @returns {Promise<Object>} The loan object.
 * @throws {ObjectNotFound} If the loan with the specified ID does not exist.
 */
export const get_loan_by_id = async (id) => {
    const loan_exists = await loan_repository.find_loan_by_id(id);
    if(!loan_exists) {
        throw new ObjectNotFound("loan");
    }
    return loan_exists;
}
/**
 * Updates an existing loan with new information.
 * 
 * @param {string} id - The ID of the loan to update.
 * @param {Object} updates - The updates to apply to the loan.
 * @returns {Promise<Object>} The updated loan object.
 * @throws {ObjectNotFound} If the loan, user, or book is not found.
 * @throws {ObjectAlreadyExists} If a conflicting loan already exists.
 * @throws {LoanExceededMaxRenewals} If the renewal limit is exceeded.
 * @throws {ObjectNotAvailable} If the book is not available for loan.
 * @throws {ObjectMissingParameters} If the required parameters are missing.
 */
export const update_loan = async (id, updates) => { 
    if(!id) {
        throw new ObjectMissingParameters("loan");
    }
    const loan_exists_id = await loan_repository.find_loan_by_id(id);
    const user_exists = await user_repository.find_user_by_id(updates.user);
    const book_exists = await book_repository.find_book_by_id(updates.book);
    const loan_status_exists = await loan_status_repository.find_loan_status_by_id(updates.loan_status);

    const loan_exists_date = await loan_repository.find_loan_by_date(updates.book, updates.createdAt, updates.returned_date || updates.return_date);

    if(!loan_exists_id){
        throw new ObjectNotFound("loan");
    }
    if(!user_exists) {
        throw new ObjectNotFound("user");
    }
    if(!book_exists) {
        throw new ObjectNotFound("book");
    }        
    if(!loan_status_exists) {
        throw new ObjectNotFound("loan_status");
    }
    if( (loan_exists_date) && (loan_exists_date._id.toString() != id ) ) {
        throw new ObjectAlreadyExists("loan");
    }
    if(updates.renewals > app_config.LOAN_MAX_RENEWALS_PER_LOAN) {
        throw new LoanExceededMaxRenewals();
    }
    if(book_exists.book_status.book_status == "NOT AVAILABLE") {
        throw new ObjectNotAvailable("book")
    }
    return await loan_repository.update_loan(id, updates);
}
/**
 * Deletes a loan by its ID.
 * 
 * @param {string} id - The ID of the loan to delete.
 * @returns {void} A confirmation that the loan was deleted.
 * @throws {ObjectNotFound} If the loan with the specified ID does not exist.
 * @throws {ObjectMissingParameters} If the loan ID is missing.
 */
export const delete_loan = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("loan");
    }
    
    const loan_exists = await loan_repository.find_loan_by_id(id);

    if(!loan_exists){
        throw new ObjectNotFound("loan");
    }
    return await loan_repository.delete_loan(id);
}

/**
 * Approve loans.
 * 
 * @param {string} id - The ID of the loan to approve.
 * @returns {Promise<Object>} The updated loan with the new return date.
 * @throws {LoanAlreadyApproved} If the loan has already been approved.
 * @throws {LoanCannotBeApproved} If the loan status is not "PENDING".
 * @throws {ObjectNotFound} If the loan with the specified ID does not exist.
 */
export const approve_loan = async (id) => {
     if(!id) {
        throw new ObjectMissingParameters("loan");
    }
    const loan_exists = await loan_repository.find_loan_by_id(id);
    const loan_status_exists = await loan_status_repository.filter_loan_statuses({loan_status: 'ACTIVE'}, 0, 1);

    if(!loan_exists) {
        throw new ObjectNotFound("loan");
    }
    if(loan_exists.loan_status.loan_status == "ACTIVE") {
        throw new LoanAlreadyApproved();
    }
    if(loan_exists.loan_status.loan_status != "PENDING") {
        throw new LoanCannotBeApproved();
    }
    loan_exists.loan_status = loan_status_exists[0]._id;
    const updated_loan = await loan_repository.update_loan(id, loan_exists);
    return updated_loan;
}
/**
 * Requests a renewal for an existing loan.
 * 
 * @param {string} id - The ID of the loan to renew.
 * @returns {Promise<Object>} The updated loan with the new return date.
 * @throws {LoanExceededMaxRenewals} If the loan exceeds the maximum number of allowed renewals.
 * @throws {LoanAlreadyFinished} If the loan has already been finished.
 * @throws {ObjectNotFound} If the loan with the specified ID does not exist.
 * @throws {ObjectMissingParameters} If the loan ID is missing.
 * @throws {ObjectNotAvailable} If the book is not available for renewal.
 */
export const request_loan_renewal = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("loan");
    }
    const loan_exists = await loan_repository.find_loan_by_id(id);
    const loan_status_exists = await loan_status_repository.filter_loan_statuses({loan_status: 'RENEWED'}, 0, 1);
    if(!loan_exists) {
        throw new ObjectNotFound("loan");
    }
    if(loan_exists.returned_date || loan_exists.loan_status.loan_status == "FINISHED") {
        throw new LoanAlreadyFinished();
    }
    loan_exists.renewals += 1;
    if(loan_exists.renewals > app_config.LOAN_MAX_RENEWALS_PER_LOAN) {
        throw new LoanExceededMaxRenewals();
    }
    const date = new Date(loan_exists.return_date);
    date.setDate(date.getDate() + app_config.LOAN_MAX_RETURN_DAYS_AFTER_RENEWAL);
    return await loan_repository.update_loan(id, {
        "user": loan_exists.user,
        "book": loan_exists.book,
        "loan_status": loan_status_exists[0]._id,
        "return_date": date.toISOString(),
        "renewals": loan_exists.renewals
    });
}
/**
 * Marks a loan as finished by setting the return date and updating the book's status to "AVAILABLE".
 *
 * @param {string} id - The ID of the loan to finish.
 * @throws {ObjectMissingParameters} If the loan ID is missing.
 * @throws {ObjectNotFound} If the loan or associated book is not found.
 * @throws {LoanAlreadyFinished} If the loan has already been finished.
 * @returns {Object} The updated loan object.
 */
export const return_book = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("loan");
    }
    const loan_exists = await loan_repository.find_loan_by_id(id);
    const loan_status_exists = await loan_status_repository.filter_loan_statuses({loan_status: 'FINISHED'}, 0, 1);

    if(!loan_exists) {
        throw new ObjectNotFound("loan");
    }
    const book_exists = await book_repository.find_book_by_id(loan_exists.book);
    const available_book_status = await book_status_repository.filter_book_statuses({book_status: 'AVAILABLE'}, 0, 1);
    if(loan_exists.returned_date) {
        throw new LoanAlreadyFinished();
    }
    loan_exists.returned_date = new Date();
    loan_exists.loan_status = loan_status_exists[0]._id;
    book_exists.book_status = available_book_status[0]._id;
    const updated_loan = await loan_repository.update_loan(id, loan_exists);
    await book_repository.update_book(book_exists._id, book_exists);
    return updated_loan;
}