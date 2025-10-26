<template>
  <SmartSelectMenu
    :items="props.items"
    :model-value="internalValue"
    :placeholder="props.placeholder"
    :search-fields="props.searchFields ?? ['label', 'value']"
    @update:model-value="onUpdate"
  />
</template>

<script lang="ts" setup>
import { defineEmits, defineProps } from "vue";
import type { SelectItem } from "@nuxt/ui";
import SmartSelectMenu from "./SmartSelectMenu.vue";

const props = defineProps<{
  modelValue: SelectItem | undefined;
  items: SelectItem[];
  placeholder?: string;
  searchFields?: string[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: SelectItem | undefined): void;
}>();

const internalValue = ref<SelectItem | undefined>(props.modelValue);

const onUpdate = (val: SelectItem | undefined) => {
  internalValue.value = val;
  emit("update:modelValue", val);
};

watch(
  () => props.modelValue,
  (val) => {
    internalValue.value = val;
  },
);
</script>
