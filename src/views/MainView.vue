<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from '@/components/nav/Navbar.vue';
</script>

<template>
    <div class="container-fluid">
        <div class="row">
            <Navbar></Navbar>
            <div class="col-md-auto ms-sm-auto col-lg-10 px-md-1" style="max-height: 100vh; overflow-y: scroll;">
                <div class="my-5 mx-0 px-0" style="width: 100%;">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>