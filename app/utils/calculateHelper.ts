import type { FlightOption } from "~/types/tripTypes";

export function calculateTotalCost(flight: FlightOption): number {
  // Base fare
  let total = flight.baseFare ?? 0;

  // Extras
  if (flight.extras) {
    total += flight.extras.seatReservation ?? 0;
    total += flight.extras.checkedBaggage ?? 0;
    total += flight.extras.other ?? 0;
  }

  // Round to 2 decimal places just in case
  return Math.round(total * 100) / 100;
}
