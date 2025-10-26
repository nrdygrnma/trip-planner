<template>
  <USelectMenu
    v-model="internalValue"
    :filterFn="searchFilter"
    :items="items"
    :placeholder="placeholder"
    class="w-full"
    clearable
  />
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import type { SelectItem } from "@nuxt/ui";

interface Props<T = any> {
  modelValue?: T;
  items: SelectItem[];
  placeholder?: string;
  searchFields?: string[];
}

const props = defineProps<Props>();
const emit = defineEmits<{ (e: "update:modelValue", value: any): void }>();

const internalValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => (internalValue.value = val),
);
watch(internalValue, (val) => emit("update:modelValue", val));

const searchFilter = (item: any, query: string) => {
  if (!query) return true;
  const q = query.toLowerCase();
  const fields = props.searchFields ?? ["label"];
  return fields.some((field) => {
    const val = item[field] ?? "";
    return typeof val === "string" && val.toLowerCase().includes(q);
  });
};
</script>
