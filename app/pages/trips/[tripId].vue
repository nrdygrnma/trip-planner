<template>
  <div class="p-4 space-y-6">
    <h1 class="text-3xl font-semibold text-pink-600">
      Trip: {{ trip?.title }}
    </h1>

    <div class="flex gap-4 items-center">
      <div>
        <p><strong>Start Date:</strong> {{ trip?.startDate || "-" }}</p>
        <p><strong>End Date:</strong> {{ trip?.endDate || "-" }}</p>
        <p><strong>People:</strong> {{ trip?.people || "-" }}</p>
        <p><strong>Currency:</strong> {{ trip?.currency || "-" }}</p>
      </div>
      <UButton @click="openEditTripModal = true">Edit Trip</UButton>
    </div>

    <section>
      <FlightsTable :flights="trip?.flights || []" :tripId="tripId" />
    </section>

    <section>
      <h2 class="text-2xl font-medium">Car Rentals</h2>
      <UButton class="mb-2" @click="openCarModal = true"
        >Add Car Rental</UButton
      >
      <CarRentalsTable :cars="trip?.carRentals || []" :tripId="tripId" />
    </section>

    <section>
      <h2 class="text-2xl font-medium">Stops & Accommodations</h2>
      <UButton class="mb-2" @click="openStopModal = true">Add Stop</UButton>
      <StopsTable :stops="trip?.stops || []" :tripId="tripId" />
    </section>

    <!-- Modals -->
    <TripModal
      :open="openEditTripModal"
      :trip="trip"
      @update:open="openEditTripModal = $event"
    />
    <FlightModal
      :open="openFlightModal"
      :tripId="tripId"
      @update:open="openFlightModal = $event"
    />
    <AddCarModal
      :open="openCarModal"
      :tripId="tripId"
      @update:open="openCarModal = $event"
    />

    <AddStopModal
      :open="openStopModal"
      :tripId="tripId"
      @update:open="openStopModal = $event"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, defineComponent, ref } from "vue";
import { useRoute } from "vue-router";
import { useTripStore } from "~/stores/trip";
import TripModal from "~/components/trips/TripModal.vue";
import FlightModal from "~/components/flights/FlightModal.vue";
import FlightsTable from "~/components/flights/FlightsTable.vue";

const route = useRoute();
const tripStore = useTripStore();

const tripId = route.params.tripId as string;

const trip = computed(() => tripStore.trips[tripId]);

const AddCarModal = defineComponent({
  name: "AddCarModal",
  template: "<div />",
});

const AddStopModal = defineComponent({
  name: "AddStopModal",
  props: { open: Boolean, tripId: String },
  emits: ["update:open"],
  template: "<div />", // placeholder
});

const CarRentalsTable = defineComponent({
  name: "CarRentalsTable",
  template: "<div />",
});

const StopsTable = defineComponent({
  name: "StopsTable",
  template: "<div />",
});

// Modal state
const openEditTripModal = ref(false);
const openFlightModal = ref(false);
const openCarModal = ref(false);
const openStopModal = ref(false);
</script>
