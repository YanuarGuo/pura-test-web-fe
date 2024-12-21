<template>
  <div class="row">
    <div class="col-auto">
      <span>Search: </span>
    </div>
    <div class="col-3">
      <input class="form-control mb-2" type="text" v-model="searchValue" />
    </div>
  </div>
  <EasyDataTable :headers="headers" :items="items" :search-value="searchValue">
    <template #item-editDeleteOperation="item">
      <button class="btn btn-sm btn-warning mx-2" @click="editItem(item)">
        Edit
      </button>
      <button class="btn btn-sm btn-danger" @click="deleteItem(item)">
        Delete
      </button>
    </template>
    <template #item-detailOperation="item">
      <button class="btn btn-sm btn-primary mx-2" @click="callApiDetail(item)">
        Detail
      </button>
    </template>
    <template #item-plafonUnitOperation="item">
      <button class="btn btn-sm btn-primary me-2" @click="callApiDetail(item)">
        Detail
      </button>
      <button
        v-if="item.status.length == 0 && item.total_plafon != 'Rp. 0'"
        class="btn btn-sm btn-success"
        @click="callAjukan(item)"
      >
        Ajukan
      </button>
      <button
        v-if="item.status.length != 0 && item.status[0]?.status == 'DIAJUKAN'"
        class="btn btn-sm btn-success"
        @click="callValidasi(item)"
      >
        Validasi
      </button>
    </template>
    <template #item-BMOperation="item">
      <button
        v-if="
          userAccessBm &&
          userAccessBm.is_create &&
          ((userProfile &&
            item.status_enum?.status === 'DIREVISI') ||
            (item.status_enum == null &&
              userProfile))
        "
        class="btn btn-sm btn-warning mx-2"
        @click="editItem(item)"
      >
        Edit
      </button>
      <button
        v-show="
          userAccessBm &&
          userAccessBm.is_delete &&
          userProfile &&
          item.status_enum == null
        "
        class="btn btn-sm btn-danger"
        @click="deleteItem(item)"
      >
        Delete
      </button>
      <button class="btn btn-sm btn-primary mx-2" @click="callApiDetail(item)">
        Detail
      </button>
      <!-- Ajukan Action -->
      <button
        class="btn btn-sm btn-success ms-2"
        v-show="
          userAccessBm &&
          userAccessBm.is_create &&
          userProfile &&
          (item.status_enum == null || item.status_enum.status == 'DIREVISI')
        "
        @click="callAjukan(item)"
      >
        Ajukan
      </button>
      <!-- Validasi Akuntansi -->
      <button
        v-if="item.status_enum != null"
        v-show="
          userAccessBm &&
          userAccessBm.is_create &&
          userProfile &&
          item.status_enum.status == 'DIAJUKAN'
        "
        class="btn btn-sm btn-success ms-2"
        @click="callValidasi(item)"
      >
        Validasi Bag. Akuntansi
      </button>
      <!-- Validasi Kep Daku -->
      <button
        v-if="item.status_enum != null"
        v-show="
          userAccessBm &&
          userAccessBm.is_create &&
          userProfile &&
          item.status_enum.status == 'DITERIMA_AKUNTANSI'
        "
        class="btn btn-sm btn-success ms-2"
        @click="callValidasi(item)"
      >
        Validasi Dir. DAKU
      </button>
    </template>
    <template #item-RKATOperation="item">
      <button class="btn btn-sm btn-primary" @click="callApiDetail(item)">
        Detail
      </button>
      <button
        v-if="
          userAccessRkat &&
          userAccessRkat.is_create &&
          ((userProfile &&
            userProfile.sub_unit_id == null &&
            userProfile.unit_id == null &&
            item.status_enum?.status === 'DITERIMA') ||
            (userProfile &&
              userProfile.sub_unit_id != null &&
              userProfile.unit_id != null &&
              item.status_enum?.status === 'DIREVISI') ||
            (item.status_enum == null &&
              userProfile &&
              userProfile.sub_unit_id != null))
        "
        class="btn btn-sm btn-warning ms-2"
        @click="editItem(item)"
      >
        Edit
      </button>
      <button
        class="btn btn-sm btn-success ms-2"
        v-show="
          userAccessRkat &&
          userAccessRkat.is_update &&
          userProfile &&
          userProfile.sub_unit_id != null &&
          userProfile.unit_id != null &&
          (item.status_enum == null || item.status_enum.status == 'DIREVISI')
        "
        @click="callAjukan(item)"
      >
        Ajukan
      </button>
      <button
        class="btn btn-sm btn-danger ms-2"
        v-show="
          userAccessRkat &&
          userAccessRkat.is_update &&
          userProfile &&
          userProfile.sub_unit_id != null &&
          userProfile.unit_id != null &&
          (item.status_enum == null || item.status_enum.status == 'DITOLAK')
        "
        @click="deleteItem(item)"
      >
        Hapus
      </button>
      <button
        class="btn btn-sm btn-success ms-2"
        v-if="item.status_enum != null"
        v-show="
          userAccessRkat &&
          userAccessRkat.is_update &&
          userProfile &&
          userProfile.sub_unit_id != null &&
          userProfile.unit_id != null &&
          item.status_enum.status == 'DITERIMA_KOM_ANGGARAN' &&
          item.jenis_kegiatan == 'Non Rutin'
        "
        @click="callProposal(item)"
      >
        Proposal
      </button>
      <button
        v-if="item.status_enum != null"
        v-show="
          userAccessRkat &&
          userAccessRkat.is_create &&
          userProfile &&
          userProfile.sub_unit_id == null &&
          userProfile.unit_id != null &&
          item.status_enum.status == 'DIAJUKAN'
        "
        class="btn btn-sm btn-success ms-2"
        @click="callValidasi(item)"
      >
        Validasi
      </button>
      <button
        v-if="item.status_enum != null"
        v-show="
          userAccessRkat &&
          userAccessRkat.is_create &&
          userProfile &&
          userProfile.sub_unit_id == null &&
          userProfile.unit_id == null &&
          item.status_enum.status == 'DITERIMA'
        "
        class="btn btn-sm btn-success ms-2"
        @click="callValidasi(item)"
      >
        Validasi
      </button>
    </template>
    <template #item-BonOperation="item">
      <button class="btn btn-sm btn-primary" @click="callApiDetail(item)">
        Detail
      </button>
      <button
        v-if="
          userAccessBon &&
          userAccessBon.is_create &&
          userProfile &&
          userProfile.sub_unit_id != null &&
          userProfile.unit_id != null &&
          item.status_enum?.status === 'DITERIMA_PIMPINAN' &&
          item.ptj.length == 0
        "
        class="btn btn-sm btn-ptj ms-2"
        @click="callPtj(item)"
      >
        PTJ
      </button>
      <button
        v-if="
          userAccessBon &&
          userAccessBon.is_create &&
          ((userProfile &&
            userProfile.sub_unit_id != null &&
            userProfile.unit_id != null &&
            item.status_enum?.status === 'DIREVISI') ||
            (item.status_enum == null &&
              userProfile &&
              userProfile.sub_unit_id != null))
        "
        class="btn btn-sm btn-warning ms-2"
        @click="editItem(item)"
      >
        Edit
      </button>
      <button
        class="btn btn-sm btn-success ms-2"
        v-show="
          userAccessBon &&
          userAccessBon.is_create &&
          userProfile &&
          userProfile.sub_unit_id != null &&
          userProfile.unit_id != null &&
          (item.status_enum == null || item.status_enum.status == 'DIREVISI')
        "
        @click="callAjukan(item)"
      >
        Ajukan
      </button>
      <button
        class="btn btn-sm btn-danger ms-2"
        v-show="
          userAccessBon &&
          userAccessBon.is_delete &&
          userProfile &&
          userProfile.sub_unit_id != null &&
          userProfile.unit_id != null &&
          item.status_enum == null
        "
        @click="deleteItem(item)"
      >
        Delete
      </button>
      <!-- validasi unit button -->
      <button
        v-if="item.status_enum != null"
        v-show="
          userAccessBon &&
          userAccessBon.is_create &&
          userProfile &&
          userProfile.sub_unit_id == null &&
          userProfile.unit_id != null &&
          item.status_enum.status == 'DIAJUKAN'
        "
        class="btn btn-sm btn-success ms-2"
        @click="callValidasi(item)"
      >
        Validasi Unit
      </button>
      <!-- Validasi VVD -->
      <button
        v-if="item.status_enum != null"
        v-show="
          userAccessBon &&
          userAccessBon.role.is_validate &&
          userAccessBon.is_create &&
          userProfile &&
          userProfile.sub_unit_id == null &&
          userProfile.unit_id == null &&
          item.status_enum.status == 'DITERIMA_UNIT'
        "
        class="btn btn-sm btn-success ms-2"
        @click="callValidasi(item)"
      >
        Validasi VVD
      </button>
      <!-- Validasi Pimpinan -->
      <button
        v-if="item.status_enum != null"
        v-show="
          userAccessBon &&
          userAccessBon.role.is_authorize &&
          userAccessBon.is_create &&
          item.status_enum.status == 'DITERIMA_VVD'
        "
        class="btn btn-sm btn-success ms-2"
        @click="callValidasi(item)"
      >
        Validasi Pimpinan
      </button>
    </template>
    <template #item-FPAOperation="item">
      <button class="btn btn-sm btn-primary" @click="callApiDetail(item)">
        Detail
      </button>
      <button
        v-if="
          userAccessFpa &&
          userAccessFpa.is_create &&
          ((userProfile &&
            userProfile.sub_unit_id != null &&
            userProfile.unit_id != null &&
            item.status_enum?.status === 'DIREVISI') ||
            (item.status_enum == null &&
              userProfile &&
              userProfile.sub_unit_id != null))
        "
        class="btn btn-sm btn-warning ms-2"
        @click="editItem(item)"
      >
        Edit
      </button>
      <button
        class="btn btn-sm btn-success ms-2"
        v-show="
          userAccessFpa &&
          userAccessFpa.is_create &&
          userProfile &&
          userProfile.sub_unit_id != null &&
          userProfile.unit_id != null &&
          (item.status_enum == null || item.status_enum.status == 'DIREVISI')
        "
        @click="callAjukan(item)"
      >
        Ajukan
      </button>
      <button
        class="btn btn-sm btn-danger ms-2"
        v-show="
          userAccessFpa &&
          userAccessFpa.is_delete &&
          userProfile &&
          userProfile.sub_unit_id != null &&
          userProfile.unit_id != null &&
          item.status_enum == null
        "
        @click="deleteItem(item)"
      >
        Delete
      </button>
      <!-- validasi unit button -->
      <button
        v-if="item.status_enum != null"
        v-show="
          userAccessFpa &&
          userAccessFpa.is_create &&
          userProfile &&
          userProfile.sub_unit_id == null &&
          userProfile.unit_id != null &&
          item.status_enum.status == 'DIAJUKAN'
        "
        class="btn btn-sm btn-success ms-2"
        @click="callValidasi(item)"
      >
        Validasi Unit
      </button>
      <!-- Validasi VVD -->
      <button
        v-if="item.status_enum != null"
        v-show="
          userAccessFpa &&
          userAccessFpa.role.is_validate &&
          userAccessFpa.is_create &&
          userProfile &&
          userProfile.sub_unit_id == null &&
          userProfile.unit_id == null &&
          item.status_enum.status == 'DITERIMA_UNIT'
        "
        class="btn btn-sm btn-success ms-2"
        @click="callValidasi(item)"
      >
        Validasi VVD
      </button>
      <!-- Validasi Pajak -->
      <!-- <button
        v-if="item.status_enum != null"
        v-show="
          userAccessFpa &&
          userAccessFpa.is_update &&
          userAccessFpa.is_create &&
          userProfile &&
          userProfile.sub_unit_id == null &&
          userProfile.unit_id == null &&
          item.status_enum.status == 'DITERIMA_VVD'
        "
        class="btn btn-sm btn-success ms-2"
        @click="callPajak(item)"
      >
        Input Pajak
      </button> -->
      <!-- Validasi Pimpinan -->
      <button
        v-if="item.status_enum != null"
        v-show="
          userAccessFpa &&
          userAccessFpa.role.is_authorize &&
          userAccessFpa.is_create &&
          item.status_enum.status == 'DITERIMA_VVD'
        "
        class="btn btn-sm btn-success ms-2"
        @click="callValidasi(item)"
      >
        Otorisasi
      </button>
    </template>
    <template #item-PTJOperation="item">
      <button class="btn btn-sm btn-primary" @click="callApiDetail(item)">
        Detail
      </button>
      <button
        v-if="
          userAccessPtj &&
          userAccessPtj.is_create &&
          ((userProfile &&
            userProfile.sub_unit_id != null &&
            userProfile.unit_id != null &&
            item.status_enum?.status === 'DIREVISI') ||
            (item.status_enum == null &&
              userProfile &&
              userProfile.sub_unit_id != null))
        "
        class="btn btn-sm btn-warning ms-2"
        @click="editItem(item)"
      >
        Edit
      </button>
      <button
        class="btn btn-sm btn-success ms-2"
        v-show="
          userAccessPtj &&
          userAccessPtj.is_create &&
          userProfile &&
          userProfile.sub_unit_id != null &&
          userProfile.unit_id != null &&
          (item.status_enum == null || item.status_enum.status == 'DIREVISI')
        "
        @click="callAjukan(item)"
      >
        Ajukan
      </button>
      <button
        class="btn btn-sm btn-danger ms-2"
        v-show="
          userAccessPtj &&
          userAccessPtj.is_delete &&
          userProfile &&
          userProfile.sub_unit_id != null &&
          userProfile.unit_id != null &&
          item.status_enum == null
        "
        @click="deleteItem(item)"
      >
        Delete
      </button>
      <!-- validasi unit button -->
      <button
        v-if="item.status_enum != null"
        v-show="
          userAccessPtj &&
          userAccessPtj.is_create &&
          userProfile &&
          userProfile.sub_unit_id == null &&
          userProfile.unit_id != null &&
          item.status_enum.status == 'DIAJUKAN'
        "
        class="btn btn-sm btn-success ms-2"
        @click="callValidasi(item)"
      >
        Validasi Unit
      </button>
      <!-- Validasi VVD -->
      <button
        v-if="item.status_enum != null"
        v-show="
          userAccessPtj &&
          userAccessPtj.role.is_validate &&
          userAccessPtj.is_create &&
          userProfile &&
          userProfile.sub_unit_id == null &&
          userProfile.unit_id == null &&
          item.status_enum.status == 'DITERIMA_UNIT'
        "
        class="btn btn-sm btn-success ms-2"
        @click="callValidasi(item)"
      >
        Validasi VVD
      </button>
      <!-- Validasi Pajak -->
      <!-- <button
        v-if="item.status_enum != null"
        v-show="
          userAccessPtj &&
          userAccessPtj.is_update &&
          userAccessPtj.is_create &&
          userProfile &&
          userProfile.sub_unit_id == null &&
          userProfile.unit_id == null &&
          item.status_enum.status == 'DITERIMA_VVD'
        "
        class="btn btn-sm btn-success ms-2"
        @click="callPajak(item)"
      >
        Input Pajak
      </button> -->
      <!-- Validasi Pimpinan -->
      <button
        v-if="item.status_enum != null"
        v-show="
          userAccessPtj &&
          userAccessPtj.role.is_authorize &&
          userAccessPtj.is_create &&
          item.status_enum.status == 'DITERIMA_VVD'
        "
        class="btn btn-sm btn-success ms-2"
        @click="callValidasi(item)"
      >
        Otorisasi
      </button>
    </template>
    <template #item-APBIOperation="item">
      <button class="btn btn-sm btn-primary" @click="callApiDetail(item)">
        Lihat RKAT
      </button>
      <button class="ms-2 btn btn-sm btn-secondary" @click="callApiDetailProposal(item)">
        Detail
      </button>
      <button
        v-show="
          item.rkat.kegiatan_id.klasifikasi != 'Rutin' &&
          item.status_proposal == 'Belum Diajukan'
        "
        class="btn btn-sm ms-2 btn-success"
        @click="callAjukan(item)"
      >
        Ajukan
      </button>
      <button
        v-if="item.status_enum != null"
        v-show="
          item.rkat.kegiatan_id.klasifikasi != 'Rutin' &&
          userProfile &&
          userProfile.sub_unit_id == null &&
          userProfile.unit_id != null &&
          item.status_enum.status == 'DIAJUKAN'
        "
        class="btn btn-sm btn-success ms-2"
        @click="callValidasi(item)"
      >
        Validasi
      </button>
      <button
        v-if="item.status_enum != null"
        v-show="
          item.rkat.kegiatan_id.klasifikasi != 'Rutin' &&
          userProfile &&
          userProfile.sub_unit_id == null &&
          userProfile.unit_id == null &&
          item.status_enum.status == 'DITERIMA_UNIT'
        "
        class="btn btn-sm btn-success ms-2"
        @click="callValidasi(item)"
      >
        Validasi
      </button>
      <button
        v-if="item.status_enum != null"
        v-show="
          item.rkat.kegiatan_id.klasifikasi != 'Rutin' &&
          item.status_enum.status == 'DITERIMA_VVD'
        "
        class="btn btn-sm btn-success ms-2"
        @click="callValidasi(item)"
      >
        Validasi Pimpinan
      </button>
      <button
        v-if="
          userProfile &&
          userProfile.sub_unit_id != null &&
          userProfile.unit_id != null &&
          currencyToInteger(item.total_rkat) >
            currencyToInteger(item.total_realisasi) &&
          (item.status_enum.status == 'DITERIMA_PIMPINAN' ||
            item.rkat.kegiatan_id.klasifikasi == 'Rutin')
        "
        class="btn btn-sm btn-bon ms-2"
        @click="callBon(item)"
      >
        Bon
      </button>
      <button
        v-if="
          userProfile &&
          userProfile.sub_unit_id != null &&
          userProfile.unit_id != null &&
          currencyToInteger(item.total_rkat) >
            currencyToInteger(item.total_realisasi) &&
          (item.status_enum.status == 'DITERIMA_PIMPINAN' ||
            item.rkat.kegiatan_id.klasifikasi == 'Rutin')
        "
        class="btn btn-sm btn-fpa ms-2"
        @click="callFpa(item)"
      >
        FPA
      </button>
    </template>
    <template #item-editNonAktifOperation="item">
      <button class="btn btn-sm btn-warning mx-2" @click="editItem(item)">
        Edit
      </button>
      <button class="btn btn-sm btn-danger" @click="deleteItem(item)">
        Non Aktif
      </button>
    </template>
    <template #item-KPKSIndexOperation="item">
      <button class="btn btn-sm btn-primary" @click="callApiDetail(item)">
        Lihat IKS
      </button>
    </template>
    <template #item-KPKSOperation="item">
      <button class="btn btn-sm btn-primary" @click="callApiDetail(item)">
        Lihat KPKS
      </button>
    </template>
    <template #item-IKSOperation="item">
      <button class="btn btn-sm btn-primary" @click="callApiDetail(item)">
        Kegiatan
      </button>
    </template>
    <template #item-UnitOperation="item">
      <button class="btn btn-sm btn-warning mx-2" @click="editItem(item)">
        Edit
      </button>
      <button
        class="btn btn-sm btn-secondary me-2"
        @click="callApiDetail(item)"
      >
        Lihat Sub Unit
      </button>
      <button class="btn btn-sm btn-danger" @click="deleteItem(item)">
        Delete
      </button>
    </template>
    <template #item-RoleOperation="item">
      <button class="btn btn-sm btn-warning mx-2" @click="editItem(item)">
        Edit
      </button>
      <button
        class="btn btn-sm btn-secondary me-2"
        @click="callApiDetail(item)"
      >
        Menu
      </button>
      <button class="btn btn-sm btn-danger" @click="deleteItem(item)">
        Delete
      </button>
    </template>
    <template #item-SubUnitOperation="item">
      <button class="btn btn-sm btn-warning mx-2" @click="editItem(item)">
        Edit
      </button>
      <button class="btn btn-sm btn-danger" @click="deleteItem(item)">
        Delete
      </button>
    </template>
    <template #item-listSubUnit="item">
      <button class="btn btn-sm btn-warning mx-2" @click="callApiDetail(item)">
        Sub Unit
      </button>
    </template>
    <template #item-InputOperation="item">
      <button class="btn btn-sm btn-success mx-2" @click="callApiDetail(item)">
        Input
      </button>
    </template>
    <template #item-userOperation="item">
      <button class="btn btn-sm btn-warning" @click="editItem(item)">
        Edit
      </button>
      <button
        class="btn btn-sm btn-secondary ms-2"
        @click="callApiDetail(item)"
      >
        User Akses
      </button>
    </template>
    <template #item-switchStatus="item">
      <div class="form-check form-switch">
        <input
          class="form-check-input"
          type="checkbox"
          :checked="item.periodeStatus"
          @change="toggleStatus(item)"
        />
        <p v-if="item.periodeStatus">Aktif</p>
        <p v-if="!item.periodeStatus">Non Aktif</p>
      </div>
    </template>
    <template #item-roleAuthorize="item">
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          :checked="item.is_authorize"
          @change="toggleAuthorize(item)"
        />
      </div>
    </template>
    <template #item-roleValidate="item">
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          :checked="item.is_validate"
          @change="toggleValidate(item)"
        />
      </div>
    </template>
    <template #item-is_createMenu="item">
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          :checked="item.is_create"
          @change="toggleCreate(item)"
        />
      </div>
    </template>
    <template #item-is_readAllMenu="item">
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          :checked="item.is_read_all"
          @change="toggleReadAll(item)"
        />
      </div>
    </template>
    <template #item-is_readMenu="item">
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          :checked="item.is_read"
          @change="toggleRead(item)"
        />
      </div>
    </template>
    <template #item-is_updateMenu="item">
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          :checked="item.is_update"
          @change="toggleUpdate(item)"
        />
      </div>
    </template>
    <template #item-is_deleteMenu="item">
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          :checked="item.is_delete"
          @change="toggleDelete(item)"
        />
      </div>
    </template>
    <template #item-inputplafonakademik="item">
      <DebouncedCurrencyInput
        v-model="item.plafon_pendapatan_akademik"
        :options="currencyOptions"
        required
        @value-updated="handleInputPlafon"
        @value-inputed="inputPlafon(item, 1)"
        :readonly_value="item.edit"
      />
    </template>
    <template #item-inputplafonnonakademik="item">
      <DebouncedCurrencyInput
        v-model="item.plafon_pendapatan_non_akademik"
        :options="currencyOptions"
        required
        @value-updated="handleInputPlafon"
        @value-inputed="inputPlafon(item, 2)"
        :readonly_value="item.edit"
      />
    </template>
    <template #item-inputplafonbelanja="item">
      <DebouncedCurrencyInput
        v-model="item.plafon_belanja"
        :options="currencyOptions"
        required
        @value-updated="handleInputPlafon"
        @value-inputed="inputPlafon(item, 3)"
        :readonly_value="item.edit"
      />
    </template>
    <template #item-inputplafoninvestasi="item">
      <DebouncedCurrencyInput
        v-model="item.plafon_investasi"
        :options="currencyOptions"
        required
        @value-updated="handleInputPlafon"
        @value-inputed="inputPlafon(item, 4)"
        :readonly_value="item.edit"
      />
    </template>
    <template #item-nominalInput="item">
      <DebouncedCurrencyInput
        v-model="item.nominalRealisasi"
        :options="getCurrencyOptions(item.maxInput)"
        @value-updated="handleInputRealisasi"
        @value-inputed="inputRealisasi(item)"
      />
    </template>
    <template #item-uploadFile="item">
      <input
        type="file"
        class="form-control"
        @input="handleInputFile"
        @change="inputFile(item)"
      />
    </template>
    <template #item-updateFile="item">
      <input
        type="file"
        class="form-control"
        @input="handleInputFile"
        @change="inputFile(item)"
      />
      <a
        href="#"
        class="text-reset"
        @click="handleDownloadFile(item.url_lampiran)"
        >Unduh dokumen sebelumnya</a
      >
    </template>
    <template #item-downloadFile="item">
      <a
        href="#"
        class="text-reset"
        @click="handleDownloadFile(item.url_lampiran)"
        title="Unduh Dokumen"
      >
        Unduh dokumen detail
      </a>
    </template>
    <template #item-inputJumlah="item">
      <div class="row m-1">
        <input
          type="number"
          class="form-control"
          v-model="item.jumlah"
          min="1"
          required
          @input="handleInputJumlah(item.jumlah, item), updateItem(item)"
        />
      </div>
    </template>
    <template #item-inputNominal="item">
      <div class="row m-1">
        <DebouncedCurrencyInput
          v-model="item.harga_satuan"
          :options="currencyOptions"
          required
          @input="updateHargaValue(item)"
          @value-updated="handleInputHarga"
          @value-inputed="updateItem(item)"
        />
      </div>
    </template>
    <template #item-totalInput="item">
      <div class="row m-1">
        <DebouncedCurrencyInput
          v-model="item.totalInput"
          :options="currencyOptions"
          readonly
        />
      </div>
    </template>
    <template #header-select>
      <input
        type="checkbox"
        @change="toggleSelectAll"
        :checked="areAllRowsSelected"
      />
    </template>
    <template #item-select="item">
      <input
        type="checkbox"
        :checked="selectedRows.includes(item.key)"
        @change="toggleRowSelection(item.key)"
      />
    </template>
    <template #item-deskripsiJurnal="item">
      <!-- {{ value }} -->
      <span v-html="item.deskripsi"></span>
    </template>
    <template #item-akunKomprehensif="item">
      <span v-html="item.akun"></span>
    </template>
  </EasyDataTable>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from "vue";
import DebouncedCurrencyInput from "@/components/input/currency.vue";
import type { AxiosInstance } from "axios";
import type { CryptoService, AuthInterface } from "@/interfaces";
import type { Header, Item } from "vue3-easy-data-table";
import type { PropType } from "vue";
import currency from "@/plugin/currency";
import config from "@/config";

export default defineComponent({
  name: "DataTable",
  setup() {
    const crypto = inject<CryptoService>("$crypto")!;
    const axios = inject<AxiosInstance>("$axios")!;
    const auth = inject<AuthInterface>("$auth");

    const token = crypto.getToken();

    const userAccessRkat = ref<any>();
    const userAccessBon = ref<any>();
    const userAccessPtj = ref<any>();
    const userAccessFpa = ref<any>();
    const userAccessBm = ref<any>();

    let userAccessAll: any = ref([]);
    const userProfile = ref<any>();

    const getAccess = async () => {
      if (auth) userAccessAll.value = await auth.getUserAccess();
      const nameRkat = "Lihat RKAT Anggaran";
      const nameBon = "BON";
      const nameFpa = "FPA";
      const namePtj = "PTJ";
      const nameBm = "Bukti Memorial";
      const foundRkat = userAccessAll.value.data.find(
        (item: Item) => item.menu.name === nameRkat
      );
      userAccessRkat.value = foundRkat;

      const foundBon = userAccessAll.value.data.find(
        (item: Item) => item.menu.name === nameBon
      );
      userAccessBon.value = foundBon;

      const foundFpa = userAccessAll.value.data.find(
        (item: Item) => item.menu.name === nameFpa
      );
      userAccessFpa.value = foundFpa;

      const foundPtj = userAccessAll.value.data.find(
        (item: Item) => item.menu.name === namePtj
      );
      userAccessPtj.value = foundPtj;
      const foundBm = userAccessAll.value.data.find(
        (item: Item) => item.menu.name === nameBm
      );
      userAccessBm.value = foundBm;
    };

    const getUserProfile = async () => {
      try {
        const response = await axios.get("user-profiles", {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        userProfile.value = response.data.data[0];
      } catch (error) {
        console.log(error);
      }
    };

    const fetchData = async () => {
      await getAccess();
      await getUserProfile();
    };

    fetchData();

    return {
      userAccessRkat,
      userAccessBon,
      userAccessFpa,
      userAccessPtj,
      userAccessBm,
      userProfile,
      token,
      axios,
    };
  },
  data() {
    return {
      searchValue: "",
      currencyOptions: {
        currency: "IDR",
        locale: "id-ID",
        prefix: "Rp. ",
        precision: 0,
        min: 0,
        useGrouping: true,
        hideCurrencySymbolOnFocus: false,
        hideGroupingSeparatorOnFocus: false,
        hideNegligibleDecimalDigitsOnFocus: false,
      },
      currencyRealisasiOptions: {
        currency: "IDR",
        locale: "id-ID",
        prefix: "Rp. ",
        precision: 0,
        min: 0,
        useGrouping: true,
        hideCurrencySymbolOnFocus: false,
        hideGroupingSeparatorOnFocus: false,
        hideNegligibleDecimalDigitsOnFocus: false,
      },
      plafonValue: 0,
      realisasiValue: 0,
      fileValue: ref<FileList | null>(null),
      itemValue: {
        harga_satuan: 0,
        jumlah: 1,
        totalInput: 0,
      },
      selectedRows: ref<any[]>([]),
    };
  },
  components: {
    DebouncedCurrencyInput,
  },
  emits: [
    "item-edited",
    "item-deleted",
    "item-detail",
    "item-detail-proposal",
    "item-ajukan",
    "item-proposal",
    "item-validasi",
    "item-updated",
    "item-bon",
    "item-fpa",
    "item-ptj",
    "item-pajak",
    "status-toggled",
    "authorize-toggled",
    "validate-toggled",
    "read-toggled",
    "create-toggled",
    "update-toggled",
    "delete-toggled",
    "read-all-toggled",
    "plafon-input",
    "realisasi-input",
    "file-input",
    "row-selected",
  ],
  computed: {
    areAllRowsSelected() {
      return this.selectedRows.length === this.items.length;
    },
  },
  methods: {
    editItem(item: any) {
      this.$emit("item-edited", item);
    },
    deleteItem(item: any) {
      this.$emit("item-deleted", item); // assuming item has an id property
    },
    callApiDetail(item: any) {
      this.$emit("item-detail", item); // assuming item has an id property
    },
    callApiDetailProposal(item: any) {
      this.$emit("item-detail-proposal", item); // assuming item has an id property
    },
    callAjukan(item: any) {
      this.$emit("item-ajukan", item); // assuming item has an id property
    },
    callProposal(item: any) {
      this.$emit("item-proposal", item); // assuming item has an id property
    },
    callValidasi(item: any) {
      this.$emit("item-validasi", item); // assuming item has an id property
    },
    callBon(item: any) {
      this.$emit("item-bon", item);
    },
    callFpa(item: any) {
      this.$emit("item-fpa", item);
    },
    callPtj(item: any) {
      this.$emit("item-ptj", item);
    },
    callPajak(item: any) {
      this.$emit("item-pajak", item);
    },
    toggleStatus(item: any) {
      item.periodeStatus = !item.periodeStatus; // toggle status
      this.$emit("status-toggled", item);
    },
    toggleAuthorize(item: any) {
      item.is_authorize = !item.is_authorize; // toggle status
      this.$emit("authorize-toggled", item);
    },
    toggleValidate(item: any) {
      item.is_validate = !item.is_validate; // toggle status
      this.$emit("validate-toggled", item);
    },
    toggleReadAll(item: any) {
      item.is_read_all = !item.is_read_all; // toggle status
      this.$emit("read-all-toggled", item);
    },
    toggleRead(item: any) {
      item.is_read = !item.is_read; // toggle status
      this.$emit("read-toggled", item);
    },
    toggleUpdate(item: any) {
      item.is_update = !item.is_update; // toggle status
      this.$emit("update-toggled", item);
    },
    toggleCreate(item: any) {
      item.is_create = !item.is_create; // toggle status
      this.$emit("create-toggled", item);
    },
    toggleDelete(item: any) {
      item.is_delete = !item.is_delete; // toggle status
      this.$emit("delete-toggled", item);
    },
    inputPlafon(item: any, jenis: Number) {
      // jenis :
      // 1 = pendapatan akademik
      // 2 = pendapatan non akademik
      // 3 = belanja
      // 4 = investasi
      if (jenis === 1) {
        item.plafon_pendapatan_akademik = this.plafonValue;
      } else if (jenis === 2) {
        item.plafon_pendapatan_non_akademik = this.plafonValue;
      } else if (jenis === 3) {
        item.plafon_belanja = this.plafonValue;
      } else {
        item.plafon_investasi = this.plafonValue;
      }
      this.$emit("plafon-input", item);
    },
    inputRealisasi(item: any) {
      item.nominalRealisasi = this.realisasiValue;
      this.$emit("realisasi-input", item);
    },
    inputFile(item: any) {
      item.files = this.fileValue ? this.fileValue[0] : null;
      this.$emit("file-input", item);
    },
    handleInputPlafon(plafon: any) {
      this.plafonValue = plafon;
    },
    handleInputRealisasi(realisasi: any) {
      this.realisasiValue = realisasi;
    },
    handleInputFile(event: Event) {
      this.fileValue = (event.target as HTMLInputElement).files;
    },
    handleDownloadFile(url_file: string) {
      const token = this.token;
      this.axios
        .get(`files/${url_file}`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Set the response type to blob
        })
        .then((response: any) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          const path = url_file;
          const parts = path.split("/");
          link.setAttribute("download", parts[2]); // Set the file name
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch((error: any) => {});
    },
    getCurrencyOptions(maxInput: number) {
      return {
        ...this.currencyRealisasiOptions,
        max: maxInput,
      };
    },
    currencyToInteger(curr: string) {
      const nominal = currency.rupiahToInt(curr);
      return nominal;
    },
    handleInputHarga(harga: any) {
      this.itemValue.harga_satuan = harga;
      this.calculateTotalInput();
    },
    handleInputJumlah(jumlah: any, item: any) {
      this.itemValue = item;
      this.itemValue.jumlah = jumlah;
      this.calculateTotalInput();
    },
    updateHargaValue(item: any) {
      this.itemValue = item;
    },
    calculateTotalInput() {
      this.itemValue.totalInput =
        this.itemValue.jumlah * this.itemValue.harga_satuan;
    },
    updateItem(updatedItem: any) {
      updatedItem.jumlah = this.itemValue.jumlah;
      updatedItem.harga_satuan = this.itemValue.harga_satuan;
      updatedItem.totalInput = this.itemValue.totalInput;
      this.$emit("item-updated", updatedItem);
    },
    toggleSelectAll(event: any) {
      if (event.target.checked) {
        this.selectedRows = this.items.map((item) => item.key);
      } else {
        this.selectedRows = [];
      }
      this.$emit("row-selected", this.selectedRows);
    },
    toggleRowSelection(rowId: any) {
      if (this.selectedRows.includes(rowId)) {
        this.selectedRows = this.selectedRows.filter(
          (key: any) => key !== rowId
        );
      } else {
        this.selectedRows.push(rowId);
      }
      this.$emit("row-selected", this.selectedRows);
    },
  },
  props: {
    headers: {
      type: Array as PropType<Header[]>,
      required: true,
    },
    items: {
      type: Array as PropType<Item[]>,
      required: true,
    },
  },
});
</script>
: { menu: { name: string; }; }: { menu: { name: string; }; }: { menu: { name:
string; }; }: { menu: { name: string; }; }: { data: BlobPart; }: any(: any)(:
any)
