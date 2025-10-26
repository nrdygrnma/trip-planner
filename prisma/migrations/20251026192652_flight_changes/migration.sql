/*
  Warnings:

  - You are about to drop the column `durationInAirMin` on the `Flight` table. All the data in the column will be lost.
  - You are about to drop the column `durationLayoversMin` on the `Flight` table. All the data in the column will be lost.
  - You are about to drop the column `stopovers` on the `Flight` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Flight` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "budgetEUR" REAL NOT NULL,
    "countryCode" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Flight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tripId" TEXT NOT NULL,
    "airlineLabel" TEXT NOT NULL,
    "airlineCode" TEXT NOT NULL,
    "fromAirportLabel" TEXT NOT NULL,
    "fromAirportCode" TEXT NOT NULL,
    "toAirportLabel" TEXT NOT NULL,
    "toAirportCode" TEXT NOT NULL,
    "departureDate" TEXT NOT NULL,
    "arrivalDate" TEXT NOT NULL,
    "stopsCount" INTEGER NOT NULL DEFAULT 0,
    "travelClass" TEXT NOT NULL,
    "baseFare" REAL NOT NULL,
    "extras" JSONB NOT NULL,
    "currency" TEXT NOT NULL,
    "totalCostEUR" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Flight_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Flight" ("airlineCode", "airlineLabel", "arrivalDate", "baseFare", "currency", "departureDate", "extras", "fromAirportCode", "fromAirportLabel", "id", "toAirportCode", "toAirportLabel", "totalCostEUR", "travelClass", "tripId") SELECT "airlineCode", "airlineLabel", "arrivalDate", "baseFare", "currency", "departureDate", "extras", "fromAirportCode", "fromAirportLabel", "id", "toAirportCode", "toAirportLabel", "totalCostEUR", "travelClass", "tripId" FROM "Flight";
DROP TABLE "Flight";
ALTER TABLE "new_Flight" RENAME TO "Flight";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
