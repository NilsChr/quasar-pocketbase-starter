<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { usePBStore } from './stores/pbStore';

const pbStore = usePBStore();

onMounted(() => {
  pbStore.init();
})

</script>
