<template>
  <q-page class="row full-height full-width">
    <editor :document-id="activeDoc" />
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import Editor from 'src/components/Editor.vue';
import { useDBStore } from 'src/stores/dbStore';

const dbStore = useDBStore();
const { activeDoc } = storeToRefs(dbStore);

</script>
