<template>
  <div class="container">
    <h3 style="display: inline-block">User Akses &nbsp</h3>
    <SettingIcon />
    <br />
    <div class="btn btn-sm btn-secondary" @click="backButton()">Kembali</div>
    <div class="btn btn-sm btn-success ms-2" @click="saveButton()">
      Simpan Perubahan
    </div>
    <div class="btn btn-sm btn-warning ms-2" @click="resetButton()">
      Reset Akses
    </div>
    <br />
    <small class="text-muted mt-2"
      >* Tombol reset digunakan untuk mereset akses sama dengan template
      role</small
    >
    <hr />
    <div class="mb-5">
      <div class="row mb-2">
        <div class="col-1">
          <label>User : </label>
        </div>
        <div class="col-3">
          {{ userProfile.firstName }} {{ userProfile.lastName }}
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-1">
          <label>Role : </label>
        </div>
        <div class="col-3">
          <select
            class="form-select"
            aria-label="Default select example"
            v-model="selectedRole"
            @change="fetchRoleMenus"
            required
          >
            <option disabled value="">Pilih Role</option>
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-1">Unit :</div>
        <div class="col-auto">
          <select
            class="form-select"
            aria-label="Default select example"
            v-model="selectedUnit"
            @change="fetchUnit()"
            required
          >
            <!-- <option disabled value="">Pilih Unit</option> -->
            <option value="" selected>-- Bukan Unit Anggaran --</option>
            <option v-for="unit in units" :key="unit.id" :value="unit">
              {{ unit.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-auto">Sub Unit :</div>
        <div class="col-auto">
          <select
            class="form-select"
            aria-label="Default select example"
            v-model="selectedSubUnit"
            @change="fetchSubUnit()"
            required
          >
            <!-- <option disabled value="">Pilih Sub Unit</option> -->
            <option value="" selected>-- Bukan Sub Unit Anggaran --</option>
            <option
              v-for="subUnit in subUnits"
              :key="subUnit.id"
              :value="subUnit"
            >
              {{ subUnit.name }}
            </option>
          </select>
        </div>
      </div>
      <DataTable
        :headers="headers"
        :items="items"
        @read-toggled="handleRead"
        @read-all-toggled="handleReadAll"
        @create-toggled="handleCreate"
        @update-toggled="handleUpdate"
        @delete-toggled="handleDelete"
      >
      </DataTable>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref, watch } from "vue";
import type { Header, Item } from "vue3-easy-data-table";
import DataTable from "@/components/table/datatable.vue";
import type { CryptoService } from "@/interfaces";
import type { AxiosInstance } from "axios";
import { swalWithCustomStyles } from "@/plugin/swal";
import { useRouter } from "vue-router";
import config from "@/config";

export default defineComponent({
  components: {
    SettingIcon,
    DataTable,
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

    const roles = ref<any>([]);
    const units = ref<any>([]);
    const subUnits = ref<any>([]);
    const selectedRole = ref("");
    const selectedUnit = ref<any>();
    const selectedSubUnit = ref<any>();
    const userRole = ref("");
    const userProfile = ref<any>([]);
    const userAccess = ref<any>([]);

    const headers = ref<Header[]>([
      { text: "No.", value: "index" },
      { text: "Menu", value: "nama", sortable: true },
      { text: "Read All", value: "is_readAllMenu" },
      { text: "Read", value: "is_readMenu" },
      { text: "Create", value: "is_createMenu" },
      { text: "Update", value: "is_updateMenu" },
      { text: "Delete", value: "is_deleteMenu" },
    ]);

    const items = ref<Item[]>([]);

    const token = crypto.getToken();

    const getAllMenu = async () => {
      try {
        const response = await axios.get("menus/", {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        let no = 0;
        items.value = response.data.data.map((menu: any) => ({
          index: ++no,
          key: menu.id,
          menu_id: menu.id,
          user_id: props.id,
          role_id: selectedRole.value,
          is_create: false,
          is_read_all: false,
          is_read: false,
          is_update: false,
          is_delete: false,
          nama: menu.name,
          note: menu.note,
        }));
      } catch (error) {}
    };

    const getAllUnit = async () => {
      try {
        const response = await axios.get("units?is_active=true", {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        units.value = response.data.data;
      } catch (error) {}
    };

    const getAllRole = async () => {
      try {
        const response = await axios.get("roles/", {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        roles.value = response.data.data;
      } catch (error) {}
    };

    const getUserAccess = async () => {
      try {
        const response = await axios.get(`/user-access?user_id=${props.id}`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        userAccess.value = response.data.data;
        if (userAccess.value.length != 0) {
          selectedRole.value = userAccess.value[0].role.id;
        } else {
          userRole.value = "";
          selectedRole.value = "";
        }
      } catch (error) {}
    };

    const getSubUnit = async () => {
      try {
        const response = await axios.get(
          `sub-units?unit_id=${selectedUnit.value.id}`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        subUnits.value = response.data.data;
        if (userProfile.value.sub_unit && !selectedSubUnit.value) {
          selectedSubUnit.value = subUnits.value.find(
            (subUnit: any) => subUnit.id === userProfile.value.sub_unit.id
          );
        }
      } catch (error) {}
    };

    const getUserProfile = async () => {
      try {
        const response = await axios.get(`user-profiles/${props.id}`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        userProfile.value = response.data.data;
        if (userProfile.value.length != 0) {
          if (userProfile.value.unit != null) {
            selectedUnit.value = userProfile.value.unit;
          }
        }
      } catch (error) {}
    };

    const fetchData = async () => {
      await getAllRole();
      await getAllUnit();
      await getAllMenu();
      await getUserAccess();
      await getUserProfile();
      await getSubUnit();
    };

    fetchData();

    const updateItemsWithAccess = (accessData: any) => {
      items.value.forEach((item) => {
        const access = accessData.find((acc: any) => acc.menu.id === item.key);
        if (access) {
          item.is_create = access.is_create;
          item.is_read_all = access.is_read_all;
          item.is_read = access.is_read;
          item.is_update = access.is_update;
          item.is_delete = access.is_delete;
        }
      });
    };

    const fetchRoleMenus = async () => {
      try {
        let response;
        if (selectedRole.value == userRole.value) {
          response = await axios.get(`/user-access?user_id=${props.id}`, {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          response = await axios.get(
            `role-menus?role_id=${selectedRole.value}`,
            {
              headers: {
                accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }

        // Reset items to their default state before applying new permissions
        items.value = items.value.map((item) => ({
          ...item,
          role_id: selectedRole.value,
          is_create: false,
          is_read_all: false,
          is_read: false,
          is_update: false,
          is_delete: false,
        }));

        updateItemsWithAccess(response.data.data);
      } catch (error) {
        console.error("Error fetching role menus:", error);
      }
    };

    watch(selectedRole, fetchRoleMenus);

    const backButton = () => {
      router.go(-1);
    };

    const saveButton = async () => {
      try {
        const payload = items.value;

        if (payload[0].role_id != "") {
          await axios.post("user-access", payload, {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          await axios.put(
            `user-profiles/${props.id}`,
            {
              firstName: userProfile.value.firstName,
              lastName: userProfile.value.lastName,
              address: userProfile.value.address,
              phoneNumber: userProfile.value.phoneNumber,
              unit_id: userProfile.value.unit_id,
              sub_unit_id: userProfile.value.sub_unit_id,
            },
            {
              headers: {
                accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          await swal.fire({
            title: "Berhasil!",
            text: "User Akses berhasil diperbarui",
            icon: "success",
            confirmButtonText: "OK",
          });
          location.reload();
        } else {
          swal.fire({
            title: "Gagal!",
            text: "Silakan pilih role terlebih dahulu!",
            icon: "error",
            confirmButtonText: "OK",
          });
        }

        fetchData(); // Re-fetch data instead of reloading the page
      } catch (error: any) {
        swal.fire({
          title: "Gagal!",
          text: error.response.data.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    const resetButton = async () => {
      try {
        const response = await axios.get(
          `role-menus?role_id=${selectedRole.value}`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Reset items to their default state before applying new permissions
        items.value = items.value.map((item) => ({
          ...item,
          role_id: selectedRole.value,
          is_create: false,
          is_read_all: false,
          is_read: false,
          is_update: false,
          is_delete: false,
        }));

        updateItemsWithAccess(response.data.data);
      } catch (error) {
        console.error("Error fetching role menus:", error);
      }
    };

    const toggleItemProperty = (item: any, property: any) => {
      const targetItem = items.value.find((i) => i.key === item.key);
      if (targetItem) {
        targetItem[property] = !targetItem[property];
      }
    };

    const fetchUnit = async () => {
      try {
        if (selectedUnit.value.id != null) {
          const response = await axios.get(
            `sub-units?unit_id=${selectedUnit.value.id}`,
            {
              headers: {
                accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          subUnits.value = response.data.data;
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSubUnit = async () => {
      if (selectedSubUnit.value != null) {
        userProfile.value.sub_unit = selectedSubUnit.value;
        userProfile.value.sub_unit_id = selectedSubUnit.value.id;
      } else {
        userProfile.value.sub_unit = null;
        userProfile.value.sub_unit_id = null;
      }
    };

    const handleCreate = (item: any) => toggleItemProperty(item, "is_create");
    const handleRead = (item: any) => toggleItemProperty(item, "is_read");
    const handleReadAll = (item: any) =>
      toggleItemProperty(item, "is_read_all");
    const handleUpdate = (item: any) => toggleItemProperty(item, "is_update");
    const handleDelete = (item: any) => toggleItemProperty(item, "is_delete");

    return {
      headers,
      items,
      selectedRole,
      selectedUnit,
      selectedSubUnit,
      roles,
      units,
      subUnits,
      userProfile,
      userRole,
      fetchRoleMenus,
      fetchUnit,
      fetchSubUnit,
      backButton,
      saveButton,
      resetButton,
      handleCreate,
      handleReadAll,
      handleRead,
      handleUpdate,
      handleDelete,
    };
  },
});
</script>
