import { prisma } from "../../../utils/prisma";
import type { Prisma } from "@prisma/client";
import type { FlightOption } from "~/types/tripTypes";

export default defineEventHandler(async (event) => {
  const tripId = event.context.params?.tripId as string;
  if (!tripId)
    throw createError({ statusCode: 400, message: "Trip ID required" });

  const body = await readBody<FlightOption>(event);

  try {
    const flight = await prisma.flight.create({
      data: {
        tripId,
        airlineLabel: body.airline.label,
        airlineCode: body.airline.value,
        fromAirportLabel: body.fromAirport.label,
        fromAirportCode: body.fromAirport.value,
        toAirportLabel: body.toAirport.label,
        toAirportCode: body.toAirport.value,
        departureDate: new Date(body.departureDate).toDateString(),
        arrivalDate: new Date(body.arrivalDate).toDateString(),
        durationInAirMin: body.durationInAirMin,
        durationLayoversMin: body.durationLayoversMin,
        // Cast to Prisma.InputJsonValue to satisfy TS for JSON columns
        stopovers: (body.stopovers ?? []) as unknown as Prisma.InputJsonValue,
        travelClass: body.travelClass,
        baseFare: body.baseFare,
        extras: (body.extras ?? {}) as unknown as Prisma.InputJsonValue,
        currency: body.currency,
        totalCostEUR: body.totalCostEUR ?? 0,
      },
    });

    return flight;
  } catch (err) {
    console.error("Failed to create flight:", err);
    throw createError({ statusCode: 500, message: "Failed to create flight" });
  }
});
