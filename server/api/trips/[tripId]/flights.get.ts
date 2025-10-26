import { prisma } from "../../../utils/prisma";
import type { FlightExtras, FlightOption } from "~/types/tripTypes";

export default defineEventHandler(async (event) => {
  const tripId = event.context.params?.tripId;
  if (!tripId)
    throw createError({ statusCode: 400, message: "Trip ID missing" });

  const flights = await prisma.flight.findMany({
    where: { tripId },
  });

  const mapExtras = (value: unknown): FlightExtras => {
    if (
      value &&
      typeof value === "object" &&
      "seatReservation" in value &&
      "checkedBaggage" in value &&
      "other" in value
    ) {
      return value as FlightExtras;
    }
    return { seatReservation: 0, checkedBaggage: 0, other: 0 };
  };

  const result: FlightOption[] = flights.map((f: any) => ({
    id: f.id,
    airline: { label: f.airlineLabel, value: f.airlineCode },
    fromAirport: { label: f.fromAirportLabel, value: f.fromAirportCode },
    toAirport: { label: f.toAirportLabel, value: f.toAirportCode },
    departureDate: f.departureDate,
    arrivalDate: f.arrivalDate,
    stopsCount: f.stopsCount,
    travelClass: f.travelClass as FlightOption["travelClass"],
    baseFare: f.baseFare,
    extras: mapExtras(f.extras),
    currency: f.currency,
    totalCostEUR: f.totalCostEUR ?? 0,
  }));

  return result;
});
