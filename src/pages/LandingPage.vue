<template>
    <q-page class="row items-center justify-evenly">
        <div class="xs-row sm-column">
            Landing Page
            <LogoPage :width="90"/>
        </div>
        <div class="xs-row sm-column">
            <div class="row justify-center">
                <h5 class="font-bold q-ma-xs">Login with email</h5>
            </div>
            <div class="row q-ma-sm">
                <q-input class="full-width" v-model="email" label="Email" dense outlined></q-input>
            </div>
            <div class="row q-ma-sm">
                <q-input class="full-width" v-model="password" label="Password" type="password" name="password" dense
                    outlined></q-input>
            </div>
            <div class="row justify-center q-ma-sm">
                <q-btn type="submit" class="full-width" color="primary" @click="authWithPassword">Login</q-btn>
            </div>
            <div class="row q-mt-sm q-mb-sm items-center">
                <div class="col-4 line"></div>
                <div class="col-4 text-center">
                    <label>or log in with</label>
                </div>
                <div class="col-4 line"></div>
            </div>
            <div class="row justify-center">
                <q-btn class="full-width" v-for="provider of authProviders" @click="authWithOAuth2(provider)"
                    :icon="getIcon(provider)">{{
                        provider.name
                    }}</q-btn>
            </div>
        </div>
    </q-page>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useDBStore } from 'src/stores/dbStore';
import { ref, onMounted } from 'vue';
import { AuthProviderInfo } from 'pocketbase';
import { useUserStore } from 'src/stores/userStore';
import { useRouter } from 'vue-router';
import LogoPage from 'src/components/LogoPage.vue';

const router = useRouter();

const userStore = useUserStore();
const { } = storeToRefs(userStore);
const dbStore = useDBStore();
const { client } = storeToRefs(dbStore);

const authProviders = ref<AuthProviderInfo[]>([])

const email = ref<string>("");
const password = ref<string>("");

const authWithPassword = async () => {
    try {
        const userData = await dbStore.client.collection('users').authWithPassword(email.value, password.value);
        userStore.userID = userData.record!.id;
        userStore.userAvatar = userData.record!.avatar;
        userStore.username = userData.record!.username || userData.record!.name;
        router.push({ path: "/dashboard" });
    } catch (error) {
        console.log(error)
    }
}

const authWithOAuth2 = async (provider: AuthProviderInfo) => {
    const redirectUrl = process.env.BASE_URL + "/redirect";
    localStorage.setItem("provider", JSON.stringify(provider));
    window.location.href = provider.authUrl + redirectUrl;
}

const getIcon = (provider: AuthProviderInfo) => {
    return 'fa-brands fa-' + provider.name
}

onMounted(async () => {
    const authMethods = await dbStore.client.collection('users').listAuthMethods();
    authProviders.value = authMethods.authProviders;
    console.log(authMethods.authProviders);
})

</script>