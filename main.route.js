// Import router from express
import {Router} from 'express';
import { audit_log_router } from './src/audit_log/audit_log.route.js';
import { auth_router } from './src/auth/auth.route.js';
import { author_router } from './src/author/author.route.js';
import { book_router } from './src/book/book.route.js';
import { book_collection_router } from './src/book_collection/book_collection.route.js';
import { book_list_router } from './src/book_list/book_list.route.js';
import { book_status_router } from './src/book_status/book_status.route.js';
import { editorial_router } from './src/editorial/editorial.route.js';
import { fee_router } from './src/fee/fee.route.js';
import { fee_status_router } from './src/fee_status/fee_status.route.js';
import { fee_type_router } from './src/fee_type/fee_type.route.js';
import { gender_router } from './src/gender/gender.route.js';
import { import_router } from './src/import/import.route.js';
import { loan_router } from './src/loan/loan.route.js';
import { loan_status_router } from './src/loan_status/loan_status.route.js';
import { log_action_router } from './src/log_action/log_action.route.js';
import { plan_status_router } from './src/plan_status/plan_status.route.js';
import { role_router } from './src/role/role.route.js';
import { user_router } from './src/user/user.route.js';

// Create main router
const main_router = Router();

/* Public routes */
main_router.use('/auth/', auth_router);
main_router.use('/import/', import_router);
// Use routers
main_router.use('/audit_log/', audit_log_router);
main_router.use('/author/', author_router);
main_router.use('/book/', book_router);
main_router.use('/book_collection/', book_collection_router);
main_router.use('/book_list/', book_list_router);
main_router.use('/book_status/', book_status_router);
main_router.use('/editorial/', editorial_router);
main_router.use('/fee/', fee_router);
main_router.use('/fee_type/', fee_type_router);
main_router.use('/fee_status/', fee_status_router);
main_router.use('/gender/', gender_router);
main_router.use('/loan/', loan_router);
main_router.use('/loan/status/', loan_status_router);
main_router.use('/log_action/', log_action_router);
main_router.use('/plan_status/', plan_status_router);
main_router.use('/role/', role_router);
main_router.use('/user/', user_router);

// Export main router
export {main_router};