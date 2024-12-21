<template>
  <div class="row">
    <div class="col-auto">
      <span>Search: </span>
    </div>
    <div class="col-3">
      <input class="form-control mb-2" type="text" v-model="searchValue" />
    </div>
  </div>
  <EasyDataTable :headers="headers" :items="items" :server-items-length="serverItemsLength" :loading="loading"
    :server-options="serverOptions" :search-value="searchValue" buttons-pagination>
    <!-- Custom pagination slot -->
    <template #pagination>
      <div>
        <button @click="prevPage" :disabled="serverOptions.page === 1">
          Previous
        </button>
        <span>{{ serverOptions.page }} / {{ totalPage }}</span>
        <button @click="nextPage" :disabled="serverOptions.page === totalPage ||
          totalPage === 0
          ">
          Next
        </button>
      </div>
    </template>
    <template #item-IKSOperation="item">
      <button class="btn btn-sm btn-primary" @click="callApiDetail(item)">
        Kegiatan
      </button>
    </template>
  </EasyDataTable>
</template>

<script lang="ts">
import { defineComponent, ref, watch, inject, onMounted } from "vue";
import type { PropType } from "vue";
import type { Header, ServerOptions } from "vue3-easy-data-table";
import type { CryptoService } from "@/interfaces";
import type { AxiosInstance } from "axios";
import config from "@/config";

export default defineComponent({
  props: {
    headers: {
      type: Array as PropType<Header[]>,
      required: true,
    },
    apiUrl: {
      type: String,
      required: true,
    },
  },
  emits: ["item-detail"],
  setup(props, { emit }) {
    const crypto = inject<CryptoService>("$crypto")!;
    const axios = inject<AxiosInstance>("$axios")!;
    const serverItemsLength = ref(0);
    const serverOptions = ref<ServerOptions>({
      page: 1,
      rowsPerPage: 10,
    });
    var totalPage = 1;
    const items = ref<any[]>([]);
    const loading = ref(false);
    const searchValue = ref("");
    const token = crypto.getToken();

    const loadFromServer = async () => {
      loading.value = true;
      try {
        items.value = [];
        const response = await axios.get(
          `${props.apiUrl}&page=${serverOptions.value.page}&limit=${serverOptions.value.rowsPerPage}&search=${searchValue.value}`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.data);
        totalPage = response.data.data.totalPages;
        // Map API data to items array
        let no = 1;
        items.value = response.data.data.data.map((row: any) => {
          const item: any = {};
          props.headers.forEach((header) => {
            if (header.value !== "index") {
              item[header.value] = row[header.value];
            }
          });
          item.key = row.id;
          item.index = no++;
          return item;
        });
        serverItemsLength.value = response.data.data.totalItems;
      } catch (error) {
        console.error(error);
      } finally {
        loading.value = false;
      }
    };

    // Watch for changes in serverOptions and searchValue
    watch([serverOptions, searchValue], () => {
      loadFromServer();
    });

    // Function to handle next page
    const nextPage = () => {
      if (serverOptions.value.page < totalPage) {
        serverOptions.value.page++;
        loadFromServer();
      }
    };

    // Function to handle previous page
    const prevPage = () => {
      if (serverOptions.value.page > 1) {
        serverOptions.value.page--;
        loadFromServer();
      }
    };

    const callApiDetail = (item: any) => {
      emit("item-detail", item);
    };

    // Initial load
    onMounted(() => {
      loadFromServer();
    });


    return {
      serverOptions,
      totalPage,
      serverItemsLength,
      loading,
      items,
      nextPage,
      prevPage,
      callApiDetail,
      searchValue,
    };
  },
});
</script>
