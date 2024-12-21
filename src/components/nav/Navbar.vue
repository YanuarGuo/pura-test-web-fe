<template>
  <div class="col-md-2 col-lg-2 bg-light sidebar d-flex flex-column vh-100">
    <div>
      <router-link to="/" class="text-decoration-none">
        <div class="row ms-2 mt-3">
          <div class="col-auto me-0">
            <img src="/src/assets/Logo_uksw.png" width="50" />
          </div>
          <div class="col-auto ms-0">
            <h5 class="text-center text-primary fw-bold mt-3 mb-4">
              SIANGKASA
            </h5>
          </div>
        </div>
      </router-link>
      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link
            to="/"
            class="nav-link"
            :class="{ active: isActive('/dashboard') }"
            ><i class="bi bi-house me-2"></i>Dashboard</router-link
          >
        </li>
        <li v-for="(menu, index) in menus" :key="index" class="nav-item">
          <div
            class="nav-link"
            @click="toggleMenu(index)"
            :class="{ active: activeMenu === index || isActiveMenu(menu) }"
            :data-bs-toggle="'collapse'"
            :aria-expanded="activeMenu === index"
            :aria-controls="'collapse' + index"
          >
            <i class="bi bi-menu-button-wide-fill me-2"></i>
            {{ menu.title }}
          </div>
          <div
            :id="'collapse' + index"
            :class="[
              'collapse',
              { show: activeMenu === index || isActiveMenu(menu) },
            ]"
          >
            <ul class="nav flex-column ms-3">
              <li
                v-for="(subMenu, subIndex) in menu.subMenus"
                :key="subIndex"
                class="nav-item"
              >
                <router-link
                  :to="subMenu.path"
                  class="nav-link"
                  :class="{ active: isActive(subMenu.path) }"
                  >{{ subMenu.title }}</router-link
                >
              </li>
            </ul>
          </div>
        </li>
        <hr />
        <li class="nav-item">
          <div
            class="nav-link"
            :class="{ active: isActive('/user-update') }"
            @click="userUpdateHandle"
          >
            <i class="bi bi-person me-2"></i>
            {{ nama_lengkap }}
          </div>
        </li>
      </ul>
    </div>
    <div class="mt-auto mb-3">
      <ul class="nav flex-column">
        <li class="nav-item">
          <div class="nav-link" @click="logoutCall">
            <i class="bi bi-box-arrow-left me-2"></i>Logout
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import Cookies from "js-cookie";
import type { AuthInterface } from "@/interfaces";

export default defineComponent({
  setup() {
    const activeMenu = ref<number | null>(null);
    const route = useRoute();
    const router = useRouter();
    const auth = inject<AuthInterface>("$auth")!;
    const userProfile = ref<any>([]);
    const nama_lengkap = ref("");

    const toggleMenu = (index: number) => {
      activeMenu.value = activeMenu.value === index ? null : index;
    };

    type SubMenu = {
      title: string;
      path: string;
    };
    type Menu = {
      title: string;
      subMenus: SubMenu[];
    };
    let menus = ref<Menu[]>([]);

    const isActive = (path: string) => route.path.startsWith(path);

    const isActiveMenu = (menu: any) => {
      return menu.subMenus.some((subMenu: any) => isActive(subMenu.path));
    };

    const getUserAccess = async () => {
      try {
        const userAccessAll = auth.getUserAccess();
        userProfile.value = await auth.getUserProfile();
        nama_lengkap.value =
          userProfile.value.firstName.length > 15
            ? userProfile.value.firstName.substring(0, 25) + "...."
            : userProfile.value.firstName;
        if (
          userProfile.value &&
          userProfile.value.sub_unit_id != null &&
          userProfile.value.unit_id != null
        ) {
          menus.value = [
            {
              title: "Anggaran Pengeluaran",
              subMenus: [{ title: "Daftar RKAT", path: "/rkat/index" }],
            },
            {
              title: "Realisasi",
              subMenus: [
                { title: "Daftar Proposal", path: "/apbi/index" },
                { title: "Daftar Bon", path: "/bon/index" },
                { title: "Daftar FPA", path: "/fpa/index" },
                { title: "Daftar PTJ", path: "/ptj/index" },
              ],
            },
            {
              title: "Akuntansi",
              subMenus: [
                { title: "Bukti Memorial", path: "/akuntansi/memorial/index" },
              ],
            },
            // Add more menu items here as needed
          ];
        } else if (
          userProfile.value &&
          userProfile.value.sub_unit_id == null &&
          userProfile.value.unit_id != null
        ) {
          menus.value = [
            {
              title: "Anggaran Pendapatan",
              subMenus: [
                { title: "Plafon Unit", path: "/anggaran/plafon-unit" },
              ],
            },
            {
              title: "Anggaran Pengeluaran",
              subMenus: [{ title: "Daftar RKAT", path: "/rkat/index" }],
            },
            //{
            //title: "Realisasi",
            //subMenus: [
            //{ title: "Daftar Proposal", path: "/apbi/index" },
            //  { title: "Daftar Bon", path: "/bon/index" },
            //    { title: "Daftar FPA", path: "/fpa/index" },
            //    { title: "Daftar PTJ", path: "/ptj/index" },
            //  ],
            //},
            // Add more menu items here as needed
          ];
        } else {
          menus.value = [
            {
              title: "Master Data",
              subMenus: [
                { title: "User dan Role", path: "/masterdata/user" },
                { title: "Unit", path: "/masterdata/unit" },
                { title: "Periode", path: "/masterdata/periode" },
                { title: "Validasi", path: "/masterdata/validasi" },
                { title: "KPKS, IKS, dan Kegiatan", path: "/masterdata/kpks" },
                { title: "SDGs", path: "/masterdata/sdg" },
                { title: "Batasan Bon", path: "/masterdata/batasbon" },
              ],
            },
            {
              title: "Chart of Account",
              subMenus: [
                { title: "Kode CoA", path: "/coa/kode" },
                { title: "Chart of Account", path: "/coa/akun" },
              ],
            },
            {
              title: "Anggaran Pendapatan",
              subMenus: [
                { title: "Asumsi Pendapatan", path: "/anggaran/asumsi" },
                { title: "Plafon Universitas", path: "/anggaran/plafon-univ" },
                // { title: "Plafon Unit", path: "/anggaran/plafon-unit" },
              ],
            },
            {
              title: "Anggaran Pengeluaran",
              subMenus: [{ title: "Daftar RKAT", path: "/rkat/index" }],
            },
            {
              title: "Realisasi",
              subMenus: [
                { title: "Daftar Proposal", path: "/apbi/index" },
                { title: "Daftar Bon", path: "/bon/index" },
                { title: "Daftar FPA", path: "/fpa/index" },
                { title: "Daftar PTJ", path: "/ptj/index" },
                { title: "Transfer Dana", path: "/transfer/index" },
              ],
            },
            {
              title: "Akuntansi",
              subMenus: [
                { title: "Bukti Memorial", path: "/akuntansi/memorial/index" },
              ],
            },
            {
              title: "Penjurnalan",
              subMenus: [
                { title: "Umum", path: "/jurnal/umum/index" },
                {
                  title: "Buku Besar Umum",
                  path: "/jurnal/buku-besarUmum/index",
                },
                // {title: "Buku Besar Anggaran", path:"/jurnal/buku-besarAnggaran/index"},
                {
                  title: "Posisi Anggaran",
                  path: "/jurnal/posisi-anggaran/index",
                },
                { title: "Neraca Saldo", path: "/jurnal/neraca-saldo/index" },
              ],
            },
            {
              title: "Pelaporan",
              subMenus: [
                {
                  title: "Penghasilan Komprehensif",
                  path: "/laporan/penghasilan-komprehensif/index",
                },
                {
                  title: "Posisi Keuangan",
                  path: "/laporan/posisi-keuangan/index",
                },
                { title: "Aset Neto", path: "/laporan/aset-neto/index" },
              ],
            },
            // Add more menu items here as needed
          ];
        }
      } catch (error) {}
    };

    const fetchData = async () => {
      await getUserAccess();
    };
    fetchData();

    const logoutCall = () => {
      Cookies.remove("token");
      router.push("/");
      location.reload();
    };

    const userUpdateHandle = () => {
      router.push({
        name: "user-update",
        params: { id: userProfile.value.id },
      });
    };

    return {
      activeMenu,
      nama_lengkap,
      menus,
      userUpdateHandle,
      toggleMenu,
      isActive,
      isActiveMenu,
      logoutCall,
    };
  },
});
</script>

<style scoped></style>
