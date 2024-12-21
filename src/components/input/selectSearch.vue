<template>
  <v-select
    :options="data"
    label="title"
    v-model="selectedValue"
    @update:modelValue="selectItem"
    :disabled="isDataEmpty"
  ></v-select>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";

export default defineComponent({
  props: {
    data: {
      type: Array as () => any[],
      required: true,
    },
  },
  emits: ["item-selected", "item-changed"],
  setup(props, { emit }) {
    const selectedValue = ref<any[]>([]);

    const selectItem = (value: any) => {
      emit("item-selected", value);
      emit("item-changed");
    };

    const isDataEmpty = computed(() => props.data.length === 0);

    // Watch the data prop and reset selectedValue if data is empty
    watch(
      () => props.data,
      (newData) => {
        if (newData.length === 0) {
          selectedValue.value = [];
        }
      }
    );

    return {
      selectedValue,
      selectItem,
      isDataEmpty,
    };
  },
});
</script>
