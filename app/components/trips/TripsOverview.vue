<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
  >
    <NuxtLink
      v-for="trip in trips"
      :key="trip.id"
      :to="`/trips/${trip.id}`"
      class="block"
    >
      <TripCard
        :isCurrent="trip.id === tripStore.currentTripId"
        :trip="trip"
        @select="selectTrip"
      />
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import TripCard from "./TripCard.vue";
import { useTripStore } from "~/stores/trip";

const tripStore = useTripStore();
const trips = computed(() => Object.values(tripStore.trips));
const selectTrip = (tripId: string) => {
  tripStore.selectTrip(tripId);
};
</script>
