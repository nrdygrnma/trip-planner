/*
  Warnings:

  - You are about to drop the column `name` on the `Trip` table. All the data in the column will be lost.
  - Added the required column `currency` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "CarRentalOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tripId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "pickupDate" TEXT NOT NULL,
    "dropOffDate" TEXT NOT NULL,
    "pickupLocation" TEXT NOT NULL,
    "dropOffLocation" TEXT NOT NULL,
    "baseRate" REAL NOT NULL,
    "fees" REAL NOT NULL,
    "insurance" JSONB NOT NULL,
    "currency" TEXT NOT NULL,
    "totalCostEUR" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TripStop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tripId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "lat" REAL,
    "lng" REAL,
    "selectedAccommodationId" TEXT,
    CONSTRAINT "TripStop_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AccommodationOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tripStopId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "provider" TEXT,
    "roomType" TEXT,
    "pricePerNight" REAL NOT NULL,
    "currency" TEXT NOT NULL,
    "totalCostEUR" REAL,
    "url" TEXT
);

-- CreateTable
CREATE TABLE "_TripFlights" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_TripFlights_A_fkey" FOREIGN KEY ("A") REFERENCES "Flight" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TripFlights_B_fkey" FOREIGN KEY ("B") REFERENCES "Trip" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_TripCarRentals" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_TripCarRentals_A_fkey" FOREIGN KEY ("A") REFERENCES "CarRentalOption" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TripCarRentals_B_fkey" FOREIGN KEY ("B") REFERENCES "Trip" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_TripStopAccommodations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_TripStopAccommodations_A_fkey" FOREIGN KEY ("A") REFERENCES "AccommodationOption" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TripStopAccommodations_B_fkey" FOREIGN KEY ("B") REFERENCES "TripStop" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Flight" ("airlineCode", "airlineLabel", "arrivalDate", "baseFare", "createdAt", "currency", "departureDate", "extras", "fromAirportCode", "fromAirportLabel", "id", "stopsCount", "toAirportCode", "toAirportLabel", "totalCostEUR", "travelClass", "tripId", "updatedAt") SELECT "airlineCode", "airlineLabel", "arrivalDate", "baseFare", "createdAt", "currency", "departureDate", "extras", "fromAirportCode", "fromAirportLabel", "id", "stopsCount", "toAirportCode", "toAirportLabel", "totalCostEUR", "travelClass", "tripId", "updatedAt" FROM "Flight";
DROP TABLE "Flight";
ALTER TABLE "new_Flight" RENAME TO "Flight";
CREATE TABLE "new_Trip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "startDate" TEXT,
    "endDate" TEXT,
    "currency" TEXT NOT NULL,
    "people" INTEGER NOT NULL DEFAULT 1,
    "selectedFlightId" TEXT,
    "selectedCarRentalId" TEXT,
    "budgetEUR" REAL,
    "countryCode" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Trip" ("budgetEUR", "countryCode", "createdAt", "endDate", "id", "startDate", "updatedAt") SELECT "budgetEUR", "countryCode", "createdAt", "endDate", "id", "startDate", "updatedAt" FROM "Trip";
DROP TABLE "Trip";
ALTER TABLE "new_Trip" RENAME TO "Trip";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_TripFlights_AB_unique" ON "_TripFlights"("A", "B");

-- CreateIndex
CREATE INDEX "_TripFlights_B_index" ON "_TripFlights"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TripCarRentals_AB_unique" ON "_TripCarRentals"("A", "B");

-- CreateIndex
CREATE INDEX "_TripCarRentals_B_index" ON "_TripCarRentals"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TripStopAccommodations_AB_unique" ON "_TripStopAccommodations"("A", "B");

-- CreateIndex
CREATE INDEX "_TripStopAccommodations_B_index" ON "_TripStopAccommodations"("B");
