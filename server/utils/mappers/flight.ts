import type { Flight as DbFlight, Prisma } from "@prisma/client";
import type { FlightExtras, FlightOption } from "~/types/tripTypes";

/**
 * Ensure dates are stored and returned as simple YYYY-MM-DD strings.
 */
export function asDateString(dateStr?: string): string {
  if (!dateStr) return "";
  const [y, m, d] = String(dateStr).split("-");
  if (y && m && d) return `${y}-${m}-${d}`;
  return String(dateStr);
}

/**
 * Normalize arbitrary JSON into a strongly-typed FlightExtras object.
 */
function normalizeExtras(raw: unknown): FlightExtras {
  const base: FlightExtras = {
    seatReservation: 0,
    checkedBaggage: 0,
    other: 0,
  };

  if (!raw || typeof raw !== "object") return base;
  const obj = raw as Record<string, unknown>;

  const toNum = (v: unknown) => {
    const n = typeof v === "string" ? Number(v) : (v as number);
    return Number.isFinite(n) ? (n as number) : 0;
  };

  return {
    seatReservation: toNum(obj.seatReservation),
    checkedBaggage: toNum(obj.checkedBaggage),
    other: toNum(obj.other),
  };
}

/**
 * Map a Prisma Flight row to a FlightOption object expected by the UI.
 */
export function mapDbToFlightOption(db: DbFlight): FlightOption {
  return {
    id: db.id,
    airline: { label: db.airlineLabel, value: db.airlineCode },
    fromAirport: { label: db.fromAirportLabel, value: db.fromAirportCode },
    toAirport: { label: db.toAirportLabel, value: db.toAirportCode },
    departureDate: db.departureDate || "",
    arrivalDate: db.arrivalDate || "",
    stopsCount: (db as any).stopsCount ?? 0,
    travelClass: db.travelClass as FlightOption["travelClass"],
    baseFare: db.baseFare ?? 0,
    extras: normalizeExtras(db.extras as unknown),
    currency: db.currency,
    totalCostEUR: (db.totalCostEUR ?? 0) || 0,
  };
}

/**
 * Helper to coerce arbitrary value into Prisma JSON input.
 */
export function toJsonInput(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}
