<template>
    <q-btn @click="logout" color="primary" unelevated>Logout</q-btn>
</template>
<script setup lang="ts">
import { usePBStore } from 'src/stores/pbStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const pbStore = usePBStore();

const logout = () => {
    pbStore.client?.authStore.clear();
    router.push({ path: "/" });
}

</script>