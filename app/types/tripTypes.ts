export interface Trip {
  id: string;
  title: string;
  startDate: string | undefined;
  endDate: string | undefined;
  currency: string;
  people: number;
  selectedFlightId?: string;
  selectedCarRentalId?: string;
  stops: TripStop[];
  flights: FlightOption[];
  carRentals: CarRentalOption[];
}

export interface Stopover {
  airport: string;
  durationMin?: number;
}

export interface FlightOption {
  id: string;
  provider: string;
  from: string;
  to: string;
  departureDateTime: string;
  arrivalDateTime: string;
  durationInAirMin: number;
  durationLayoversMin: number;
  stopovers: Stopover[];
  class: "economy" | "premium_economy" | "business";
  baseFare: number;
  extras: {
    seatReservation: number;
    checkedBaggage: number;
    other: number;
  };
  currency: string;
  totalCostEUR?: number;
}

export interface CarRentalOption {
  id: string;
  company: string;
  type: string;
  pickupDate: string;
  dropOffDate: string;
  pickupLocation: string;
  dropOffLocation: string;
  baseRate: number;
  fees: number;
  insurance: {
    mandatory: number;
    optional?: number;
  };
  currency: string;
  totalCostEUR?: number;
}

export interface TripStop {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  lat?: number;
  lng?: number;
  accommodations: AccommodationOption[];
  selectedAccommodationId?: string;
}

export interface AccommodationOption {
  id: string;
  title: string;
  provider?: string;
  roomType?: string;
  pricePerNight: number;
  currency: string;
  totalCostEUR?: number;
  url?: string;
}
