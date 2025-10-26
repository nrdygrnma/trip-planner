<template>
  <div class="p-4 space-y-4 max-w-6xl mx-auto">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-light text-pink-600">Your Trips</h1>
      <UButton @click="showCreateTrip = true">+ Create Trip</UButton>
    </div>

    <TripModal v-model:open="showCreateTrip" />

    <TripsOverview />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import TripModal from "~/components/trips/TripModal.vue";
import TripsOverview from "~/components/trips/TripsOverview.vue";
import { useTripStore } from "~/stores/trip";

const showCreateTrip = ref(false);

const tripStore = useTripStore();

onMounted(async () => {
  tripStore.ensureDefaultTrip();
  tripStore.loadFromLocalStorage();
  if (tripStore.currentTripId) {
    await tripStore.loadFlights(tripStore.currentTripId);
  }
});
</script>
