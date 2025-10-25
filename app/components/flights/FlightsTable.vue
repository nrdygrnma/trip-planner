<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold">Flights</h2>
      <UButton label="Add Flight" @click="openAddFlightModal" />
    </div>

    <table class="w-full table-auto border border-gray-200">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-2 text-left">Airline</th>
          <th class="p-2 text-left">From → To</th>
          <th class="p-2 text-left">Departure</th>
          <th class="p-2 text-left">Arrival</th>
          <th class="p-2 text-left">Class</th>
          <th class="p-2 text-left">Base Fare</th>
          <th class="p-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="flight in flights"
          :key="flight.id"
          class="border-t border-gray-200 hover:bg-gray-50"
        >
          <td class="p-2">{{ flight.provider }}</td>
          <td class="p-2">{{ flight.from }} → {{ flight.to }}</td>
          <td class="p-2">{{ formatDateTime(flight.departureDateTime) }}</td>
          <td class="p-2">{{ formatDateTime(flight.arrivalDateTime) }}</td>
          <td class="p-2 capitalize">{{ flight.class }}</td>
          <td class="p-2">{{ flight.baseFare }} {{ flight.currency }}</td>
          <td class="p-2 flex gap-2">
            <UButton
              label="Edit"
              size="sm"
              @click="openEditFlightModal(flight)"
            />
            <UButton
              color="error"
              label="Delete"
              size="sm"
              variant="outline"
              @click="deleteFlight(flight.id)"
            />
          </td>
        </tr>
        <tr v-if="flights.length === 0">
          <td class="p-4 text-center" colspan="7">No flights added yet.</td>
        </tr>
      </tbody>
    </table>

    <!-- Flight Modal for Add/Edit -->
    <FlightModal
      :flight="editingFlight"
      :open="modalOpen"
      @submit="handleFlightSubmit"
      @update:open="modalOpen = $event"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useTripStore } from "~/stores/trip";
import type { FlightOption } from "~/types/tripTypes";
import FlightModal from "./FlightModal.vue";
import { toast } from "vue-sonner";

const tripStore = useTripStore();

const modalOpen = ref(false);
const editingFlight = ref<FlightOption | undefined>(undefined);

const flights = computed(() => {
  const trip = tripStore.selectedTrip;
  return trip?.flights ?? [];
});

const openAddFlightModal = () => {
  editingFlight.value = undefined;
  modalOpen.value = true;
};

const openEditFlightModal = (flight: FlightOption) => {
  editingFlight.value = { ...flight };
  modalOpen.value = true;
};

const deleteFlight = (flightId: string) => {
  const tripId = tripStore.currentTripId;
  if (!tripId) return;
  tripStore.deleteFlight(tripId, flightId);
  toast.success("Flight deleted successfully");
};

const handleFlightSubmit = (flight: FlightOption) => {
  const tripId = tripStore.currentTripId;
  if (!tripId) return;

  const exists = flights.value.some((f) => f.id === flight.id);
  if (exists) {
    tripStore.updateFlight(tripId, flight);
    toast.success("Flight updated successfully");
  } else {
    tripStore.addFlight(tripId, flight);
    toast.success("Flight added successfully");
  }

  modalOpen.value = false;
};

const formatDateTime = (datetime: string) => {
  return new Date(datetime).toLocaleString();
};
</script>
