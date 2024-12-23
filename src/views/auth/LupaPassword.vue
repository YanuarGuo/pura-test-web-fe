<template>
  <div class="d-flex justify-content-between align-items-center vh-100">
    <div class="bg-primary h-100 w-50"></div>
    <div class="w-50">
      <div class="container">
        <h3 class="fw-bold">Selamat Datang di Peminjaman Ruang!</h3>
        <p class="text-muted mt-1 mb-3">
          Silakan masukan email akun anda, untuk mengatur ulang password
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject } from "vue";
import { type AxiosInstance } from "axios";
import { useRouter } from "vue-router";
import { swalWithCustomStyles } from "@/plugin/swal";

export default defineComponent({
  setup() {
    const showPassword = ref(false);
    const email = ref("");
    const router = useRouter();
    const swal = inject("$swal") as typeof swalWithCustomStyles;
    const axios = inject<AxiosInstance>("$axios")!;

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    return {
      showPassword,
      togglePasswordVisibility,
      email,
    };
  },
});
</script>

<style scoped>
.vh-100 {
  height: 100vh;
}
</style>
