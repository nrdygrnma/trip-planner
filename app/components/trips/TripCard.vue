<template>
  <UCard
    class="cursor-pointer hover:shadow-lg transition"
    @click="$emit('select', trip.id)"
  >
    <div class="flex flex-col gap-1 p-4">
      <h2 class="font-bold text-lg">{{ trip.title }}</h2>
      <p class="text-sm text-gray-500">
        {{ trip.startDate || "Start Date?" }} →
        {{ trip.endDate || "End Date?" }}
      </p>
      <p class="text-sm text-gray-500">People: {{ trip.people }}</p>
      <p class="text-sm text-gray-500">Flights: {{ trip.flights.length }}</p>
      <div v-if="isCurrent" class="text-green-500 font-bold mt-2">
        Current Trip
      </div>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
import type { Trip } from "~/types/tripTypes";

const props = defineProps<{
  trip: Trip;
  isCurrent?: boolean;
}>();

const emit = defineEmits<{
  (e: "select", tripId: string): void;
}>();
</script>
