<template>
    <div>
        {{ userData }}
        <btn-logout />
    </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import BtnLogout from 'src/components/BtnLogout.vue';
import { usePBStore } from 'src/stores/pbStore';

const pbStore = usePBStore();
const { userData } = storeToRefs(pbStore);


</script>