const { PrismaClient } = require("@prisma/client");

const prismaClient = new PrismaClient();

module.exports = prismaClient;
