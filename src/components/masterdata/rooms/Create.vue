<template>
  <div class="container">
    <h3 style="display: inline-block">Tambah Data Rooms &nbsp</h3>
    <br />
    <router-link to="/masterdata/rooms">
      <div class="btn btn-sm btn-secondary">Kembali</div>
    </router-link>
    <hr />
    <form @submit.prevent="createRooms()">
      <div class="row">
        <div class="col-4">
          <label for="room_name">Nama Ruang</label>
          <input
            class="form-control"
            type="text"
            v-model="room_name"
            required
          />
        </div>
        <div class="col-4">
          <label for="location">Lokasi</label>
          <input class="form-control" type="text" v-model="location" required />
        </div>
        <div class="col-4">
          <label for="capacity">Kapasitas</label>
          <input
            class="form-control"
            type="number"
            v-model="capacity"
            required
          />
        </div>
        <div class="col-4">
          <label for="description">Deskripsi</label>
          <input
            class="form-control"
            type="text"
            v-model="description"
            required
          />
        </div>
      </div>
      <button class="btn btn-sm btn-primary mt-3" type="submit">Simpan</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from "vue";
import selectSearch from "@/components/input/selectSearch.vue";
import numericInput from "@/components/input/numeric.vue";
import type { CryptoService } from "@/interfaces";
import type { AxiosInstance } from "axios";
import { swalWithCustomStyles } from "@/plugin/swal";
import { useRouter } from "vue-router";
import config from "@/config";

export default defineComponent({
  components: {
    selectSearch,
    numericInput,
  },
  setup() {
    const crypto = inject<CryptoService>("$crypto")!;
    const axios = inject<AxiosInstance>("$axios")!;
    const router = useRouter();
    const swal = inject("$swal") as typeof swalWithCustomStyles;
    const room_name = ref<any>();
    const location = ref<any>();
    const capacity = ref<any>();
    const description = ref<any>();
    const token = crypto.getToken();

    const createRooms = async () => {
      const payload = {
        room_name: room_name.value,
        location: location.value,
        capacity: capacity.value,
        description: description.value,
      };
      await axios
        .post("rooms", payload, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          swal
            .fire({
              title: "Berhasil!",
              text: "Ruangan berhasil ditambahkan",
              icon: "success",
              confirmButtonText: "OK",
            })
            .then(() => {
              router.push({ name: "masterdata-rooms" });
              // location.reload();
            });
        })
        .catch((error) => {
          swal.fire({
            title: "Gagal!",
            text: error.response.data.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        });
    };

    return {
      room_name,
      location,
      capacity,
      description,
      createRooms,
    };
  },
});
</script>
