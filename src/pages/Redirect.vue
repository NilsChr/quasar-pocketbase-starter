<template>
    <div class="container fluid full-height ">
        <div class="row full-height justify-center align-center items-center">
            <pre id="content">Authenticating...</pre>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useDBStore } from 'src/stores/dbStore';
import { useUserStore } from 'src/stores/userStore';
import { useRouter } from 'vue-router';

const dbStore = useDBStore();
const userStore = useUserStore();
const client = dbStore.client;
const router = useRouter();

const redirectUrl = process.env.BASE_URL + '/redirect';
const params = (new URL(window.location.href)).searchParams;

const provider = JSON.parse(localStorage.getItem('provider')!)
if (provider.state !== params.get("state")) {
    throw "State parameters don't match.";
}

async function checkAuth() {
    try {

        const userData = await client.collection('users').authWithOAuth2(
            provider.name,
            params.get("code")!,
            provider.codeVerifier,
            redirectUrl,
            {

            }
        );

        // Sanitize current url
        const url = new URL(window.location.href);
        let url_parts = url.toString().split('redirect');
        history.pushState(null, document.title, url_parts[0]);
        if (userData !== undefined) {
            console.log(userData)
            // SET USERDATA
            userStore.userID = userData.record!.id;
            userStore.userAvatar = userData.record!.avatar;
            userStore.username = userData.record!.username || userData.record!.name;
            
            router.push({ path: "/dashboard" });
        }
    } catch (e) {
        console.log('Err', e);
        router.push({ path: "/" });
        throw e;
    }

}

checkAuth();

</script>
<style>
html,
body {
    height: 100%;
    width: 100%;
}

#q-app {
    height: 100%;
    width: 100%;
}
</style>