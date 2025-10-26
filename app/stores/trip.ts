import type {
  AccommodationOption,
  CarRentalOption,
  FlightOption,
  Trip,
  TripStop,
} from "~/types/tripTypes";

const currencyRates: Record<string, number> = {
  EUR: 1,
  USD: 0.86,
};

export const useTripStore = defineStore("trip", () => {
  // --- State ---
  const trips = ref<Record<string, Trip>>({});
  const currentTripId = ref<string | null>(null);

  // --- Actions ---
  function ensureDefaultTrip() {
    if (!currentTripId.value || Object.keys(trips.value).length === 0) {
      const defaultId = "default-trip";
      trips.value[defaultId] = {
        id: defaultId,
        title: "Costa Rica 2026",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        people: 1,
        currency: "EUR",
        flights: [],
        carRentals: [],
        stops: [],
        selectedFlightId: "",
        selectedCarRentalId: "",
      };
      currentTripId.value = defaultId;
      persistToLocalStorage();
    }
  }

  function createTrip(trip: Trip) {
    trips.value[trip.id] = trip;
    currentTripId.value = trip.id;
    persistToLocalStorage();
  }

  function deleteTrip(tripId: string) {
    delete trips.value[tripId];
    if (currentTripId.value === tripId) currentTripId.value = null;
    persistToLocalStorage();
  }

  function updateTrip(updatedTrip: Trip) {
    trips.value[updatedTrip.id] = updatedTrip;
    persistToLocalStorage();
  }

  function selectTrip(tripId: string) {
    if (!trips.value[tripId]) return;
    currentTripId.value = tripId;
    persistToLocalStorage();
    console.log("Trip selected:", tripId);
  }

  // Flights
  async function addFlight(tripId: string, flight: FlightOption) {
    const { data, error } = await useFetch<FlightOption>(
      `/api/trips/${tripId}/flights`,
      {
        method: "POST",
        body: flight,
      },
    );

    if (error.value) {
      console.error("Failed to add flight:", error.value);
      return;
    }

    if (data.value) {
      trips.value[tripId]!.flights.push(data.value);
    }
  }

  function updateFlight(tripId: string, flight: FlightOption) {
    const index = trips.value[tripId]!.flights.findIndex(
      (f: FlightOption) => f.id === flight.id,
    );
    if (index !== -1) trips.value[tripId]!.flights[index] = flight;
    persistToLocalStorage();
  }

  function deleteFlight(tripId: string, flightId: string) {
    trips.value[tripId]!.flights = trips.value[tripId]!.flights.filter(
      (f: FlightOption) => f.id !== flightId,
    );
    persistToLocalStorage();
  }

  function selectFlight(tripId: string, flightId: string) {
    trips.value[flightId]!.selectedFlightId = flightId;
    persistToLocalStorage();
  }

  // Car Rentals
  function addCarRental(tripId: string, car: CarRentalOption) {
    trips.value[tripId]!.carRentals.push(car);
    persistToLocalStorage();
  }

  function selectCarRental(tripId: string, carId: string) {
    trips.value[tripId]!.selectedCarRentalId = carId;
    persistToLocalStorage();
  }

  // Stops & Accommodations
  function addStop(tripId: string, stop: TripStop) {
    trips.value[tripId]!.stops.push(stop);
    persistToLocalStorage();
  }

  function addAccommodation(
    tripId: string,
    stopId: string,
    accommodation: AccommodationOption,
  ) {
    const stop = trips.value[tripId]!.stops.find(
      (stop: TripStop) => stop.id === stopId,
    );
    if (!stop) return;
    stop.accommodations.push(accommodation);
    persistToLocalStorage();
  }

  function selectAccommodation(
    tripId: string,
    stopId: string,
    accommodationId: string,
  ) {
    const stop = trips.value[tripId]!.stops.find(
      (stop: TripStop) => stop.id === stopId,
    );
    if (!stop) return;
    stop.selectedAccommodationId = accommodationId;
    persistToLocalStorage();
  }

  // Persistence
  function persistToLocalStorage() {
    localStorage.setItem("trips", JSON.stringify(trips.value));
    localStorage.setItem("currentTripId", currentTripId.value ?? "");
  }

  function loadFromLocalStorage() {
    const tripsData = localStorage.getItem("trips");
    if (tripsData) trips.value = JSON.parse(tripsData);
    const storedCurrent = localStorage.getItem("currentTripId");
    currentTripId.value = storedCurrent || null;
    ensureDefaultTrip();
  }

  // Currency conversion helper
  function convertToEUR(amount: number, currency: string) {
    return Math.round(amount * (currencyRates[currency] ?? 1) * 100) / 100;
  }

  // --- Getters ---
  const selectedTrip = computed(() => {
    if (!currentTripId.value) return null;
    return trips.value[currentTripId.value] ?? null;
  });

  const tripCostSummary = computed(() => {
    const trip = selectedTrip.value;
    if (!trip) return null;

    // Flight
    const flight = trip.flights.find(
      (f: FlightOption) => f.id === trip.selectedFlightId,
    );
    const flightCostEUR = flight
      ? convertToEUR(
          flight.baseFare +
            (flight.extras!.seatReservation || 0) +
            (flight.extras!.checkedBaggage || 0) +
            (flight.extras!.other || 0),
          flight.currency,
        )
      : 0;

    // Car Rental
    const car = trip.carRentals.find(
      (c: CarRentalOption) => c.id === trip.selectedCarRentalId,
    );
    const carCostEUR = car
      ? convertToEUR(
          car.baseRate +
            car.fees +
            (car.insurance.mandatory || 0) +
            (car.insurance.optional || 0),
          car.currency,
        )
      : 0;

    // Accommodations
    let accommodationCostEUR = 0;
    trip.stops.forEach((stop: TripStop) => {
      const sel = stop.accommodations.find(
        (a: AccommodationOption) => a.id === stop.selectedAccommodationId,
      );
      if (sel) {
        const nights =
          (new Date(stop.endDate).getTime() -
            new Date(stop.startDate).getTime()) /
          (1000 * 60 * 60 * 24);
        accommodationCostEUR += convertToEUR(
          sel.pricePerNight * nights,
          sel.currency,
        );
      }
    });

    const totalEUR = flightCostEUR + carCostEUR + accommodationCostEUR;
    const perPersonEUR = trip.people ? totalEUR / trip.people : totalEUR;

    return {
      flightCostEUR,
      carCostEUR,
      accommodationCostEUR,
      totalEUR,
      perPersonEUR,
    };
  });

  return {
    trips,
    currentTripId,
    ensureDefaultTrip,
    createTrip,
    deleteTrip,
    updateTrip,
    selectTrip,
    addFlight,
    updateFlight,
    deleteFlight,
    selectFlight,
    addCarRental,
    selectCarRental,
    addStop,
    addAccommodation,
    selectAccommodation,
    persistToLocalStorage,
    loadFromLocalStorage,
    convertToEUR,
    selectedTrip,
    tripCostSummary,
  };
});
