<template>
  <div class="center-container">
    <h1 style="font-size: 8cap">😅</h1>
    <h5 class="text-primary mb-0">
      Maaf Peminjamanan Ruang sedang maintenance saat ini
    </h5>
    <small class="text-muted mt-0"> Mohon tunggu beberapa saat</small>
    <button class="btn btn-sm btn-primary mt-2" @click="backButton()">
      Kembali
    </button>
  </div>
</template>

<script lang="ts">
import { useRouter } from "vue-router";
import { defineComponent } from "vue";
export default defineComponent({
  setup() {
    const router = useRouter();

    const backButton = () => {
      router.go(-1);
    };

    return {
      backButton,
    }
  },
});
</script>

<style scoped>
.center-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 75vh;
  text-align: center;
}
</style>
