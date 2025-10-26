/*
  Warnings:

  - You are about to drop the column `budgetEUR` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `countryCode` on the `Trip` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Trip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "startDate" TEXT,
    "endDate" TEXT,
    "currency" TEXT NOT NULL,
    "people" INTEGER NOT NULL DEFAULT 1,
    "totalCostEUR" REAL,
    "selectedFlightId" TEXT,
    "selectedCarRentalId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Trip" ("createdAt", "currency", "endDate", "id", "people", "selectedCarRentalId", "selectedFlightId", "startDate", "title", "updatedAt") SELECT "createdAt", "currency", "endDate", "id", "people", "selectedCarRentalId", "selectedFlightId", "startDate", "title", "updatedAt" FROM "Trip";
DROP TABLE "Trip";
ALTER TABLE "new_Trip" RENAME TO "Trip";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
