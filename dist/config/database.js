"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
exports.prisma = globalThis.__prisma ||
    new client_1.PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
if (process.env.NODE_ENV !== 'production') {
    globalThis.__prisma = exports.prisma;
}
// Graceful shutdown
process.on('beforeExit', async () => {
    console.log('🔌 Disconnecting from database...');
    await exports.prisma.$disconnect();
});
process.on('SIGINT', async () => {
    console.log('🔌 Disconnecting from database...');
    await exports.prisma.$disconnect();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log('🔌 Disconnecting from database...');
    await exports.prisma.$disconnect();
    process.exit(0);
});
//# sourceMappingURL=database.js.map