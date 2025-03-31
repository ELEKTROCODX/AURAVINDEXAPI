import { app_config } from "../config/app.config.js";
import * as user_repository from '../user/user.repository.js';
import * as util from '../config/util.js';

export const validate_permission = (required_permission) => {
    return async (req, res, next) => {
        try {
            const user = await user_repository.find_user_by_id(req.user.id);
            if(!user.role.permissions.includes(required_permission)) {
                return res.status(403).json({message: 'Insufficient permissions'});
            };
            next();
        } catch (error) {
            return res.status(500).json({message: 'Error validating permissions', error: error.message});
        }
    };
}