<template>
    <div class="d-flex justify-content-between align-items-center vh-100">
        <div class="bg-primary h-100 w-50">
        </div>
        <div class="w-50">
            <div class="container">
                <h3 class="fw-bold">Selamat Datang di SIANGKASA!</h3>
                <p class="text-muted mt-1 mb-3">Silakan masukan email akun anda, untuk mengatur ulang password</p>
                <form @submit.prevent="resetCall()">
                    <div class="row mt-5 mb-2">
                        <div class="col-6">
                            <input class="form-control" type="text" placeholder="Email" v-model="email" required>
                        </div>
                    </div>
                    <button class="btn col-6 mx-0 px-0 btn-md btn-primary mt-3 mb-0" type="submit">Atur ulang
                        password</button>
                    <RouterLink to="/">
                        <p class="mt-0">Kembali</p>
                    </RouterLink>
                </form>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject } from 'vue';
import { type AxiosInstance } from 'axios';
import { useRouter } from 'vue-router';
import { swalWithCustomStyles } from '@/plugin/swal';

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

        const resetCall = () => {
            const apiUrl = '/auth/forgot-password';
            axios.post(apiUrl, {
                email: email.value,
            }).then((response) => {
                console.log(response);
                swal.fire({
                    title: 'Permintaan Berhasil!',
                    text: 'Silakan cek email pengguna',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    router.push('/'); // Navigate to the home page or another page after successful login
                });
            }).catch((error) => {
                swal.fire({
                    title: 'Permintaan Gagal!',
                    text: error.response.data.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
        };

        return {
            showPassword,
            togglePasswordVisibility,
            email,
            resetCall,
        };
    }
});
</script>

<style scoped>
.vh-100 {
    height: 100vh;
}
</style>