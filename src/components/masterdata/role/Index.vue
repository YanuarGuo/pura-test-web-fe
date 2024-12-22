<template>
  <div class="container">
    <h3 style="display: inline-block">Master Data Role &nbsp</h3>
    <br />
    <router-link to="/masterdata/role/create">
      <div class="btn btn-sm btn-primary">Tambah Role</div>
    </router-link>
    <router-link to="/masterdata/user">
      <div class="btn btn-sm btn-success ms-2">Daftar User</div>
    </router-link>
    <hr />
    <div class="mb-5">
      <DataTable :headers="headers" :items="items" @item-edited="handleEditItem" @item-detail="handleDetailItem"
        @item-deleted="handleDeleteItem" @authorize-toggled="handleAuthorize" @validate-toggled="handleValidate">
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
import { swalWithCustomStyles } from "@/plugin/swal";
import { useRouter } from "vue-router";
import config from "@/config";

export default defineComponent({
  components: {
    DataTable,
  },
  setup() {
    const crypto = inject<CryptoService>("$crypto")!;
    const axios = inject<AxiosInstance>("$axios")!;
    const router = useRouter();
    const swal = inject("$swal") as typeof swalWithCustomStyles;

    const headers = ref<Header[]>([
      { text: "No.", value: "index" },
      { text: "Nama", value: "nama", sortable: true },
      { text: "Otorisasi", value: "roleAuthorize" },
      { text: "Validasi", value: "roleValidate" },
      { text: "Keterangan", value: "keterangan" },
      { text: "Aksi", value: "RoleOperation" },
    ]);

    const items = ref<Item[]>([]);

    const token = crypto.getToken();
    axios.get("/roles", {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      let no = 0;
      items.value = response.data.data.map((row: any) => ({
        index: (no += 1),
        key: row.id,
        nama: row.name,
        is_authorize: row.is_authorize,
        is_validate: row.is_validate,
        keterangan: row.note,
      }));
    }).catch((error) => { });

    const handleEditItem = (item: any) => {
      const role = item.key;
      router.push({
        name: "masterdata-role-update",
        params: { id: role },
      });
    };

    const handleDetailItem = (item: any) => {
      const role = item.key;
      router.push({
        name: "masterdata-rolemenu",
        params: { id: role },
      });
    };

    const handleDeleteItem = (item: any) => {
      axios.delete("/roles/" + item.key, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        swal.fire({
          title: "Berhasil!",
          text: "Role berhasil dihapus",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          // router.push({ name: "masterdata-validasi" });
          location.reload();
        });
      }).catch((error) => {
        swal.fire({
          title: "Role gagal dihapus!",
          text: error.response.data.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      });
    };

    const handleAuthorize = (item: any) => {
      console.log(item);
    };

    const handleValidate = (item: any) => {
      console.log(item);
    };

    return {
      headers,
      items,
      handleEditItem,
      handleDetailItem,
      handleDeleteItem,
      handleAuthorize,
      handleValidate,
    };
  },
  method: {},
});
</script>
