"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getUsers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getUsers = async () => {
    try {
        return await prisma.user.findMany();
    }
    catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users from database');
    }
};
exports.getUsers = getUsers;
const createUser = async (email, name) => {
    try {
        return await prisma.user.create({
            data: { email, name }
        });
    }
    catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user in database');
    }
};
exports.createUser = createUser;
//# sourceMappingURL=userService.js.map