// Browser-only shim for `@prisma/client/index-browser` so Vite/Nuxt don't error
// when something (directly or indirectly) imports Prisma on the client.
// This file provides the named exports expected by code that would normally
// import from `@prisma/client`, but throws if actually constructed/used.

export class PrismaClient {
  constructor(..._args: any[]) {
    throw new Error(
      "PrismaClient cannot be used in the browser. Import it only in server code."
    );
  }
}

// Minimal placeholder for the `Prisma` namespace some code may import.
export const Prisma: Record<string, unknown> = {};
