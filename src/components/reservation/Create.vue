<template>
  <div class="container">
    <h3 style="display: inline-block">Tambah Data Reservasi &nbsp</h3>
    <br />
    <router-link to="/transactional/reservation">
      <div class="btn btn-sm btn-secondary">Kembali</div>
    </router-link>
    <hr />
    <form @submit.prevent="createReservation()">
      <div class="row">
        <h5>Data Ruangan</h5>
        <div class="col-4">
          <label for="room_name">Nama Ruang</label>
          <input
            class="form-control"
            type="text"
            v-model="room_name"
            readonly
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
            readonly
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
      <div class="row">
        <h5>Data Peminjaman</h5>
        <div class="col-4">
          <label for="room_name">Tanggal Mulai</label>
          <input
            class="form-control"
            type="date"
            v-model="start_time"
            required
          />
        </div>
        <div class="col-4">
          <label for="location">Tanggal Selesai</label>
          <input class="form-control" type="date" v-model="end_time" required />
        </div>
        <div class="col-4">
          <label for="capacity">Tujuan Pemakaian</label>
          <input class="form-control" type="text" v-model="purpose" required />
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
    const purpose = ref("");
    const start_time = ref("");
    const end_time = ref("");
    const room_name = ref<any>();
    const location = ref<any>();
    const capacity = ref<any>();
    const description = ref<any>();
    const token = crypto.getToken();

    const getRooms = async () => {
      try {
        const response = await axios.get(`rooms/${props.id}`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        room_name.value = response.data.data.room_name;
        location.value = response.data.data.location;
        capacity.value = response.data.data.capacity;
        description.value = response.data.data.description;
      } catch (error) {}
    };

    const fetchData = async () => {
      await getRooms();
    };

    fetchData();

    const createReservation = async () => {
      console.log(start_time.value);

      const payload = {
        room_id: props.id,
        start_time: start_time.value,
        end_time: end_time.value,
        purpose: purpose.value,
        status: "pending",
      };
      await axios
        .post("reservation", payload, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          swal
            .fire({
              title: "Berhasil!",
              text: "Peminjaman berhasil ditambahkan",
              icon: "success",
              confirmButtonText: "OK",
            })
            .then(() => {
              router.push({ name: "transactional-reservation" });
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
      start_time,
      end_time,
      purpose,
      createReservation,
    };
  },
});
</script>
