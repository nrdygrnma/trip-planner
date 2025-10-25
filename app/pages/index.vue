<template>
  <div>
    <h1 class="text-3xl font-light text-pink-600">Trip Planner</h1>
    <div class="mt-12">
      <FlightOptionForm />
    </div>
  </div>
</template>

<script lang="ts" setup>
import FlightOptionForm from "~/components/flights/FlightOptionForm.vue";
</script>
