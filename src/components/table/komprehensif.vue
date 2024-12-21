<template>
  <EasyDataTable
    :headers="headers"
    :items="items"
    :rows-per-page="1000"
    :rows-per-page-active="1000"
    hide-footer
  >
    <template #customize-headers>
      <thead class="customize-headers">
        <tr>
          <th colspan="1" rowspan="1" class="bordered-cell"></th>
          <th class="fw-normal text-center bordered-cell" colspan="3">Periode Kiri</th>
          <th class="fw-normal text-center bordered-cell" colspan="3">Periode Kanan</th>
        </tr>
        <tr>
          <th class="fw-normal text-center bordered-cell">Akun</th>
          <th class="fw-normal text-center bordered-cell">Dengan Pembatasan</th>
          <th class="fw-normal text-center bordered-cell">Tanpa Pembatasan</th>
          <th class="fw-normal text-center bordered-cell">Jumlah</th>
          <th class="fw-normal text-center bordered-cell">Dengan Pembatasan</th>
          <th class="fw-normal text-center bordered-cell">Tanpa Pembatasan</th>
          <th class="fw-normal text-center bordered-cell">Jumlah</th>
        </tr>
      </thead>
    </template>
    <template #item-akunKomprehensif="item">
      <span v-html="item.akun"></span>
    </template>
  </EasyDataTable>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { Header, Item } from "vue3-easy-data-table";
import type { PropType } from "vue";

export default defineComponent({
  props: {
    headers: {
      type: Array as PropType<Header[]>,
      required: true,
    },
    items: {
      type: Array as PropType<Item[]>,
      required: true,
    },
  },
});
</script>

<style scoped>
.customize-headers th, .customize-headers td {
  border: 1px solid #ccc; /* Add a border to header cells */
  padding: 8px;
  text-align: center;
}
.bordered-cell {
  border: 1px solid #ccc; /* Ensure all custom cells have borders */
}
</style>
