<template>
  <div class="container">
    <h3 style="display: inline-block">Tambah Role &nbsp</h3>
    <SettingIcon />
    <br />
    <div class="btn btn-sm btn-secondary" @click="backButton()">Kembali</div>
    <hr />
    <form @submit.prevent="createRole()">
      <div class="row">
        <div class="col-3">
          <label for="nama">Nama Role : </label>
          <input type="text" class="form-control" v-model="nama" required />
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-auto">
          <input class="form-check-input" type="checkbox" value="" checked v-model="is_validate" />
          <label class="form-check-label ms-2" for="flexCheckChecked">
            Validasi
          </label>
        </div>
        <div class="col-auto">
          <input class="form-check-input" type="checkbox" value="" checked v-model="is_authorize" />
          <label class="form-check-label ms-2" for="flexCheckChecked">
            Otorisasi
          </label>
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-4">
          <label for="nama">Keterangan :</label>
          <textarea class="form-control" v-model="note"></textarea>
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
import { useRouter } from "vue-router";
import { swalWithCustomStyles } from "@/plugin/swal";
import config from "@/config";
export default defineComponent({
  components: {
    SettingIcon,
  },
  setup() {
    const crypto = inject<CryptoService>("$crypto")!;
    const axios = inject<AxiosInstance>("$axios")!;
    const router = useRouter();
    const swal = inject("$swal") as typeof swalWithCustomStyles;

    const nama = ref("");
    const note = ref("");
    const is_validate = ref(true);
    const is_authorize = ref(true)

    const createRole = () => {
      const token = crypto.getToken();
      axios.post("/roles",
        {
          name: nama,
          note: note,
          is_authorize: is_authorize,
          is_validate: is_validate
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
          text: "Role berhasil ditambahkan",
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
    }

    const backButton = () => {
      router.go(-1);
    }

    return {
      nama,
      note,
      is_validate,
      is_authorize,
      createRole,
      backButton
    }
  },
  data() {
    return {
      nama: "",
      note: "",
      is_validate: true,
      is_authorize: true,
    };
  },
  methods: {},
  mounted() { },
});
</script>
