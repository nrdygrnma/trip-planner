<template>
  <UForm
    ref="form"
    :schema="schema"
    :state="state as Partial<Schema>"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormField class="w-1/2" label="Airline" name="provider">
      <BoundSelect
        v-model="airlineSelectValue"
        :items="airlineSelectItems"
        placeholder="Select airline"
      />
    </UFormField>

    <div class="flex gap-4">
      <UFormField class="w-1/2" label="From Airport" name="fromAirport">
        <BoundSelect
          v-model="departureAirportValue"
          :items="airportSelectItems"
          placeholder="Select departure airport"
        />
      </UFormField>

      <UFormField class="w-1/2" label="To Airport" name="toAirport">
        <BoundSelect
          v-model="arrivalAirportValue"
          :items="airportSelectItems"
          placeholder="Select arrival airport"
        />
      </UFormField>
    </div>

    <div class="flex gap-4">
      <UFormField class="w-1/2" label="Departure" name="departureDate">
        <UInput v-model="state.departureDate" class="w-full" type="date" />
      </UFormField>
      <UFormField class="w-1/2" label="Arrival" name="arrivalDate">
        <UInput
          v-model="state.arrivalDate"
          :min="state.departureDate"
          class="w-full"
          type="date"
        />
      </UFormField>
    </div>

    <div class="flex gap-4">
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

    <div class="grid grid-cols-3 gap-4">
      <UFormField label="Class" name="travelClass">
        <USelect
          v-model="classSelectValue"
          :items="travelClassSelectItem"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Base Fare" name="baseFare">
        <UInput v-model.number="state.baseFare" type="number" />
      </UFormField>

      <UFormField label="Currency" name="currency">
        <USelect
          v-model="currencySelectValue"
          :items="currencySelectItem"
          class="w-full"
        />
      </UFormField>
    </div>

    <div class="grid grid-cols-3 gap-4">
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
import { toRef, watch } from "vue";
import * as z from "zod";
import type { FormSubmitEvent, SelectItem } from "@nuxt/ui";
import type { FlightOption } from "~/types/tripTypes";
import { normalizeAirline } from "~/utils/airlineHelper";
import { normalizeAirport } from "~/utils/airportHelper";
import { airlines } from "~/data/airlines";
import { airports } from "~/data/airports";

const props = defineProps<{
  state?: FlightOption;
}>();

const emit = defineEmits<{
  (e: "submit"): void;
}>();

const form = ref<any>();

const state = reactive<Partial<FlightOption>>({
  airline: normalizeAirline(props.state?.airline),
  fromAirport: normalizeAirport(props.state?.fromAirport),
  toAirport: normalizeAirport(props.state?.toAirport),
  departureDate: "",
  arrivalDate: "",
  durationInAirMin: 0,
  durationLayoversMin: 0,
  stopovers: [],
  travelClass: "economy",
  baseFare: 0,
  currency: "EUR",
  extras: { seatReservation: 0, checkedBaggage: 0, other: 0 },
  ...(props.state ?? {}),
});

const airlineSelectItems: { label: string; value: string }[] = airlines.map(
  (a) => ({
    label: `${a.name} (${a.code})`,
    value: a.code,
  }),
);

const airportSelectItems: { label: string; value: string }[] = airports.map(
  (a) => ({
    label: `${a.name} (${a.code})`,
    value: a.code,
  }),
);

const travelClassSelectItem = ref<SelectItem[]>([
  { label: "Economy", value: "economy" },
  { label: "Premium Economy", value: "premium_economy" },
  { label: "Business", value: "business" },
]);

const currencySelectItem = ref<string[]>(["USD", "EUR", "XCD"]);

const airlineSelectValue = ref<{ label: string; value: string } | undefined>(
  undefined,
);
const departureAirportValue = ref<{ label: string; value: string } | undefined>(
  undefined,
);
const arrivalAirportValue = ref<{ label: string; value: string } | undefined>(
  undefined,
);
const classSelectValue = ref(state.travelClass || "economy");
const currencySelectValue = ref(state.currency || "EUR");

const schema = z.object({
  airline: z.object({
    label: z.string().min(1),
    value: z.string().min(1),
  }),
  fromAirport: z.object({
    label: z.string().min(1),
    value: z.string().min(1),
  }),
  toAirport: z.object({
    label: z.string().min(1),
    value: z.string().min(1),
  }),
  departureDate: z.string().min(1),
  arrivalDate: z.string().min(1),
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
  travelClass: z.enum(["economy", "premium_economy", "business"]),
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

const onSubmit = (event: FormSubmitEvent<Schema>) => {
  if (!event) return;
  emit("submit");
};

const submit = () => {
  form.value?.submit();
};

const bindSelect = <T extends { label: string; value: string }>(
  selectRef: Ref<T | undefined>,
  targetState: Ref<T | undefined>,
) => {
  watch(selectRef, (val) => {
    targetState.value = val ?? undefined;
  });
};

bindSelect(airlineSelectValue, toRef(state, "airline"));
bindSelect(departureAirportValue, toRef(state, "fromAirport"));
bindSelect(arrivalAirportValue, toRef(state, "toAirport"));

watch(classSelectValue, (val) => {
  state.travelClass = val;
});

watch(
  () => state.departureDate,
  (newDeparture) => {
    if (!newDeparture) return;

    const departure = new Date(newDeparture);
    const arrival = state.arrivalDate ? new Date(state.arrivalDate) : null;

    if (!arrival || arrival <= departure) {
      const nextDay = new Date(departure);
      nextDay.setDate(departure.getDate() + 1);

      state.arrivalDate = nextDay.toISOString().split("T")[0];
    }
  },
  { immediate: false },
);

watch(currencySelectValue, (val) => {
  state.currency = val;
});

defineExpose({ submit });
</script>
