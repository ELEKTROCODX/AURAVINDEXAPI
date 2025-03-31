// Import router from express
import {Router} from 'express';
import { alert_router } from './src/alert/alert.route.js';
import { alert_type_router } from './src/alert_type/alert_type.route.js';
import { audit_log_router } from './src/audit_log/audit_log.route.js';
import { auth_router } from './src/auth/auth.route.js';
import { author_router } from './src/author/author.route.js';
import { book_router } from './src/book/book.route.js';
import { book_collection_router } from './src/book_collection/book_collection.route.js';
import { book_list_router } from './src/book_list/book_list.route.js';
import { book_status_router } from './src/book_status/book_status.route.js';
import { editorial_router } from './src/editorial/editorial.route.js';
import { equipment_router } from './src/equipment/equipment.route.js';
import { fee_router } from './src/fee/fee.route.js';
import { fee_status_router } from './src/fee_status/fee_status.route.js';
import { fee_type_router } from './src/fee_type/fee_type.route.js';
import { gender_router } from './src/gender/gender.route.js';
import { loan_router } from './src/loan/loan.route.js';
import { log_action_router } from './src/log_action/log_action.route.js';
import { reservation_router } from './src/reservation/reservation.route.js';
import { role_router } from './src/role/role.route.js';
import { room_router } from './src/room/room.route.js';
import { room_location_router } from './src/room_location/room_location.route.js';
import { room_status_router } from './src/room_status/room_status.route.js';
import { user_router } from './src/user/user.route.js';
import { import_router } from './src/import/import.route.js';

// Create main router
const main_router = Router();

/* Public routes */
main_router.use('/auth/', auth_router);
main_router.use('/import/', import_router);
// Use routers
main_router.use('/alert/', alert_router);
main_router.use('/alert_type/', alert_type_router);
main_router.use('/audit_log/', audit_log_router);
main_router.use('/author/', author_router);
main_router.use('/book/', book_router);
main_router.use('/book_collection/', book_collection_router);
main_router.use('/book_list/', book_list_router);
main_router.use('/book_status/', book_status_router);
main_router.use('/editorial/', editorial_router);
main_router.use('/equipment/', equipment_router);
main_router.use('/fee/', fee_router);
main_router.use('/fee_type/', fee_type_router);
main_router.use('/fee_status/', fee_status_router);
main_router.use('/gender/', gender_router);
main_router.use('/loan/', loan_router);
main_router.use('/log_action/', log_action_router);
main_router.use('/reservation/', reservation_router);
main_router.use('/role/', role_router);
main_router.use('/room/', room_router);
main_router.use('/room_location/', room_location_router);
main_router.use('/room_status/', room_status_router);
main_router.use('/user/', user_router);

// Export main router
export {main_router};