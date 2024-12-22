<template>
  <div class="container">
    <h3 style="display: inline-block">Edit Profil Pengguna &nbsp</h3>
    <SettingIcon />
    <br />
    <router-link to="/masterdata/user">
      <div class="btn btn-sm btn-secondary">Kembali</div>
    </router-link>
    <hr />
    <form @submit.prevent="updateUserData">
      <h5>Profil Pengguna :</h5>
      <div class="row">
        <div class="col-4">
          <label>Nama Depan : </label>
          <input type="text" class="form-control" required v-model="userData.firstName" />
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-4">
          <label>Nama Belakang : </label>
          <input type="text" class="form-control" required v-model="userData.lastName" />
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-4">
          <label>Alamat : </label>
          <input type="text" class="form-control" required v-model="userData.address" />
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-4">
          <label>No. HP : </label>
          <input type="tel" pattern="[0-9]{12}" class="form-control" required v-model="userData.phoneNumber" />
          <small class="form-text text-muted">Format: 08123456789</small>
        </div>
      </div>
      <button class="btn btn-sm btn-primary mt-3" type="submit">Simpan</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject } from "vue";
import type { CryptoService } from "@/interfaces";
import type { AxiosInstance } from "axios";
import { swalWithCustomStyles } from "@/plugin/swal";
import { useRouter } from "vue-router";
import config from "@/config";

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

    const userData = ref<any>([]);

    const token = crypto.getToken();

    const getUserProfile = async () => {
      try {
        const response = await axios.get(`user-profiles/${props.id}`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        userData.value = response.data.data;
      } catch (error) { }
    };

    const fetchData = async () => {
      await getUserProfile();
    };

    fetchData();

    const updateUserData = async () => {
      try {
        await axios.put(`user-profiles/${props.id}`,
          {
            firstName: userData.value.firstName,
            lastName: userData.value.lastName,
            address: userData.value.address,
            phoneNumber: userData.value.phoneNumber,
            unit_id: userData.value.unit_id,
            sub_unit_id: userData.value.sub_unit_id,
          },
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        ).then((response) => {
          swal.fire({
            title: "Berhasil!",
            text: "Profil Pengguna berhasil diubah!",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            router.go(-1);
          });
        });
      } catch (error: any) {
        swal.fire({
          title: "Gagal!",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    return {
      userData,
      updateUserData,
    };
  },
});
</script>
