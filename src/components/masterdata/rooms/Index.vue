<template>
  <div class="container">
    <h3 style="display: inline-block">Master Data Rooms &nbsp</h3>
    <br />
    <small class="text-muted">*) Rooms</small>
    <br />
    <router-link
      v-if="userProfile && userProfile.role == 'admin'"
      to="/masterdata/rooms/create"
    >
      <div class="btn btn-sm btn-primary mt-2">Tambah</div>
    </router-link>
    <hr />
    <div class="mb-5">
      <DataTable
        :headers="headers"
        :items="items"
        @item-edited="handleEditItem"
        @item-deleted="handleDeleteItem"
      >
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
import auth from "@/plugin/auth";

export default defineComponent({
  components: {
    DataTable,
  },
  setup() {
    const crypto = inject<CryptoService>("$crypto")!;
    const axios = inject<AxiosInstance>("$axios")!;
    const router = useRouter();
    const userProfile = ref<any>([]);
    console.log("user", userProfile);

    const swal = inject("$swal") as typeof swalWithCustomStyles;

    const headers = ref<Header[]>([
      { text: "No.", value: "index" },
      { text: "Nama Room", value: "room_name", sortable: true },
      { text: "Lokasi", value: "location", sortable: true },
      { text: "Kapasitas", value: "capacity" },
      { text: "Deskripsi", value: "description", sortable: true },
      { text: "Aksi", value: "editDeleteOperation" },
    ]);

    const items = ref<Item[]>([]);

    const token = crypto.getToken();
    axios
      .get("/rooms", {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        let no = 0;
        console.log(response.data.data);

        items.value = response.data.data.map((row: any) => ({
          index: (no += 1),
          key: row.id,
          room_name: row.room_name,
          location: row.location,
          capacity: row.capacity,
          description: row.description,
        }));
      })
      .catch((error) => {});

    const getUserProfile = async () => {
      userProfile.value = await auth.getUserProfile();
      console.log(userProfile.value);
    };

    const fetchData = async () => {
      await getUserProfile();
    };

    fetchData();
    const handleEditItem = (item: any) => {
      const batas = item.key;
      router.push({
        name: "masterdata-rooms-update",
        params: { id: batas },
      });
    };

    const handleDeleteItem = (item: any) => {
      console.log(item);

      axios
        .delete("/rooms/" + item.key, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          swal
            .fire({
              title: "Berhasil!",
              text: "Ruangan berhasil dihapus",
              icon: "success",
              confirmButtonText: "OK",
            })
            .then(() => {
              location.reload();
            });
        })
        .catch((error) => {
          swal.fire({
            title: "Ruangan gagal dihapus!",
            text: error.response.data.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        });
    };

    return {
      userProfile,
      headers,
      items,
      handleEditItem,
      handleDeleteItem,
    };
  },
  method: {},
});
</script>
