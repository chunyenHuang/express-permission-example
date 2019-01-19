const permissiongMappings = {
    admin: {
        USET_GET: true,
        USER_CREATE: true,
        USET_DELETE: true,
    },
    customer: {
        USET_GET: {
            ownOnly: true,
            isDisabled: false,
            // conditionally permission
        },
    }
};

module.exports = permissiongMappings;