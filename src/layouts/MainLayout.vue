<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white text-black">
      <q-toolbar>

        <q-btn class="lt-md" dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title class="row">
          <LogoPage :width="30" />
          Blogal
        </q-toolbar-title>

        <q-avatar @click="toSettings">
          <img :src="img">
        </q-avatar>

      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <div class="full-height row column">
        <div class="col-2 row column q-pa-sm">
          <div class="col-2">
            <q-btn color="primary" class="full-width" size="sm" icon="add" unelevated @click="dbStore.createDocument()"
              :loading="loading">New Document</q-btn>
          </div>
          <div class="col-5 q-pt-sm">
            <q-input v-model="searchTitle" label="Title" hide-bottom-space dense hide-hint filled debounce="250">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-5 q-pt-sm">
            <q-input v-model="searchTags" label="Tags" hide-bottom-space dense hide-hint filled debounce="250">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="col-10 q-pa-sm" style="overflow-y: scroll;">
          <q-list bordered separator>
            <q-item clickable v-ripple v-for="doc in documents" :key="doc.id" @click="setActiveDoc(doc)">
              <q-item-section> {{ doc.title }}</q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import LogoPage from 'src/components/LogoPage.vue';
import { useDBStore } from 'src/stores/dbStore';
import { useUserStore } from 'src/stores/userStore';
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router';
import { Record } from 'pocketbase';

const dbStore = useDBStore();
const { documents, loading, activeDoc, searchTitle, searchTags } = storeToRefs(dbStore);

const userStore = useUserStore();
const user = storeToRefs(userStore);

const router = useRouter();

const leftDrawerOpen = ref<boolean>(true);
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const img = process.env.API + `/api/files/_pb_users_auth_/${user.userID.value}/${user.userAvatar.value}`

const toSettings = () => {
  router.push({ path: "/settings" });
}

const setActiveDoc = (doc: any) => {
  activeDoc.value = doc;
  router.push({ path: "/dashboard" });

}

onMounted(() => {
  dbStore.loadDocuments();
  console.log('USER', user)
})
//@request.auth.id != "" && (owner ?= @request.auth.id || editor.id ?=  @request.auth.id) 
</script>