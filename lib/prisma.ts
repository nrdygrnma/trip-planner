// Browser-safe stub of Prisma client for Nuxt.
// This file previously imported `@prisma/client` directly, which caused Vite to
// include Prisma in the client bundle and fail at runtime (index-browser.js has
// no PrismaClient export). Server code should use `server/utils/prisma` instead.

// If anything imports this module on the client, it will just be `undefined`.
// On the server, prefer importing from `server/utils/prisma`.
const prisma: undefined = undefined;
export default prisma;
