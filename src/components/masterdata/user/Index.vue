<template>
  <div class="container">
    <h3 style="display: inline-block">Master Data Pengguna &nbsp</h3>
    <SettingIcon />
    <br />
    <router-link to="/masterdata/user/create">
      <div class="btn btn-sm btn-primary">Tambah User</div>
    </router-link>
    <router-link to="/masterdata/role">
      <div class="btn btn-sm btn-success ms-2">Daftar Role</div>
    </router-link>
    <hr />
    <div class="mb-5">
      <DataTable :headers="headers" :items="items" @item-edited="handleEditItem" @item-detail="handleDetailItem">
      </DataTable>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from "vue";
import type { Header, Item } from "vue3-easy-data-table";
import DataTable from "@/components/table/datatable.vue";
import type { CryptoService } from "@/interfaces";
import type { AxiosInstance } from "axios";
import { useRouter } from "vue-router";
import config from "@/config";

export default defineComponent({
  components: {
    SettingIcon,
    DataTable,
  },
  setup() {
    const crypto = inject<CryptoService>("$crypto")!;
    const axios = inject<AxiosInstance>("$axios")!;
    const router = useRouter();

    const headers = ref<Header[]>([
      { text: "No.", value: "index" },
      { text: "Nama Lengkap", value: "nama_lengkap", sortable: true },
      // { text: "Unit", value: "unit", sortable: "true" },
      // { text: "Sub Unit", value: "sub_unit", sortable: "true" },
      { text: "Alamat", value: "address" },
      { text: "No. Telp.", value: "phoneNumber", sortable: true },
      { text: "Aksi", value: "userOperation" },
    ]);

    const items = ref<Item[]>([]);

    const token = crypto.getToken();
    axios.get("/users", {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      let no = 0;
      items.value = response.data.data.map((row: any) => ({
        index: (no += 1),
        key: row.id,
        nama_lengkap: row.firstName + " " + row.lastName,
        unit: row.unit,
        sub_unit: row.sub_unit,
        phoneNumber: row.phoneNumber,
        address: row.address,
        email: "",
      }));
    }).catch((error) => { });

    const handleEditItem = (item: any) => {
      const user = item.key;
      router.push({
        name: "masterdata-user-update",
        params: { id: user },
      });
    };

    const handleDetailItem = (item: any) => {
      const user = item.key;
      router.push({
        name: "masterdata-akses",
        params: { id: user },
      });
    };

    return {
      headers,
      items,
      handleEditItem,
      handleDetailItem,
    };
  },
  method: {},
});
</script>
