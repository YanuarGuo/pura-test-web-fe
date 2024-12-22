<template>
  <div class="container">
    <h3 style="display: inline-block">Data Pengguna &nbsp</h3>
    <SettingIcon />
    <br />
    <form @submit.prevent="updateUser()">
      <button class="btn btn-sm btn-primary" type="submit">Simpan Perubahan</button>
      <hr />
      <div class="row">
        <div class="col-4">
          <label for="kode">Username</label>
          <input class="form-control" type="text" v-model="username" required />
        </div>
      </div>
      <div class="row">
        <div class="col-4">
          <label for="kode">Email</label>
          <div class="input-group mb-2">
            <input class="form-control" type="text" v-model="email" required />
            <div class="input-group-prepend">
              <div class="input-group-text">@uksw.edu</div>
            </div>
          </div>
        </div>
      </div>
      <button class="btn btn-sm btn-warning mt-3" @click="gantiPasswordHandle">Ganti Password</button>
      <div v-show="ganti_password">
        <div class="row mt-3">
          <div class="col-3">
            <label>Masukkan Password Baru</label>
            <input class="form-control" type="password" v-model="password" :required="ganti_password" />
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-3">
            <label>Konfirmasi Password Baru</label>
            <input class="form-control" type="password" v-model="password_confirm" :required="ganti_password" />
          </div>
        </div>
      </div>
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
  import Cookies from "js-cookie";

  export default defineComponent({
    components: {
      SettingIcon,
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
      const token = crypto.getToken();
      const ganti_password = ref(false);
      const username = ref("");
      const email = ref("");
      const password = ref("");
      const password_confirm = ref("");

      const fetchData = async () => {
        // await getSdg();
      };

      fetchData();

      const updateUser = async () => {
        let payload = {};
        if (ganti_password) {
          if (password != password_confirm) {
            payload = {
              username: username.value,
              email: email.value,
              password: password.value,
            };
            await axios
              .put(`auth/user/${props.id}`, payload, {
                headers: {
                  accept: "application/json",
                  Authorization: `Bearer ${token}`,
                },
              })
              .then((response) => {
                swal
                  .fire({
                    title: "Berhasil!",
                    text: "Data pengguna berhasil diperbarui, silakan Login kembali",
                    icon: "success",
                    confirmButtonText: "OK",
                  })
                  .then(() => {
                    Cookies.remove("token");
                    router.push("/");
                    location.reload();
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
          } else {
            swal.fire({
              title: "Gagal!",
              text: "Password harus sama dengan Password Konfirmasi",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        } else {
          payload = {
            username: username.value,
            email: email.value,
            password: "",
          };
          await axios
            .put(`auth/user/${props.id}`, payload, {
              headers: {
                accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              swal
                .fire({
                  title: "Berhasil!",
                  text: "Data pengguna berhasil diperbarui",
                  icon: "success",
                  confirmButtonText: "OK",
                })
                .then(() => {
                  location.reload();
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
        }
      };

      const gantiPasswordHandle = async () => {
        ganti_password.value = !ganti_password.value;
      };

      return {
        username,
        password,
        password_confirm,
        email,
        ganti_password,
        updateUser,
        gantiPasswordHandle,
      };
    },
  });
</script>
