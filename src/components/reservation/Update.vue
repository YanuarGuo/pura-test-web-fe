<template>
  <div class="container">
    <h3 style="display: inline-block">Ubah Data Reservasi &nbsp</h3>
    <br />
    <router-link to="/transactional/reservation">
      <div class="btn btn-sm btn-secondary">Kembali</div>
    </router-link>
    <hr />
    <form @submit.prevent="UpdateReservation()">
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
    const start_time = ref<any>();
    const end_time = ref<any>();
    const purpose = ref<any>();
    const token = crypto.getToken();

    const getReservation = async () => {
      try {
        const response = await axios.get(`reservation/${props.id}`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        start_time.value = response.data.data.start_time;
        end_time.value = response.data.data.end_time;
        purpose.value = response.data.data.purpose;
      } catch (error) {}
    };

    const fetchData = async () => {
      await getReservation();
    };

    fetchData();

    const UpdateReservation = async () => {
      const payload = {
        start_time: start_time.value,
        end_time: end_time.value,
        purpose: purpose.value,
      };
      await axios
        .put(`reservation/${props.id}`, payload, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          swal
            .fire({
              title: "Berhasil!",
              text: "Ruangan berhasil diperbarui",
              icon: "success",
              confirmButtonText: "OK",
            })
            .then(() => {
              router.push({ name: "transactional-reservation-update" });
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
      start_time,
      end_time,
      purpose,
      UpdateReservation,
    };
  },
});
</script>
