<template>
  <v-select
    :options="data"
    label="title"
    v-model="selectedValue"
    @update:modelValue="selectItem"
    :disabled="isDataEmpty"
  />
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, inject } from "vue";
import type { CryptoService } from "@/interfaces";
import type { AxiosInstance } from "axios";
import config from "@/config";

export default defineComponent({
  emits: ["item-selected", "value-updated"],
  setup(props, { emit }) {
    const crypto = inject<CryptoService>("$crypto")!;
    const axios = inject<AxiosInstance>("$axios")!;
    const token = crypto.getToken();
    const selectedValue = ref<any[]>([]);
    const data = ref<any[]>([]);

    const selectItem = (value: any) => {
      emit("item-selected", value);
      emit("value-updated", value);
    };

    const isDataEmpty = computed(() => data.value.length === 0);

    // Watch the data prop and reset selectedValue if data is empty
    watch(
      () => data.value,
      (newData) => {
        if (newData.length === 0) {
          selectedValue.value = [];
        }
      }
    );

    const getCoa = async () => {
      try {
        const response = await axios.get(`/coa`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        data.value = response.data.data.map((row: any) => ({
          key: row.id,
          title: `(${row.kode}) ${row.nama}`,
        }));
      } catch (error) {
        console.error("Error fetching COA", error);
      }
    };

    getCoa();

    return {
      data,
      selectedValue,
      selectItem,
      isDataEmpty,
    };
  },
});
</script>
