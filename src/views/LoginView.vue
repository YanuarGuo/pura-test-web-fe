<template>
  <div class="d-flex justify-content-between align-items-center vh-100">
    <div class="bg-primary h-100 w-50"></div>
    <div class="w-50">
      <div class="container">
        <h3 class="fw-bold">Selamat Datang di SIANGKASA!</h3>
        <p class="text-muted mt-1 mb-3">
          Silakan masuk dengan akun yang Anda miliki
        </p>
        <form @submit.prevent="loginCall">
          <div class="row mt-5 mb-2">
            <div class="col-6">
              <input
                class="form-control"
                type="text"
                placeholder="Username"
                v-model="username"
                required
              />
            </div>
          </div>
          <div class="row mb-0">
            <div class="col-6">
              <div class="input-group mb-3">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control"
                  placeholder="Password"
                  v-model="password"
                  aria-label="Password"
                  required
                />
                <span
                  class="input-group-text"
                  @click="togglePasswordVisibility"
                >
                  <i
                    :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"
                  ></i>
                </span>
              </div>
            </div>
          </div>
          <RouterLink to="/lupa-password">
            <p class="mt-0">Lupa password?</p>
          </RouterLink>
          <button
            class="btn col-6 mx-0 px-0 btn-md btn-primary my-3"
            type="submit"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject } from "vue";
import type { CryptoService } from "@/interfaces";
import type { AxiosInstance } from "axios";
import { swalWithCustomStyles } from "@/plugin/swal";
import { useRouter } from "vue-router";
import Cookies from "js-cookie";

export default defineComponent({
  setup() {
    const crypto = inject<CryptoService>("$crypto")!;
    const axios = inject<AxiosInstance>("$axios")!;
    const router = useRouter();
    const swal = inject("$swal") as typeof swalWithCustomStyles;
    const showPassword = ref(false);
    const password = ref("");
    const username = ref("");
    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    const loginCall = async () => {
      try {
        await axios
          .post("/auth/login", {
            username: username.value,
            password: password.value,
          })
          .then((response) => {
            const token = response.data.data.token;
            // comment for maintenance
            Cookies.set("token", crypto.setToken(token), {
              expires: 1,
              secure: true,
              sameSite: "Lax",
            });
            swal
              .fire({
                title: "Login Berhasil!",
                text: "",
                icon: "success",
                confirmButtonText: "OK",
              })
              .then(() => {
                // for maintenance
                // router.push("/maintenance")
                // for deploy
                router.push("/");
                location.reload();
              });
          });
      } catch (error: any) {
        console.log(error);

        swal
          .fire({
            title: "Login Gagal!",
            text: error.response.data.message,
            icon: "error",
            confirmButtonText: "OK",
          })
          .then(() => {
            router.push("/");
            // location.reload();
          });
      }
    };

    return {
      showPassword,
      togglePasswordVisibility,
      loginCall,
      password,
      username,
    };
  },
  data() {
    return {
      username: "",
      password: "",
    };
  },
});
</script>

<style scoped>
.vh-100 {
  height: 100vh;
}
</style>
