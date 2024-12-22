<template>
  <div class="container">
    <h3 style="display: inline-block">Menu Role {{ role_name }}&nbsp</h3>
    <SettingIcon />
    <br />
    <div class="btn btn-sm btn-secondary" @click="backButton()">Kembali</div>
    <div class="btn btn-sm btn-success ms-2" @click="saveButton()">
      Simpan Perubahan
    </div>
    <hr />
    <div class="mb-5">
      <DataTable :headers="headers" :items="items" @read-toggled="handleRead" @read-all-toggled="handleReadAll"
        @create-toggled="handleCreate" @update-toggled="handleUpdate" @delete-toggled="handleDelete" />
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
    SettingIcon,
    DataTable,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const crypto = inject<CryptoService>("$crypto")!;
    const axios = inject<AxiosInstance>("$axios")!;
    const router = useRouter();
    const swal = inject("$swal") as typeof swalWithCustomStyles;

    const headers = ref<Header[]>([
      { text: "No.", value: "index" },
      { text: "Menu", value: "nama", sortable: true },
      { text: "Read All", value: "is_readAllMenu" },
      { text: "Read", value: "is_readMenu" },
      { text: "Create", value: "is_createMenu" },
      { text: "Update", value: "is_updateMenu" },
      { text: "Delete", value: "is_deleteMenu" },
      { text: "Keterangan", value: "note" },
    ]);

    const items = ref<Item[]>([]);
    const role_name = ref("");
    const token = crypto.getToken();

    const fetchRoleData = async () => {
      try {
        const response = await axios.get(`roles/${props.id}`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        role_name.value = response.data.data.name;
      } catch (error) { }
    };

    const fetchAllMenus = async () => {
      try {
        const response = await axios.get("menus/", {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        let no = 0;
        items.value = response.data.data.map((row: any) => ({
          index: (no += 1),
          key: row.id,
          menu_id: row.id,
          role_id: props.id,
          is_create: false,
          is_read_all: false,
          is_read: false,
          is_update: false,
          is_delete: false,
          nama: row.name,
          note: row.note,
        }));
      } catch (error) {
        ;
      }
    };

    const fetchRoleMenus = async () => {
      try {
        const response = await axios.get(`role-menus?role_id=${props.id}`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        for (let i = 0; i < items.value.length; i++) {
          for (let j = 0; j < response.data.data.length; j++) {
            if (items.value[i].key === response.data.data[j].menu.id) {
              items.value[i].is_create = response.data.data[j].is_create;
              items.value[i].is_read_all = response.data.data[j].is_read_all;
              items.value[i].is_read = response.data.data[j].is_read;
              items.value[i].is_update = response.data.data[j].is_update;
              items.value[i].is_delete = response.data.data[j].is_delete;
            }
          }
        }
      } catch (error) {
        ;
      }
    };

    const fetchData = async () => {
      await fetchRoleData();
      await fetchAllMenus();
      await fetchRoleMenus();
    };

    fetchData();

    const backButton = () => {
      router.go(-1);
    };

    const handleCreate = (item: any) => {
      const targetItem = items.value.find((i) => i.key === item.key);
      if (targetItem) {
        targetItem.is_create = !targetItem.is_create;
      }
    };

    const handleRead = (item: any) => {
      const targetItem = items.value.find((i) => i.key === item.key);
      if (targetItem) {
        targetItem.is_read = !targetItem.is_read;
      }
    };

    const handleReadAll = (item: any) => {
      const targetItem = items.value.find((i) => i.key === item.key);
      if (targetItem) {
        targetItem.is_read_all = !targetItem.is_read_all;
      }
    };

    const handleUpdate = (item: any) => {
      const targetItem = items.value.find((i) => i.key === item.key);
      if (targetItem) {
        targetItem.is_update = !targetItem.is_update;
      }
    };

    const handleDelete = (item: any) => {
      const targetItem = items.value.find((i) => i.key === item.key);
      if (targetItem) {
        targetItem.is_delete = !targetItem.is_delete;
      }
    };

    const saveButton = async () => {
      try {
        const payload = items.value;
        await axios.post("role-menus", payload, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        await swal.fire({
          title: "Berhasil!",
          text: "Role Menu berhasil diperbarui",
          icon: "success",
          confirmButtonText: "OK",
        });

        fetchData(); // Re-fetch data instead of reloading the page
      } catch (error: any) {
        swal.fire({
          title: "Gagal!",
          text: error.response.data.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    return {
      headers,
      items,
      role_name,
      saveButton,
      backButton,
      handleCreate,
      handleReadAll,
      handleRead,
      handleUpdate,
      handleDelete,
    };
  },
  method: {},
});
</script>
