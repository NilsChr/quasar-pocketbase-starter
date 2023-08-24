<template>
    <div class="container fluid full-height ">
        <div class="row full-height justify-center align-center items-center">
            <pre id="content">Authenticating{{ dots }}</pre>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { usePBStore } from 'src/stores/pbStore';
import { useRouter } from 'vue-router';
import { storeToRefs } from "pinia";
import { onMounted, ref } from 'vue';

const dbStore = usePBStore();
const { userData } = storeToRefs(dbStore);
const router = useRouter();

const redirectUrl = process.env.BASE_URL + '/redirect';
const params = (new URL(window.location.href)).searchParams;

const dots = ref<string>("");
let dotsCounter = 0;

const provider = JSON.parse(localStorage.getItem('provider')!)
if (provider.state !== params.get("state")) {
    throw "State parameters don't match.";
}

async function checkAuth() {
    try {
   
        userData.value = await dbStore.client?.collection('users').authWithOAuth2Code(
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
            router.push({ path: "/dashboard" });
        }
    } catch (e) {
        router.push({ path: "/" });
        throw e;
    }

}

checkAuth();

onMounted(() => {
    setInterval(function() {
        dotsCounter++;
        if(dotsCounter > 3) dotsCounter = 0;

        dots.value = new Array(dotsCounter).fill(".").join("");
    }, 250)
})

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

#content {
  font-family: "Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif;
}
</style>