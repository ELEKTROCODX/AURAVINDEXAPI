import { app_config } from "./app.config.js";
import { convert_string_cammel_case } from "./util.js";

export class ObjectNotFound extends Error {
    constructor(object_name){
        super(`${convert_string_cammel_case(object_name)} not found`);
        this.name = `${convert_string_cammel_case(object_name)}NotFound`;
    }
}

export class ObjectAlreadyExists extends Error {
    constructor(object_name){
        super(`${convert_string_cammel_case(object_name)} already exists`);
        this.name = `${convert_string_cammel_case(object_name)}AlreadyExists`;
    }
}

export class ObjectMissingParameters extends Error {
    constructor(object_name){
        super(`${convert_string_cammel_case(object_name)} is missing parameters`);
        this.name = `${convert_string_cammel_case(object_name)}MissingParameters`;
    }
}

export class ObjectInvalidQueryFilters extends Error {
    constructor(object_name){
        super(`${convert_string_cammel_case(object_name)}'s query is missing or contains invalid data`);
        this.name = `${convert_string_cammel_case(object_name)}InvalidQueryFilters`;
    }
}

export class ObjectNotAvailable extends Error {
    constructor(object_name){
        super(`${convert_string_cammel_case(object_name)} is not available`);
        this.name = `${convert_string_cammel_case(object_name)}NotAvailable`;
    }}

export class RoomPeopleUnauthorized extends Error {
    constructor() {
        super('The people are less than min required or more than max allowed');
        this.name = 'RoomPeopleUnauthorized';
    }
}

export class ReservationLongerThanAuthorized extends Error {
    constructor() {
        super(`The reservation cannot last more than ${app_config.RESERVATION_MAX_TIME_HOURS} hours`);
        this.name = 'ReservationLongerThanAuthorized';
    }
}

export class LoanExceededMaxRenewals extends Error {
    constructor() {
        super(`The loan has exceeded the ${app_config.LOAN_MAX_RENEWALS_PER_LOAN} authorized renewals`);
        this.name = 'LoanExceededMaxRenewals';
    }
}

export class LoanReturnDateExceedsMaxAllowedDays extends Error {
    constructor() {
        super(`The return date must be within ${app_config.LOAN_MAX_RETURN_DAYS} days`);
        this.name = 'LoanReturnDateExceedsMaxAllowedDays';
    }
}

export class LoanAlreadyFinished extends Error {
    constructor() {
        super('This book has already been returned and the loan has been finished');
        this.name = 'LoanAlreadyFinished';
    }
}
export class LoanAlreadyApproved extends Error {
    constructor() {
        super('This book has already been approved');
        this.name = 'LoanAlreadyApproved';
    }
}
export class LoanCannotBeApproved extends Error {
    constructor() {
        suoer('This book cannot be approved because it\'s status is not pending.');
        this.name = 'LoanCannotBeApproved';
    }
}
export class InvalidLogin extends Error {
    constructor() {
        super('Invalid email or password');
        this.name = 'InvalidLogin';
    }
}

export class InvalidPasswordReset extends Error {
    constructor() {
        super('Invalid password');
        this.name = 'InvalidPasswordReset';
    }
}

export class InvalidEmailValidation extends Error {
    constructor() {
        super('Invalid email');
        this.name = 'InvalidEmailValidation';
    }
}

export class ImportingDefaultDataUnauthorized extends Error {
    constructor() {
        super('Server currently does not allow importing default data');
        this.name = 'ImportingDefaultDataUnauthorized';
    }
}

export class FailedToSendEmail extends Error {
    constructor(email) {
        super(`Failed to send email to ${email}`);
        this.name = 'FailedToSendEmail';
    }
}

export class InvalidOrExpiredToken extends Error {
    constructor() {
        super('The token has expired or is invalid');
        this.name = 'InvalidOrExpiredToken';
    }
}

export class FinishDateBeforeStartDate extends Error {
    constructor() {
        super('Finish date cannot be before start date');
        this.name = 'FinishDateBeforeStartDate';
    }
}

export class DateInPast extends Error {
    constructor() {
        super('The date cannot be in the past');
        this.name = 'DateInPast';
    }
}

export class DateInFuture extends Error {
    constructor() {
        super('The date cannot be in the future');
        this.name = 'DateInFuture';
    }
}

export class ReservationOutsideWorkingHours extends Error {
    constructor() {
        super('The reservation must be within working hours.');
        this.name = "ReservationOutsideWorkingHours";
    }
}

export class ActivePlanAlreadyFinished extends Error {
    constructor() {
        super('This plan has already been finished.');
        this.name = 'ActivePlanAlreadyFinished';
    }
}
export class ActivePlanAlreadyCancelled extends Error {
    constructor() {
        super('This plan has already been cancelled.');
        this.name = 'ActivePlanAlreadyFinished';
    }
}

export class ExceededMaxBookLists extends Error {
    constructor() {
        super(`You cannot have more than ${app_config.USER_MAX_BOOK_LISTS} lists`);
        this.name = 'ExceededMaxBookLists';
    }
}

export class BookAlreadyInBookList extends Error {
    constructor() {
        super('This book is already in the list');
        this.name = 'BookAlreadyInBookList';
    }
}

export class ExceededMaxBooksPerList extends Error {
    constructor() {
        super(`You cannot have more than ${app_config.BOOK_LIST_MAX_BOOKS} books in a list`);
        this.name = 'ExceededMaxBooksPerList';
    }
}