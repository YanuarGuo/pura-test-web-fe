<script lang="ts">
import Card from "@/components/card/dashboard-card.vue";
import {
  defineComponent,
  ref,
  inject,
  onMounted,
  defineAsyncComponent,
} from "vue";
import type { AuthInterface } from "@/interfaces";

export default defineComponent({
  components: {
    Card,
    BarChart: defineAsyncComponent(() => import("@/components/chart/bar.vue")),
  },
  setup() {
    const auth = inject<AuthInterface>("$auth")!;

    let fullName = ref("");

    const fetchUserProfile = async () => {
      try {
        const userProfile: any = await auth.getUserProfile();
        fullName.value = userProfile.firstName + " " + userProfile.lastName;
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    onMounted(() => {
      fetchUserProfile();
    });

    return {
      fullName,
    };
  },
});
</script>

<template>
  <div class="dashboard">
    <h5>Selamat datang di Sistem Peminjaman Ruang,</h5>
    <h3 style="display: inline-block">{{ fullName }}!</h3>
    <br />
    <div class="d-flex card-section">
      <Card>
        <template #header> Total Ruangan Terpakai </template>
        <template #body> </template>
      </Card>
      <Card>
        <template #header> Ruangan Paling Banyak Terpakai </template>
        <template #body> </template>
      </Card>
      <Card>
        <template #header> Ruangan Paling Sedikit Terpakai</template>
        <template #body> </template>
      </Card>
    </div>
    <BarChart />
  </div>
</template>

<style scoped>
.dashboard {
  display: block;
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
}

.card-section {
  justify-content: space-between;
}
</style>
