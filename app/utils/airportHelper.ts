import type { Airport } from "~/types/tripTypes";
import { airports } from "~/data/airports";

export interface SelectableAirport {
  label: string;
  value: string;
}

/**
 * Normalizes an airport object (either Airport from API or {label,value})
 * to the format { label: string, value: string } used in selects.
 * If undefined, defaults to the first airport in the list.
 */
export const normalizeAirport = (
  a?: Airport | SelectableAirport,
): SelectableAirport => {
  const defaultAirport = airports[0] ?? {
    code: "UNKNOWN",
    name: "Unknown Airport",
  };

  if (!a) return { label: defaultAirport.name, value: defaultAirport.code };
  if ("code" in a && "name" in a) return { label: a.name, value: a.code };
  return a;
};
