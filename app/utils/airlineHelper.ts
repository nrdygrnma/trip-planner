import type { Airline } from "~/types/tripTypes";
import { airlines } from "~/data/airlines";

export const normalizeAirline = (
  a?: Airline | SelectableAirline,
): SelectableAirline => {
  const defaultAirline = airlines[0] ?? {
    code: "UNKNOWN",
    name: "Unknown Airline",
  };

  if (!a) return { label: defaultAirline.name, value: defaultAirline.code };
  if ("code" in a && "name" in a) return { label: a.name, value: a.code };
  return a;
};
