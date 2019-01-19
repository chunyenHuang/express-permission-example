const permissiongMappings = require('./permissionMappings');

module.exports = {
    tokenMiddlewares,
    authMiddlewares,
};

function getAuthenticatedUser(inToken) {
    switch (inToken) {
        case 'admin-token':
            return {
                id: 'my-admin-id',
                email: 'admin@gmail.com',
                name: 'John Doe',
                role: 'admin',
            }
        case 'customer-token':
            return {
                id: 'my-user-id',
                email: 'user@gmail.com',
                name: 'John Doe',
                role: 'customer',
            }
        default:
            return null;
    };
}

function tokenMiddlewares(req, res, next) {
    // check auth token from headers or query
    const token = req.query.token;
    const user = getAuthenticatedUser(token);
    if (!user) {
        return res.status(401).json({
            message: 'Your token is invalid or has expired.'
        });
    }

    req.user = user;

    return next();
}

function authMiddlewares(inGatewayName) {
    return (req, res, next) => {
        const role = req.user.role;
        const permissionMapping = checkPermissionMapping(role, inGatewayName);

        if (!permissionMapping || permissionMapping.isDisabled) {
            return res.status(403).json({
                message: 'You are not authorized.'
            });
        }

        // filter the ownership if needed
        if (permissionMapping.ownOnly) {
            if (!req.params.id || req.params.id !== req.user.id) {
                return res.status(403).json({
                    message: 'You are not authorized to perform actions on this user.'
                });
            }
        }

        req.user.permission = Object.assign({
            role,
            gatewayName: inGatewayName,
            method: req.method,
            url: req.originalUrl,
        }, permissionMapping);

        next();
    };
}

function checkPermissionMapping(inRole, inGatewayName) {
    const mappedRole = permissiongMappings[inRole];
    if (!mappedRole) {
        return undefined;
    }
    const mapped = permissiongMappings[inRole][inGatewayName];
    return mapped;
}