import { AuthorizationError } from "../utils/customError.js";

export const authorizeRoles = (...allowedRoles) => {
    return (req, _, next) => {
        if (req.user.status === 'inactive') {
            throw new AuthorizationError('Your account is inactive. Please contact an admin.');
        }

        if (!allowedRoles.includes(req.user.role)) {
            throw new AuthorizationError(`Role (${req.user.role}) is not allowed to access this resource`);
        }
        next();
    }
}