<template>
  <div>
    <div class="row">
      <div class="col-auto">
        <span>Search: </span>
      </div>
      <div class="col-3">
        <input class="form-control mb-2" type="text" v-model="searchValue" />
      </div>
      <div class="col-auto">
        <button class="btn btn-sm btn-warning" @click="addItem" type="button">
          Tambah
        </button>
      </div>
    </div>
    <EasyDataTable
      :headers="headers"
      :items="filteredItems"
      :search-value="searchValue"
    >
      <template #item-deleteOperation="item">
        <button
          class="btn btn-xs btn-sm btn-danger"
          @click="deleteItem(item.index - 1)"
        >
          Delete
        </button>
      </template>
      <template #item-coa_select="item">
        <selectCoa
          required
          v-model="item.coa_select"
          @item-selected="handleInputCoa"
          @value-updated="updateItem(item)"
          @input="updateCoaValue(item)"
          :kode="kode"
        />
      </template>
      <template #item-coa_select_all="item">
        <selectCoaAll
          required
          v-model="item.coa_select"
          @item-selected="handleInputCoa"
          @value-updated="updateItem(item)"
          @input="updateCoaValue(item)"
        />
      </template>
      <template #item-satuan="item">
        <div class="row m-1">
          <input
            type="text"
            class="form-control"
            v-model="item.satuan"
            @input="handleInputSatuan(item.satuan, item), updateItem(item)"
          />
        </div>
      </template>
      <template #item-keterangan="item">
        <div class="row m-1">
          <input
            type="text"
            class="form-control"
            v-model="item.keterangan"
            @input="
              handleInputKeterangan(item.keterangan, item), updateItem(item)
            "
          />
        </div>
      </template>
      <template #item-frekuensi="item">
        <div class="row m-1">
          <input
            type="number"
            class="form-control"
            v-model="item.frekuensi"
            min="1"
            required
            @input="
              handleInputFrekuensi(item.frekuensi, item), updateItem(item)
            "
          />
        </div>
      </template>
      <template #item-jumlah="item">
        <div class="row m-1">
          <input
            type="number"
            class="form-control"
            v-model="item.jumlah"
            min="1"
            required
            @input="handleInputJumlah(item.jumlah, item), updateItem(item)"
          />
        </div>
      </template>
      <template #item-harga_satuan="item">
        <div class="row m-1">
          <DebouncedCurrencyInput
            v-model="item.harga_satuan"
            :options="currencyOptions"
            required
            @input="updateHargaValue(item)"
            @value-updated="handleInputHarga"
            @value-inputed="updateItem(item)"
          />
        </div>
      </template>
      <template #item-nominal_debit="item">
        <div class="row m-1">
          <DebouncedCurrencyInput
            v-model="item.nominal_debit"
            :options="currencyOptions"
            required
            :disabled="item.nominal_kredit != 0"
            @input="updateHargaValue(item)"
            @value-updated="handleInputDebit"
            @value-inputed="updateItem(item)"
          />
        </div>
      </template>
      <template #item-nominal_kredit="item">
        <div class="row m-1">
          <DebouncedCurrencyInput
            v-model="item.nominal_kredit"
            :options="currencyOptions"
            required
            :disabled="item.nominal_debit != 0"
            @input="updateHargaValue(item)"
            @value-updated="handleInputKredit"
            @value-inputed="updateItem(item)"
          />
        </div>
      </template>
      <template #item-totalInput="item">
        <div class="row m-1">
          <DebouncedCurrencyInput
            v-model="item.totalInput"
            :options="currencyOptions"
            readonly
          />
        </div>
      </template>
    </EasyDataTable>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import type { Header, Item } from "vue3-easy-data-table";
import type { PropType } from "vue";
import "vue3-easy-data-table/dist/style.css";
import DebouncedCurrencyInput from "@/components/input/currency.vue";
import selectCoa from "@/components/input/selectCoa.vue";
import selectCoaAll from "@/components/input/selectCoaAll.vue";

export default defineComponent({
  components: { DebouncedCurrencyInput, selectCoa, selectCoaAll },
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
  data() {
    return {
      currencyOptions: {
        currency: "IDR",
        locale: "id-ID",
        prefix: "Rp. ",
        precision: 0,
        useGrouping: true,
        hideCurrencySymbolOnFocus: false,
        hideGroupingSeparatorOnFocus: false,
        hideNegligibleDecimalDigitsOnFocus: false,
      },
      hargaValue: 0,
      jumlahValue: 0,
      kode: {
        k1_1: 1,
        k1_2: 5,
      },
      itemValue: {
        keterangan: "",
        harga_satuan: 0,
        nominal_debit: 0,
        nominal_kredit: 0,
        jumlah: 1,
        frekuensi: 1,
        totalInput: 0,
        coa_select: {},
        satuan: "",
      },
    };
  },
  emits: ["item-updated", "item-detail", "item-added", "item-deleted"],
  setup(props, { emit }) {
    const searchValue = ref("");
    const filteredItems = ref(props.items);

    watch(
      () => props.items,
      (newItems) => {
        filteredItems.value = newItems;
      },
      { immediate: true, deep: true }
    );

    const addItem = () => {
      const newItem: Record<string, any> = {};
      props.headers.forEach((header: any) => {
        if (header.value !== "deleteOperation") {
          newItem[header.value] =
            header.value === "index" ? props.items.length + 1 : "";
          if (header.value === "jumlah") newItem[header.value] = 1;
          if (header.value === "frekuensi") newItem[header.value] = 1;
          if (header.value === "harga_satuan") newItem[header.value] = 0;
          if (header.value === "nominal_debit") newItem[header.value] = 0;
          if (header.value === "nominal_kredit") newItem[header.value] = 0;
          if (header.value === "totalInput") newItem[header.value] = 0;
        }
      });

      emit("item-added", newItem);
    };

    const deleteItem = (index: number) => {
      emit("item-deleted", index);
    };

    return {
      searchValue,
      filteredItems,
      addItem,
      deleteItem,
    };
  },
  methods: {
    handleInputCoa(coa: any) {
      this.itemValue.coa_select = coa;
    },
    handleInputHarga(harga: any) {
      this.itemValue.harga_satuan = harga;
      this.calculateTotalInput();
    },
    handleInputDebit(debit: any) {
      this.itemValue.nominal_debit = debit;
      // this.calculateTotalInput();
    },
    handleInputKredit(kredit: any) {
      this.itemValue.nominal_kredit = kredit;
      // this.calculateTotalInput();
    },
    handleInputJumlah(jumlah: any, item: any) {
      this.itemValue = item;
      this.itemValue.jumlah = jumlah;
      this.calculateTotalInput();
    },
    handleInputFrekuensi(frekuensi: any, item: any) {
      this.itemValue = item;
      this.itemValue.frekuensi = frekuensi;
      this.calculateTotalInput();
    },
    handleInputKeterangan(keterangan: any, item: any) {
      this.itemValue = item;
      this.itemValue.keterangan = keterangan;
    },
    handleInputSatuan(satuan: any, item: any) {
      this.itemValue = item;
      this.itemValue.satuan = satuan;
    },
    updateHargaValue(item: any) {
      this.itemValue = item;
    },
    updateCoaValue(item: any) {
      this.itemValue = item;
    },
    calculateTotalInput() {
      if (
        this.itemValue.jumlah &&
        this.itemValue.harga_satuan &&
        this.itemValue.frekuensi
      ) {
        this.itemValue.totalInput =
          this.itemValue.jumlah *
          this.itemValue.harga_satuan *
          this.itemValue.frekuensi;
      }
    },
    updateItem(updatedItem: any) {
      updatedItem.keterangan = this.itemValue.keterangan;
      updatedItem.jumlah = this.itemValue.jumlah;
      updatedItem.frekuensi = this.itemValue.frekuensi;
      updatedItem.harga_satuan = this.itemValue.harga_satuan;
      updatedItem.totalInput = this.itemValue.totalInput;
      updatedItem.coa_select = this.itemValue.coa_select;
      updatedItem.nominal_debit = this.itemValue.nominal_debit;
      updatedItem.nominal_kredit = this.itemValue.nominal_kredit;
      this.$emit("item-updated", updatedItem);
    },
  },
});
</script>

<style scoped>
.row {
  margin: 0;
}
</style>
