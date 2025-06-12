import { app_config } from '../config/app.config.js';
import { ObjectNotFound, ObjectAlreadyExists, ObjectMissingParameters, LoanExceededMaxRenewals, ObjectNotAvailable, ObjectInvalidQueryFilters, ImportingDefaultDataUnauthorized } from '../config/errors.js';
import * as import_service from './import.service.js';
import * as audit_log_service from '../audit_log/audit_log.service.js';
import { apiLogger } from '../config/util.js';
/**
 * Handles the request to import default data.
 * 
 * This function calls the `import_default_data` service function to import predefined data such as roles, genders, book statuses, room statuses, book collections, room locations, and users.
 * If the import operation is successful, a 201 status is returned with a success message.
 * If the user is unauthorized, a 401 status is returned with the error message. For other errors, a 500 status is returned.
 * 
 * @param {Object} req The request object containing the necessary data for the import.
 * @param {Object} res The response object used to send the status and message.
 * @returns {void}
 */
export const import_default_data = async (req, res) => {
    try {
        await import_service.import_default_data();
        await audit_log_service.create_new_audit_log(null, app_config.PERMISSIONS.IMPORT_DEFAULT_DATA, 'DATABASE');
        res.status(201).json({message: 'Default data has been successfully imported'});
        apiLogger.info('Default data imported successfully');
    } catch (error) {
        if(error instanceof ImportingDefaultDataUnauthorized) {
            return res.status(401).json({message: error.message});
        }
        // Internal error
        apiLogger.error('Error importing default data: ', error.message);
        res.status(500).json({message: 'Error importing default data', error: error.message});
        
    }
}