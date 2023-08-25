<template>
    <div class="xs-row sm-column" v-if="!loading">

        <!-- LOGIN -->
        <form v-if="!createAccountMode">
            <div class="row justify-center">
                <h5 class="font-bold q-ma-xs">Login</h5>
            </div>
            <div class="row q-ma-sm">
                <q-input class="full-width" v-model="email" label="Email" dense outlined></q-input>
            </div>
            <div class="row q-ma-sm">
                <q-input class="full-width" v-model="password" label="Password" type="password" name="password" dense
                    outlined autocomplete="on"></q-input>
            </div>
            <div class="row justify-center q-ma-sm">
                <q-btn unelevated class="full-width" color="primary" @click="authWithPassword">Login</q-btn>
            </div>
            <div class="row justify-center q-ma-sm q-mt-lg">
                <q-btn unelevated class="full-width" color="primary" @click="createAccountMode = true">Create
                    Account</q-btn>
            </div>
        </form>

        <!-- SIGN UP -->
        <signup v-if="createAccountMode" @on-created="createAccountMode = false;" @on-cancel="createAccountMode = false"/>

        <div class="separator q-mt-lg q-mb-lg" v-if="!createAccountMode">or</div>

        <!-- OAUTH 2 -->
        <div class="row justify-center q-ma-sm" v-if="authProviders.length > 0 && !createAccountMode">
            <transition-group appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">

                <q-btn class="full-width q-ma-xs" v-for="provider of authProviders" @click="authWithOAuth2(provider)"
                    :key="`auth-${provider.name}`" outline>
                    <div class="row no-wrap full-width" style="position: relative;">
                        <img class="absolute provider-icon q-ml-md" style="height:22px; width:22px"
                            :src="getAuthLogo(provider)" />
                        <div class="col-12 text-center">
                            {{ provider.name }}
                        </div>
                    </div>
                </q-btn>
            </transition-group>
        </div>
    </div>
    <div class="xs-row sm-column" v-else>
        <div class="row justify-center items-center">
            <q-spinner-tail color="primary" size="2em" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { AuthProviderInfo } from "pocketbase";
import { usePBStore } from "src/stores/pbStore";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Signup from "./Signup.vue"

const router = useRouter();
const pbStore = usePBStore();
const authProviders = ref<AuthProviderInfo[]>([])
const email = ref<string>("");
const password = ref<string>("");
const loading = ref<boolean>(false);
const createAccountMode = ref<boolean>(false);


const authWithPassword = async () => {
    if (pbStore.client === null) return;
    try {
        await pbStore.client.collection('users').authWithPassword(email.value, password.value);
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

const getAuthLogo = (provider: AuthProviderInfo): string => {
    return process.env.POCKETBASE_URL + `/_/images/oauth2/${provider.name}.svg`
}

onMounted(async () => {
    if (pbStore.client === null) return;
    loading.value = true;
    const authMethods = await pbStore.client.collection('users').listAuthMethods();
    authProviders.value = authMethods.authProviders;
    loading.value = false;
})

</script>
<style scoped>
.separator {
    display: flex;
    align-items: center;
    text-align: center;
}

.separator::before,
.separator::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #E0E0E0;
}

.separator::before {
    margin-right: .5em;
}

.separator::after {
    margin-left: .5em;
}
</style>