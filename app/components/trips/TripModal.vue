<template>
  <UModal
    :description="
      mode === 'edit'
        ? 'Update the trip details'
        : 'Provide the information for the new trip'
    "
    :open="open"
    :title="mode === 'edit' ? 'Edit Trip' : 'Create New Trip'"
    :ui="{ footer: 'justify-end' }"
    @update:open="$emit('update:open', $event)"
  >
    <template #body>
      <UForm
        ref="formRef"
        :schema="tripSchema"
        :state="tripState"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Trip Name" name="title">
          <UInput
            v-model="tripState.title"
            class="w-full"
            placeholder="Enter trip name"
          />
        </UFormField>

        <div class="flex gap-4">
          <UFormField class="w-1/2" label="Start Date" name="startDate">
            <UInput v-model="tripState.startDate" class="w-full" type="date" />
          </UFormField>
          <UFormField class="w-1/2" label="End Date" name="endDate">
            <UInput v-model="tripState.endDate" class="w-full" type="date" />
          </UFormField>
        </div>

        <div class="flex gap-4">
          <UFormField class="w-1/2" label="Number of People" name="people">
            <UInput v-model.number="tripState.people" min="1" type="number" />
          </UFormField>
          <UFormField class="w-1/2" label="Currency" name="currency">
            <USelect
              v-model="tripState.currency"
              :items="currencyItems"
              class="w-full"
            />
          </UFormField>
        </div>
      </UForm>
    </template>
    <template #footer="{ close }" class="space-x-2">
      <UButton
        :label="mode === 'edit' ? 'Save' : 'Create'"
        @click="submitForm"
      />
      <UButton label="Cancel" variant="outline" @click="closeModal" />
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import { useTripStore } from "~/stores/trip";
import { v4 as uuidv4 } from "uuid";
import { toast } from "vue-sonner";
import type { UForm } from "#components";
import type { Trip } from "~/types/tripTypes";

const props = defineProps<{
  open: boolean;
  trip?: Trip | null;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
}>();

const tripStore = useTripStore();
const formRef = ref<any>();

const currencyItems = ref([
  { label: "Euro (EUR)", value: "EUR" },
  { label: "US Dollar (USD)", value: "USD" },
]);

const tripSchema = z.object({
  title: z.string().min(1, "Trip name is required"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  people: z.number().int().positive("At least 1 person"),
  currency: z.string().min(1),
});

type TripForm = z.output<typeof tripSchema>;

const tripState = reactive<Partial<TripForm>>({
  title: "",
  startDate: "",
  endDate: "",
  people: 1,
  currency: "EUR",
});

const mode = computed(() => (props.trip ? "edit" : "create"));

watch(
  () => props.trip,
  (trip) => {
    if (trip) {
      tripState.title = trip.title;
      tripState.startDate = trip.startDate;
      tripState.endDate = trip.endDate;
      tripState.people = trip.people;
      tripState.currency = trip.currency;
    } else {
      tripState.title = "";
      tripState.startDate = "";
      tripState.endDate = "";
      tripState.people = 1;
      tripState.currency = "EUR";
    }
  },
  { immediate: true },
);

const closeModal = () => {
  emit("update:open", false);
};

const submitForm = () => {
  formRef.value?.submit();
};

const onSubmit = (event: FormSubmitEvent<TripForm>) => {
  if (mode.value === "edit" && props.trip) {
    // Update existing trip
    tripStore.updateTrip({
      ...props.trip,
      title: tripState.title!,
      startDate: tripState.startDate!,
      endDate: tripState.endDate!,
      people: tripState.people!,
      currency: tripState.currency!,
    });
    toast.success("Trip updated successfully");
  } else {
    const id = uuidv4();
    tripStore.createTrip({
      id,
      title: tripState.title!,
      startDate: tripState.startDate ?? "",
      endDate: tripState.endDate ?? "",
      people: tripState.people ?? 1,
      flights: [],
      carRentals: [],
      stops: [],
      selectedFlightId: "",
      selectedCarRentalId: "",
      currency: tripState.currency!,
    });
    toast.success("Trip created successfully");
  }
  closeModal();
};
</script>
