/*
  Warnings:

  - Made the column `extras` on table `Flight` required. This step will fail if there are existing NULL values in that column.
  - Made the column `stopovers` on table `Flight` required. This step will fail if there are existing NULL values in that column.

*/
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
    "durationInAirMin" INTEGER NOT NULL,
    "durationLayoversMin" INTEGER NOT NULL,
    "stopovers" JSONB NOT NULL,
    "travelClass" TEXT NOT NULL,
    "baseFare" REAL NOT NULL,
    "extras" JSONB NOT NULL,
    "currency" TEXT NOT NULL,
    "totalCostEUR" REAL
);
INSERT INTO "new_Flight" ("airlineCode", "airlineLabel", "arrivalDate", "baseFare", "currency", "departureDate", "durationInAirMin", "durationLayoversMin", "extras", "fromAirportCode", "fromAirportLabel", "id", "stopovers", "toAirportCode", "toAirportLabel", "totalCostEUR", "travelClass", "tripId") SELECT "airlineCode", "airlineLabel", "arrivalDate", "baseFare", "currency", "departureDate", "durationInAirMin", "durationLayoversMin", "extras", "fromAirportCode", "fromAirportLabel", "id", "stopovers", "toAirportCode", "toAirportLabel", "totalCostEUR", "travelClass", "tripId" FROM "Flight";
DROP TABLE "Flight";
ALTER TABLE "new_Flight" RENAME TO "Flight";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
