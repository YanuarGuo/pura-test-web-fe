<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import MainView from "./views/MainView.vue";
import crypto from "./plugin/crypto";
</script>

<script lang="ts">
let token = crypto.getToken();
</script>

<template>
  <MainView v-if="token != ''" />
  <router-view v-if="token == ''"></router-view>
</template>
