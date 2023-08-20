<template>
    <div>
        {{ userStore.userID }}
        <q-btn @click="logout">Logout</q-btn>
    </div>
</template>
<script setup lang="ts">
import { useDBStore } from 'src/stores/dbStore';
import { useUserStore } from 'src/stores/userStore';
import { useRouter } from 'vue-router';


const userStore = useUserStore();
const dbStore = useDBStore();
const router = useRouter();

const logout = () => {
    userStore.clear();
    dbStore.client.authStore.clear();
    // Redirect to the login page
    router.push({ path: "/" });
}

</script>