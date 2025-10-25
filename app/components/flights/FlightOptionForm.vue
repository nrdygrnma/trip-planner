<template>
  <UForm
    ref="form"
    :schema="schema"
    :state="state as Partial<Schema>"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormField label="Airline" name="provider">
      <UInput v-model="state.provider" />
    </UFormField>

    <div class="flex gap-2">
      <UFormField label="From" name="from">
        <UInput v-model="state.from" />
      </UFormField>
      <UFormField label="To" name="to">
        <UInput v-model="state.to" />
      </UFormField>
    </div>

    <div class="flex gap-2">
      <UFormField label="Departure" name="departureDateTime">
        <UInput v-model="state.departureDateTime" type="datetime-local" />
      </UFormField>
      <UFormField label="Arrival" name="arrivalDateTime">
        <UInput v-model="state.arrivalDateTime" type="datetime-local" />
      </UFormField>
    </div>

    <div class="flex gap-2">
      <UFormField label="Duration in Air (min)" name="durationInAirMin">
        <UInput v-model.number="state.durationInAirMin" type="number" />
      </UFormField>
      <UFormField label="Layover Duration (min)" name="durationLayoversMin">
        <UInput v-model.number="state.durationLayoversMin" type="number" />
      </UFormField>
    </div>

    <div v-for="(s, i) in state.stopovers ?? []" :key="i" class="flex gap-2">
      <UFormField :name="`stopovers.${i}.airport`" label="Stopover Airport">
        <UInput v-model="s.airport" />
      </UFormField>
      <UFormField
        :name="`stopovers.${i}.durationMin`"
        label="Stopover Duration"
      >
        <UInput v-model="s.durationMin" type="number" />
      </UFormField>
    </div>

    <UFormField label="Class" name="class">
      <USelect v-model="classSelectValue" :items="classSelectItems" />
    </UFormField>

    <UFormField label="Base Fare" name="baseFare">
      <UInput v-model.number="state.baseFare" type="number" />
    </UFormField>

    <UFormField label="Currency" name="currency">
      <UInput v-model="state.currency" />
    </UFormField>

    <div class="grid grid-cols-3 gap-2">
      <UFormField label="Seat Reservation" name="extras.seatReservation">
        <UInput v-model.number="state.extras!.seatReservation" type="number" />
      </UFormField>
      <UFormField label="Checked Baggage" name="extras.checkedBaggage">
        <UInput v-model.number="state.extras!.checkedBaggage" type="number" />
      </UFormField>
      <UFormField label="Other Extras" name="extras.other">
        <UInput v-model.number="state.extras!.other" type="number" />
      </UFormField>
    </div>
  </UForm>
</template>

<script lang="ts" setup>
import { watch } from "vue";
import * as z from "zod";
import type { FormSubmitEvent, SelectItem } from "@nuxt/ui";
import type { FlightOption } from "~/types/tripTypes";

const props = defineProps<{
  state: FlightOption;
}>();

const emit = defineEmits<{
  (e: "submit"): void;
}>();

const form = ref<any>();

const classSelectItems = ref<SelectItem[]>([
  { label: "Economy", value: "economy" },
  { label: "Premium Economy", value: "premium_economy" },
  { label: "Business", value: "business" },
]);

const classSelectValue = ref(props.state.class || "economy");

const schema = z.object({
  provider: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
  departureDateTime: z.string().min(1),
  arrivalDateTime: z.string().min(1),
  durationInAirMin: z.number().int().nonnegative(),
  durationLayoversMin: z.number().int().nonnegative(),
  stopovers: z
    .array(
      z.object({
        airport: z.string().min(1),
        durationMin: z.number().int().nonnegative(),
      }),
    )
    .optional(),
  class: z.enum(["economy", "premium_economy", "business"]),
  baseFare: z.number().nonnegative(),
  extras: z
    .object({
      seatReservation: z.number().nonnegative(),
      checkedBaggage: z.number().nonnegative(),
      other: z.number().nonnegative(),
    })
    .optional(),
  currency: z.string().min(1),
});

type Schema = z.output<typeof schema>;

watch(classSelectValue, (val) => {
  props.state.class = val;
});

const onSubmit = (event: FormSubmitEvent<Schema>) => {
  if (!event) return;
  emit("submit");
};

const submit = () => {
  form.value?.submit();
};

defineExpose({ submit });
</script>
