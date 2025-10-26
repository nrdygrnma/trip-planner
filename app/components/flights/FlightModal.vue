<template>
  <UModal
    :description="isEdit ? 'Edit flight details' : 'Add a new flight'"
    :open="open"
    :title="isEdit ? 'Edit Flight' : 'Add Flight'"
    :ui="{ footer: 'justify-end' }"
    @update:open="$emit('update:open', $event)"
  >
    <template #body>
      <FlightOptionForm ref="formRef" :state="state" @submit="handleSubmit" />
    </template>

    <template #footer="{ close }" class="space-x-2">
      <UButton
        :label="isEdit ? 'Save Changes' : 'Add Flight'"
        @click="handleSubmit"
      />
      <UButton label="Cancel" variant="outline" @click="closeModal" />
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import { computed, reactive, watch } from "vue";
import { v4 as uuidv4 } from "uuid";
import { toast } from "vue-sonner";
import FlightOptionForm from "./FlightOptionForm.vue";
import type { FlightOption } from "~/types/tripTypes";
import { useTripStore } from "~/stores/trip";

const props = defineProps<{
  open: boolean;
  flight?: FlightOption;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
}>();

const formRef = ref<InstanceType<typeof FlightOptionForm> | null>(null);
const tripStore = useTripStore();

const isEdit = computed(() => !!props.flight);

const getFlightState = (flight?: FlightOption): FlightOption => ({
  id: flight?.id || uuidv4(),
  provider: flight?.airline || "",
  from: flight?.from || "",
  to: flight?.to || "",
  departureDate: flight?.departureDate || "",
  arrivalDate: flight?.arrivalDate || "",
  durationInAirMin: flight?.durationInAirMin ?? 0,
  durationLayoversMin: flight?.durationLayoversMin ?? 0,
  stopovers:
    flight?.stopovers?.map((s) => ({
      airport: s.airport || "",
      durationMin: s.durationMin ?? 0,
    })) || [],
  travelClass: flight?.travelClass || "economy",
  baseFare: flight?.baseFare ?? 0,
  extras: {
    seatReservation: flight?.extras?.seatReservation ?? 0,
    checkedBaggage: flight?.extras?.checkedBaggage ?? 0,
    other: flight?.extras?.other ?? 0,
  },
  currency: flight?.currency || "EUR",
});

const state = reactive<FlightOption>(getFlightState(props.flight));

const handleSubmit = () => {
  const tripId = tripStore.currentTripId;
  if (!tripId) {
    toast.error("No current trip selected");
    return;
  }

  if (isEdit.value) {
    tripStore.updateFlight(tripId, { ...state });
    toast.success("Flight updated successfully");
  } else {
    tripStore.addFlight(tripId, { ...state });
    toast.success("Flight added successfully");
  }

  closeModal();
};
const closeModal = () => emit("update:open", false);

watch(
  () => props.flight,
  (flight) => {
    Object.assign(state, getFlightState(flight));
  },
  { immediate: true },
);
</script>
