<template>
  <div class="row">
    <div class="col-auto">
      <span>Search: </span>
    </div>
    <div class="col-3">
      <input class="form-control mb-2" type="text" v-model="searchValue" />
    </div>
  </div>
  <EasyDataTable :headers="headers" :items="items" :search-value="searchValue">
    <template #item-editDeleteOperation="item">
      <button
        v-if="userProfile && userProfile.role == 'admin'"
        class="btn btn-sm btn-warning mx-2"
        @click="editItem(item)"
      >
        Edit
      </button>
      <button
        v-if="userProfile && userProfile.role == 'user'"
        class="btn btn-sm btn-success mx-2"
        @click="pinjamItem(item)"
      >
        Pinjam
      </button>
      <button
        v-if="userProfile && userProfile.role == 'admin'"
        class="btn btn-sm btn-danger mx-2"
        @click="deleteItem(item)"
      >
        Delete
      </button>
    </template>
    <template #item-reservationOperation="item">
      <button
        v-if="
          userProfile && userProfile.role == 'user' && item.status == 'pending'
        "
        class="btn btn-sm btn-warning mx-2"
        @click="editItem(item)"
      >
        Edit
      </button>

      <button
        v-if="
          userProfile && userProfile.role == 'user' && item.status == 'pending'
        "
        class="btn btn-sm btn-danger"
        @click="deleteItem(item)"
      >
        Delete
      </button>
      <button
        v-if="
          userProfile && userProfile.role == 'user' && item.status == 'pending'
        "
        class="btn btn-sm btn-success ms-2"
        @click="callAjukan(item)"
      >
        Ajukan
      </button>
      <button
        v-if="
          userProfile && userProfile.role == 'admin' && item.status == 'ajukan'
        "
        class="btn btn-sm btn-success ms-2"
        @click="callApiDetail(item)"
      >
        Diterima
      </button>
      <button
        v-if="
          userProfile && userProfile.role == 'admin' && item.status == 'ajukan'
        "
        class="btn btn-sm btn-danger ms-2"
        @click="callValidasi(item)"
      >
        Ditolak
      </button>
    </template>
    <template #item-detailOperation="item">
      <button class="btn btn-sm btn-primary mx-2" @click="callApiDetail(item)">
        Detail
      </button>
    </template>
    <template #item-RoleOperation="item">
      <button class="btn btn-sm btn-warning mx-2" @click="editItem(item)">
        Edit
      </button>
      <button
        class="btn btn-sm btn-secondary me-2"
        @click="callApiDetail(item)"
      >
        Menu
      </button>
      <button class="btn btn-sm btn-danger" @click="deleteItem(item)">
        Delete
      </button>
    </template>
    <template #item-InputOperation="item">
      <button class="btn btn-sm btn-success mx-2" @click="callApiDetail(item)">
        Input
      </button>
    </template>
    <template #item-userOperation="item">
      <button class="btn btn-sm btn-warning" @click="editItem(item)">
        Edit
      </button>
      <!-- <button
        class="btn btn-sm btn-secondary ms-2"
        @click="callApiDetail(item)"
      >
        User Akses
      </button> -->
    </template>
    <template #item-switchStatus="item">
      <div class="form-check form-switch">
        <input
          class="form-check-input"
          type="checkbox"
          :checked="item.periodeStatus"
          @change="toggleStatus(item)"
        />
        <p v-if="item.periodeStatus">Aktif</p>
        <p v-if="!item.periodeStatus">Non Aktif</p>
      </div>
    </template>
    <template #item-roleAuthorize="item">
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          :checked="item.is_authorize"
          @change="toggleAuthorize(item)"
        />
      </div>
    </template>
    <template #item-roleValidate="item">
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          :checked="item.is_validate"
          @change="toggleValidate(item)"
        />
      </div>
    </template>
    <template #item-is_createMenu="item">
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          :checked="item.is_create"
          @change="toggleCreate(item)"
        />
      </div>
    </template>
    <template #item-is_readAllMenu="item">
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          :checked="item.is_read_all"
          @change="toggleReadAll(item)"
        />
      </div>
    </template>
    <template #item-is_readMenu="item">
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          :checked="item.is_read"
          @change="toggleRead(item)"
        />
      </div>
    </template>
    <template #item-is_updateMenu="item">
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          :checked="item.is_update"
          @change="toggleUpdate(item)"
        />
      </div>
    </template>
    <template #item-is_deleteMenu="item">
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          :checked="item.is_delete"
          @change="toggleDelete(item)"
        />
      </div>
    </template>
    <template #header-select>
      <input
        type="checkbox"
        @change="toggleSelectAll"
        :checked="areAllRowsSelected"
      />
    </template>
    <template #item-select="item">
      <input
        type="checkbox"
        :checked="selectedRows.includes(item.key)"
        @change="toggleRowSelection(item.key)"
      />
    </template>
  </EasyDataTable>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from "vue";
import DebouncedCurrencyInput from "@/components/input/currency.vue";
import type { AxiosInstance } from "axios";
import type { CryptoService, AuthInterface } from "@/interfaces";
import type { Header, Item } from "vue3-easy-data-table";
import type { PropType } from "vue";
import currency from "@/plugin/currency";
import config from "@/config";

export default defineComponent({
  name: "DataTable",
  setup() {
    const crypto = inject<CryptoService>("$crypto")!;
    const axios = inject<AxiosInstance>("$axios")!;
    const auth = inject<AuthInterface>("$auth");
    const token = crypto.getToken();

    let userAccessAll: any = ref([]);
    const userProfile = ref<any>();

    const getUserProfile = async () => {
      try {
        const response = await axios.get("user-profiles", {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        userProfile.value = response.data.data[0];
      } catch (error) {
        console.log(error);
      }
    };

    const fetchData = async () => {
      await getUserProfile();
    };

    fetchData();

    return {
      userProfile,
      token,
      axios,
    };
  },
  data() {
    return {
      searchValue: "",
      currencyOptions: {
        currency: "IDR",
        locale: "id-ID",
        prefix: "Rp. ",
        precision: 0,
        min: 0,
        useGrouping: true,
        hideCurrencySymbolOnFocus: false,
        hideGroupingSeparatorOnFocus: false,
        hideNegligibleDecimalDigitsOnFocus: false,
      },
      currencyRealisasiOptions: {
        currency: "IDR",
        locale: "id-ID",
        prefix: "Rp. ",
        precision: 0,
        min: 0,
        useGrouping: true,
        hideCurrencySymbolOnFocus: false,
        hideGroupingSeparatorOnFocus: false,
        hideNegligibleDecimalDigitsOnFocus: false,
      },
      plafonValue: 0,
      realisasiValue: 0,
      fileValue: ref<FileList | null>(null),
      itemValue: {
        harga_satuan: 0,
        jumlah: 1,
        totalInput: 0,
      },
      selectedRows: ref<any[]>([]),
    };
  },
  components: {
    DebouncedCurrencyInput,
  },
  emits: [
    "item-edited",
    "item-deleted",
    "item-pinjam",
    "item-detail",
    "item-ajukan",
    "item-validasi",
    "item-updated",
    "status-toggled",
    "authorize-toggled",
    "validate-toggled",
    "read-toggled",
    "create-toggled",
    "update-toggled",
    "delete-toggled",
    "read-all-toggled",
    "row-selected",
  ],
  computed: {
    areAllRowsSelected() {
      return this.selectedRows.length === this.items.length;
    },
  },
  methods: {
    editItem(item: any) {
      this.$emit("item-edited", item);
    },
    pinjamItem(item: any) {
      this.$emit("item-pinjam", item);
    },
    deleteItem(item: any) {
      this.$emit("item-deleted", item); // assuming item has an id property
    },
    callApiDetail(item: any) {
      this.$emit("item-detail", item); // assuming item has an id property
    },
    callAjukan(item: any) {
      this.$emit("item-ajukan", item); // assuming item has an id property
    },
    callValidasi(item: any) {
      this.$emit("item-validasi", item); // assuming item has an id property
    },
    toggleStatus(item: any) {
      item.periodeStatus = !item.periodeStatus; // toggle status
      this.$emit("status-toggled", item);
    },
    toggleAuthorize(item: any) {
      item.is_authorize = !item.is_authorize; // toggle status
      this.$emit("authorize-toggled", item);
    },
    toggleValidate(item: any) {
      item.is_validate = !item.is_validate; // toggle status
      this.$emit("validate-toggled", item);
    },
    toggleReadAll(item: any) {
      item.is_read_all = !item.is_read_all; // toggle status
      this.$emit("read-all-toggled", item);
    },
    toggleRead(item: any) {
      item.is_read = !item.is_read; // toggle status
      this.$emit("read-toggled", item);
    },
    toggleUpdate(item: any) {
      item.is_update = !item.is_update; // toggle status
      this.$emit("update-toggled", item);
    },
    toggleCreate(item: any) {
      item.is_create = !item.is_create; // toggle status
      this.$emit("create-toggled", item);
    },
    toggleDelete(item: any) {
      item.is_delete = !item.is_delete; // toggle status
      this.$emit("delete-toggled", item);
    },
    getCurrencyOptions(maxInput: number) {
      return {
        ...this.currencyRealisasiOptions,
        max: maxInput,
      };
    },
    currencyToInteger(curr: string) {
      const nominal = currency.rupiahToInt(curr);
      return nominal;
    },
    toggleSelectAll(event: any) {
      if (event.target.checked) {
        this.selectedRows = this.items.map((item) => item.key);
      } else {
        this.selectedRows = [];
      }
      this.$emit("row-selected", this.selectedRows);
    },
    toggleRowSelection(rowId: any) {
      if (this.selectedRows.includes(rowId)) {
        this.selectedRows = this.selectedRows.filter(
          (key: any) => key !== rowId
        );
      } else {
        this.selectedRows.push(rowId);
      }
      this.$emit("row-selected", this.selectedRows);
    },
  },
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
: { menu: { name: string; }; }: { menu: { name: string; }; }: { menu: { name:
string; }; }: { menu: { name: string; }; }: { data: BlobPart; }: any(: any)(:
any)
