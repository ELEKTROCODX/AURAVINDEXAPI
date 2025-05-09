import * as roles from '../default_db_data/role.js';
import * as genders from '../default_db_data/gender.js';
import * as book_statuses from '../default_db_data/book_status.js';
import * as book_collections from '../default_db_data/book_collection.js';
import * as users from '../default_db_data/user.js';
import * as log_actions from '../default_db_data/log_action.js';
import * as loan_statuses from '../default_db_data/loan_status.js';
import * as plan_statuses from '../default_db_data/plan_status.js';
import * as plans from '../default_db_data/plan.js';

import * as role_repository from '../role/role.repository.js';
import * as gender_repository from '../gender/gender.repository.js';
import * as book_status_repository from '../book_status/book_status.repository.js'
import * as book_collection_repository from '../book_collection/book_collection.repository.js';
import * as book_list_repository from '../book_list/book_list.repository.js';
import * as user_repository from '../user/user.repository.js';
import * as log_action_repository from '../log_action/log_action.repository.js';
import * as loan_status_repository from '../loan_status/loan_status.repository.js';
import * as plan_status_repository from '../plan_status/plan_status.repository.js';
import * as plan_repository from '../plan/plan.repository.js';

import { app_config } from '../config/app.config.js';
import { ImportingDefaultDataUnauthorized } from '../config/errors.js';

/**
 * Imports default data into the system if allowed.
 * 
 * This function checks whether importing default data is permitted (based on the `allow_importing_default_data` configuration).
 * If allowed, it sequentially imports roles, genders, book statuses, room statuses, book collections, room locations, and users from predefined datasets.
 * Existing entries in the database will not be duplicated.
 * 
 * @throws {ImportingDefaultDataUnauthorized} If importing default data is not allowed by the system configuration.
 * @returns {boolean} Returns `true` if the import is successful.
 */
export const import_default_data = async () => {
    if(app_config.allow_importing_default_data != 'true') {
        throw new ImportingDefaultDataUnauthorized();
    }
    console.log("Importing default data...\n");
    
    for (const role of roles.roles) {
        const exists = await role_repository.filter_roles({name: role.name});
        if(exists.length == 0) {
            console.log("Creating role: " + role.name);
            await role_repository.create_role(role);   
        } else {
            console.log("Role " + role.name + " already exists");
            
        }
    }
    console.log("Roles successfully imported.");

    for (const gender of genders.genders) {
        const exists = await gender_repository.filter_genders({name: gender.name});
        if(exists.length == 0) {
            console.log("Creating gender: " + gender.name);
            await gender_repository.create_gender(gender);   
        } else {
            console.log("Gender " + gender.name + " already exists");
            
        }
    }
    console.log("Genders successfully imported.");

    for (const book_status of book_statuses.book_statuses) {
        const exists = await book_status_repository.filter_book_statuses({book_status: book_status.book_status});
        if(exists.length == 0) {
            console.log("Creating book_status: " + book_status.book_status);
            await book_status_repository.create_book_status(book_status);   
        } else {
            console.log("Book statuses " + book_status.book_status + " already exists");
            
        }
    }
    console.log("Book statuses successfully imported.");

    for (const book_collection of book_collections.book_collections) {
        const exists = await book_collection_repository.filter_book_collections({name: book_collection.name});
        if(exists.length == 0) {
            console.log("Creating book collection: " + book_collection.name);
            await book_collection_repository.create_book_collection(book_collection);   
        } else {
            console.log("Book collection " + book_collection.name + " already exists");
            
        }
    }
    console.log("Book collections successfully imported.");

    for (const log_action of log_actions.log_actions) {
        const exists = await log_action_repository.filter_log_actions({action_code: log_action.action_code});
        if(exists.length == 0) {
            console.log("Creating log action: " + log_action.action_code);
            await log_action_repository.create_log_action(log_action);   
        } else {
            console.log("Log action " + log_action.action_code + " already exists");
            
        }
    }
    console.log("Log actions successfully imported.");

    for (const loan_status of loan_statuses.loan_statuses) {
        const exists = await loan_status_repository.filter_loan_statuses({loan_status: loan_status.loan_status});
        if(exists.length == 0) {
            console.log("Creating loan status: " + loan_status.loan_status);
            await loan_status_repository.create_loan_status(loan_status);   
        } else {
            console.log("Loan status " + loan_status.loan_status + " already exists");
            
        }
    }
    console.log("Loan statuses successfully imported.");

    for (const plan_status of plan_statuses.plan_statuses) {
        const exists = await plan_status_repository.filter_plan_statuses({plan_status: plan_status.plan_status});
        if(exists.length == 0) {
            console.log("Creating plan status: " + plan_status.plan_status);
            await plan_status_repository.create_plan_status(plan_status);   
        } else {
            console.log("Plan status " + plan_status.plan_status + " already exists");
            
        }
    }
    console.log("Plan statuses successfully imported.");

    for (const plan of plans.plans) {
        const exists = await plan_repository.filter_plans({name: plan.name});
        if(exists.length == 0) {
            console.log("Creating plan: " + plan.name);
            await plan_repository.create_plan(plan);   
        } else {
            console.log("Plan " + plan.name + " already exists");
            
        }
    }

    for (const user of users.users) {
        const exists = await user_repository.filter_users({email: user.email});
        if(exists.length == 0) {
            const gender_exists = await gender_repository.filter_genders({name: user.gender});
            const role_exists = await role_repository.filter_roles({name: user.role});
            const user_img = user.user_img ? user.user_img : app_config.DEFAULT_USER_IMG_PATH;
            user.user_img = user_img;
            user.gender = gender_exists[0]._id;
            user.role = role_exists[0]._id;
            
            console.log("Creating user: " + user.username);
            await user_repository.create_user(user);
            const user_data = await user_repository.filter_users({email: email}, 0, 10);
            await book_list_repository.create_book_list({title: 'Favorites', description: 'My favorite books.', owner: user_data[0]._id, books: []});
        } else {
            console.log("User " + user.username + " already exists");
            
        }
    }
    console.log("Users successfully imported.");

    return true;
}
