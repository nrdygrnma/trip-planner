-- CreateTable
CREATE TABLE "Flight" (
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
    "stopovers" JSONB,
    "travelClass" TEXT NOT NULL,
    "baseFare" REAL NOT NULL,
    "extras" JSONB,
    "currency" TEXT NOT NULL,
    "totalCostEUR" REAL
);
