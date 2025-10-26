import { prisma } from "../../../utils/prisma";
import type { FlightOption } from "~/types/tripTypes";
import {
  asDateString,
  mapDbToFlightOption,
  toJsonInput,
} from "../../../utils/mappers/flight";
import { calculateTotalCost } from "~/utils/calculateHelper";

export default defineEventHandler(async (event) => {
  const tripId = event.context.params?.tripId as string;
  if (!tripId)
    throw createError({ statusCode: 400, message: "Trip ID required" });

  const body = await readBody<FlightOption>(event);
  if (!body)
    throw createError({ statusCode: 400, message: "Missing request body" });
  if (
    !body.airline?.label ||
    !body.fromAirport?.label ||
    !body.toAirport?.label
  ) {
    throw createError({
      statusCode: 400,
      message: "Missing required flight fields",
    });
  }

  const totalCost = calculateTotalCost(body);

  try {
    const created = await prisma.flight.create({
      data: {
        tripId,
        airlineLabel: body.airline.label,
        airlineCode: body.airline.value,
        fromAirportLabel: body.fromAirport.label,
        fromAirportCode: body.fromAirport.value,
        toAirportLabel: body.toAirport.label,
        toAirportCode: body.toAirport.value,
        departureDate: asDateString(body.departureDate),
        arrivalDate: asDateString(body.arrivalDate),
        stopsCount: (body as any).stopsCount ?? 0,
        travelClass: body.travelClass,
        baseFare: body.baseFare,
        extras: toJsonInput(body.extras ?? {}),
        currency: body.currency,
        totalCostEUR: totalCost,
      },
    });

    // Return in the shape the frontend expects (FlightOption)
    return mapDbToFlightOption(created);
  } catch (err) {
    console.error("Failed to create flight:", err);
    throw createError({ statusCode: 500, message: "Failed to create flight" });
  }
});
