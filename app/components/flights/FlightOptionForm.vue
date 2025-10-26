<template>
  <UForm
    ref="form"
    :schema="schema"
    :state="state as Partial<Schema>"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormField class="w-1/2" label="Airline" name="airline">
      <BoundSelect
        v-model="airlineSelectValue"
        :items="airlineSelectItems"
        class="w-full"
        placeholder="Select airline"
      />
    </UFormField>

    <div class="flex gap-2">
      <UFormField class="w-1/2" label="From Airport" name="fromAirport">
        <BoundSelect
          v-model="departureAirportValue"
          :items="airportSelectItems"
          class="w-full"
          placeholder="Select departure airport"
        />
      </UFormField>

      <UFormField class="w-1/2" label="To Airport" name="toAirport">
        <BoundSelect
          v-model="arrivalAirportValue"
          :items="airportSelectItems"
          class="w-full"
          placeholder="Select arrival airport"
        />
      </UFormField>
    </div>

    <div class="flex gap-2">
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

    <div class="flex gap-2">
      <UFormField class="w-1/2" label="Number of Stops" name="stopsCount">
        <UInput v-model.number="state.stopsCount" min="0" type="number" />
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
import { calculateTotalCost } from "~/utils/calculateHelper";

const props = defineProps<{
  state?: FlightOption;
}>();

const emit = defineEmits<{
  (e: "submit", value: FlightOption): void;
}>();

const form = ref<any>();

const state = reactive<Partial<FlightOption>>({
  airline: normalizeAirline(props.state?.airline),
  fromAirport: normalizeAirport(props.state?.fromAirport),
  toAirport: normalizeAirport(props.state?.toAirport),
  departureDate: "",
  arrivalDate: "",
  stopsCount: 0,
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

const currencySelectItem = ref<SelectItem[]>([
  { label: "EUR (€)", value: "EUR" },
  { label: "USD ($)", value: "USD" },
  { label: "XCD (EC$)", value: "XCD" },
]);

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
  stopsCount: z.number().int().nonnegative(),
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
  // Emit the fully populated form state as a FlightOption payload
  const payload: FlightOption = {
    id: (props.state as any)?.id, // preserve id for edit if present
    airline: state.airline as { label: string; value: string },
    fromAirport: state.fromAirport as { label: string; value: string },
    toAirport: state.toAirport as { label: string; value: string },
    departureDate: state.departureDate || "",
    arrivalDate: state.arrivalDate || "",
    stopsCount: Number(state.stopsCount ?? 0),
    travelClass: (state.travelClass as any) || "economy",
    baseFare: Number(state.baseFare ?? 0),
    totalCostEUR: calculateTotalCost(state as FlightOption),
    extras: (state.extras ?? {
      seatReservation: 0,
      checkedBaggage: 0,
      other: 0,
    }) as any,
    currency: state.currency || "EUR",
  };
  emit("submit", payload);
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

// Keep the select components in sync when editing existing flights
function syncSelectsFromState() {
  const findByValue = (
    items: { label: string; value: string }[],
    target?: { label: string; value: string },
  ) => {
    if (!target || !target.value) return undefined;
    return items.find((i) => i.value === target.value) || (target as any);
  };

  airlineSelectValue.value = findByValue(
    airlineSelectItems,
    state.airline as any,
  );
  departureAirportValue.value = findByValue(
    airportSelectItems,
    state.fromAirport as any,
  );
  arrivalAirportValue.value = findByValue(
    airportSelectItems,
    state.toAirport as any,
  );
  classSelectValue.value = (state.travelClass as any) || "economy";
  currencySelectValue.value = state.currency || "EUR";
}

watch(
  () => props.state,
  (newState) => {
    if (!newState) {
      // If cleared, just reflect current internal state to selects
      syncSelectsFromState();
      return;
    }

    // Rehydrate internal state from incoming props (Edit modal opens/changes)
    state.airline = normalizeAirline(newState.airline);
    state.fromAirport = normalizeAirport(newState.fromAirport);
    state.toAirport = normalizeAirport(newState.toAirport);
    state.departureDate = newState.departureDate || "";
    state.arrivalDate = newState.arrivalDate || "";
    state.stopsCount = newState.stopsCount ?? 0;
    state.travelClass = (newState.travelClass as any) || "economy";
    state.baseFare = newState.baseFare ?? 0;
    state.currency = newState.currency || "EUR";
    state.extras = {
      seatReservation: newState.extras?.seatReservation ?? 0,
      checkedBaggage: newState.extras?.checkedBaggage ?? 0,
      other: newState.extras?.other ?? 0,
    };

    // Now mirror into the select UI bindings
    syncSelectsFromState();
  },
  { immediate: true, deep: true },
);

defineExpose({ submit });
</script>
