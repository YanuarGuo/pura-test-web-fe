<template>
  <div class="container">
    <h3 style="display: inline-block">Tambah Data Pengguna &nbsp</h3>
    <SettingIcon />
    <br />
    <router-link to="/masterdata/user">
      <div class="btn btn-sm btn-secondary">Kembali</div>
    </router-link>
    <hr />
    <form @submit.prevent="createUser">
      <h5>Data Pengguna :</h5>
      <div class="row">
        <div class="col-4">
          <label>Username : </label>
          <input type="text" class="form-control" required v-model="username" />
        </div>
        <div class="col-4">
          <label>Email : </label>
          <input type="text" class="form-control" required v-model="email" />
        </div>
      </div>
      <hr />
      <h5>Profil Pengguna :</h5>
      <div class="row">
        <div class="col-4">
          <label>Nama Depan : </label>
          <input type="text" class="form-control" required v-model="firstName" />
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-4">
          <label>Nama Belakang : </label>
          <input type="text" class="form-control" required v-model="lastName" />
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-4">
          <label>Alamat : </label>
          <input type="text" class="form-control" required v-model="address" />
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-4">
          <label>No. HP : </label>
          <input type="tel" pattern="[0-9]{12}" class="form-control" required v-model="phoneNumber" />
          <small class="form-text text-muted">Format: 08123456789</small>
        </div>
      </div>
      <button class="btn btn-sm btn-primary mt-3" type="submit">Simpan</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from "vue";
import type { CryptoService } from "@/interfaces";
import type { AxiosInstance } from "axios";
import { swalWithCustomStyles } from "@/plugin/swal";
import { useRouter } from "vue-router";
import config from "@/config";

export default defineComponent({
  components: {
    SettingIcon,
  },
  setup() {
    const crypto = inject<CryptoService>("$crypto")!;
    const axios = inject<AxiosInstance>("$axios")!;
    const swal = inject("$swal") as typeof swalWithCustomStyles;
    const router = useRouter();

    const username = ref("");
    const email = ref("");
    const firstName = ref("");
    const lastName = ref("");
    const address = ref("");
    const phoneNumber = ref("");

    const createUser = () => {
      const token = crypto.getToken();

      const userPayload = {
        username: username,
        password: "1sampai8",
        email: email,
      };

      const configRegister = {
        headers: {
          accept: "application/json",
        },
      };
      const configProfile = {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      axios.post("/auth/register", userPayload, configRegister)
        .then((response: any) => {
          axios.post(
            "/user-profiles",
            {
              firstName: firstName,
              lastName: lastName,
              address: address,
              phoneNumber: phoneNumber,
              id: response.data.data.id
            },
            configProfile
          ).then((response: any) => {
            swal.fire({
              title: "Berhasil!",
              text: "Pengguna berhasil ditambahkan",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              router.go(-1);
            });
          }).catch((error) => {
            swal.fire({
              title: "Gagal!",
              text: error.response.data.message,
              icon: "error",
              confirmButtonText: "OK",
            });
          });
        }).catch((error: any) => {
          swal.fire({
            title: "Gagal!",
            text: error.response.data.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        });
    }

    return {
      username,
      email,
      firstName,
      lastName,
      address,
      phoneNumber,
      createUser
    }
  },
  data() {
    return {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      phoneNumber: "",
    };
  },
  methods: {},
  mounted() { },
});
</script>
