<template>
  <div class="container">
    <h3 style="display: inline-block">Tambah Data Pengguna &nbsp</h3>
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
          <label>Password : </label>
          <input
            type="password"
            class="form-control"
            required
            v-model="password"
          />
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
          <input
            type="text"
            class="form-control"
            required
            v-model="firstName"
          />
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
          <label>Role : </label>
          <input type="text" class="form-control" required v-model="role" />
          <small class="form-text text-muted">Format: user / admin</small>
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
          <input
            type="tel"
            pattern="[0-9]{12}"
            class="form-control"
            required
            v-model="phoneNumber"
          />
          <small class="form-text text-muted">Format: 08XXXXXXXXXX</small>
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
  components: {},
  setup() {
    const crypto = inject<CryptoService>("$crypto")!;
    const axios = inject<AxiosInstance>("$axios")!;
    const swal = inject("$swal") as typeof swalWithCustomStyles;
    const router = useRouter();

    const username = ref("");
    const email = ref("");
    const password = ref("");
    const firstName = ref("");
    const lastName = ref("");
    const role = ref("");
    const address = ref("");
    const phoneNumber = ref("");

    const createUser = () => {
      const token = crypto.getToken();

      const userPayload = {
        username: username.value,
        password: password.value,
        email: email.value,
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

      axios
        .post("/auth/register", userPayload, configRegister)
        .then((response: any) => {
          axios
            .post(
              "/user-profiles",
              {
                firstName: firstName.value,
                lastName: lastName.value,
                address: address.value,
                phoneNumber: phoneNumber.value,
                role: role.value,
                id: response.data.data.id,
              },
              configProfile
            )
            .then((response: any) => {
              swal
                .fire({
                  title: "Berhasil!",
                  text: "Pengguna berhasil ditambahkan",
                  icon: "success",
                  confirmButtonText: "OK",
                })
                .then(() => {
                  router.go(-1);
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
        })
        .catch((error: any) => {
          swal.fire({
            title: "Gagal!",
            text: error.response.data.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        });
    };

    return {
      username,
      email,
      password,
      firstName,
      lastName,
      address,
      phoneNumber,
      role,
      createUser,
    };
  },
  data() {
    return {
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      address: "",
      phoneNumber: "",
      role: "",
    };
  },

  methods: {},
  mounted() {},
});
</script>
