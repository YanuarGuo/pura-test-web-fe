<template>
  <div class="container">
    <h3 style="display: inline-block">Reservasi Ruangan &nbsp</h3>
    <br />
    <small class="text-muted">*) Reservasi Ruang</small>
    <br />
    <hr />
    <div class="mb-5">
      <DataTable
        :headers="headers"
        :items="items"
        @item-edited="handleEditItem"
        @item-pinjam="handlePinjamItem"
        @item-deleted="handleDeleteItem"
        @item-ajukan="handleAjukanItem"
        @item-validasi="handleTolakItem"
        @item-detail="handleTerimaItem"
      >
      </DataTable>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from "vue";
import type { Header, Item } from "vue3-easy-data-table";
import DataTable from "@/components/table/datatable.vue";
import type { CryptoService } from "@/interfaces";
import type { AxiosInstance } from "axios";
import { swalWithCustomStyles } from "@/plugin/swal";
import { useRouter } from "vue-router";
import config from "@/config";
import date from "@/plugin/date";

export default defineComponent({
  components: {
    DataTable,
  },
  setup() {
    const crypto = inject<CryptoService>("$crypto")!;
    const axios = inject<AxiosInstance>("$axios")!;
    const router = useRouter();
    const swal = inject("$swal") as typeof swalWithCustomStyles;

    const headers = ref<Header[]>([
      { text: "No.", value: "index" },
      { text: "Waktu Mulai", value: "start_time" },
      { text: "Waktu Selesai", value: "end_time" },
      { text: "Kegiatan", value: "purpose" },
      { text: "Status", value: "status" },
      { text: "Aksi", value: "reservationOperation" },
    ]);

    const items = ref<Item[]>([]);

    const token = crypto.getToken();
    axios
      .get("/reservation", {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        let no = 0;
        console.log(response.data.data);

        items.value = response.data.data.map((row: any) => ({
          index: (no += 1),
          key: row.id,
          room_id: row.room_id,
          start_time: date.timeStamptoDate(row.start_time),
          end_time: date.timeStamptoDate(row.end_time),
          purpose: row.purpose,
          status: row.status,
        }));
      })
      .catch((error) => {});

    const handleEditItem = (item: any) => {
      const batas = item.key;
      router.push({
        name: "masterdata-rooms-update",
        params: { id: batas },
      });
    };

    const handlePinjamItem = (item: any) => {
      const batas = item.room_id;
      router.push({
        name: "transactional-reservation-create",
        params: { id: batas },
      });
    };

    const handleDeleteItem = (item: any) => {
      console.log(item);

      axios
        .delete("/rooms/" + item.key, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          swal
            .fire({
              title: "Berhasil!",
              text: "Ruangan berhasil dihapus",
              icon: "success",
              confirmButtonText: "OK",
            })
            .then(() => {
              // router.push({ name: "masterdata-validasi" });
              location.reload();
            });
        })
        .catch((error) => {
          swal.fire({
            title: "Ruangan gagal dihapus!",
            text: error.response.data.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        });
    };

    const handleAjukanItem = (item: any) => {
      console.log(item);

      axios
        .put(
          "/reservation/validasi",
          {
            reservation_id: item.key,
            status: "ajukan",
          },
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          swal
            .fire({
              title: "Berhasil!",
              text: "Peminjaman berhasil diajukan",
              icon: "success",
              confirmButtonText: "OK",
            })
            .then(() => {
              // router.push({ name: "masterdata-validasi" });
              location.reload();
            });
        })
        .catch((error) => {
          swal.fire({
            title: "Peminjaman gagal!",
            text: error.response.data.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        });
    };

    const handleTolakItem = (item: any) => {
      console.log(item);

      axios
        .put(
          "/reservation/validasi",
          {
            reservation_id: item.key,
            status: "rejected",
          },
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          swal
            .fire({
              title: "Berhasil!",
              text: "Ditolak",
              icon: "success",
              confirmButtonText: "OK",
            })
            .then(() => {
              // router.push({ name: "masterdata-validasi" });
              location.reload();
            });
        })
        .catch((error) => {
          swal.fire({
            title: "Peminjaman gagal!",
            text: error.response.data.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        });
    };

    const handleTerimaItem = (item: any) => {
      console.log(item);

      axios
        .put(
          "/reservation/validasi",
          {
            reservation_id: item.key,
            status: "approved",
          },
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          swal
            .fire({
              title: "Berhasil!",
              text: "Peminjaman berhasil diterima",
              icon: "success",
              confirmButtonText: "OK",
            })
            .then(() => {
              // router.push({ name: "masterdata-validasi" });
              location.reload();
            });
        })
        .catch((error) => {
          swal.fire({
            title: "Peminjaman gagal!",
            text: error.response.data.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        });
    };

    return {
      headers,
      items,
      handleEditItem,
      handleDeleteItem,
      handleAjukanItem,
      handlePinjamItem,
      handleTolakItem,
      handleTerimaItem,
    };
  },
  method: {},
});
</script>
