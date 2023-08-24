<template>
    <q-btn @click="logout">Logout</q-btn>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { usePBStore } from 'src/stores/pbStore';
import { useRouter } from 'vue-router';

const pbStore = usePBStore();

const { userData } = storeToRefs(pbStore);

const router = useRouter();

const logout = () => {
    userData.value = undefined;
    router.push({ path: "/" });
}

</script>