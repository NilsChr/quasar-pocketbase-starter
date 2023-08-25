<template>
    <!-- SIGN UP -->
    <form>
        <div class="row justify-center">
            <h5 class="font-bold q-ma-xs">Sign Up</h5>
        </div>
        <div class="row q-ma-sm">
            <q-input class="full-width" v-model="name" label="Your name" dense outlined lazy-rules
                :rules="[val => val && val.length > 0 || 'Please type something']" />
        </div>
        <div class="row q-ma-sm">
            <q-input class="full-width" v-model="email" label="Email" dense outlined lazy-rules
                :rules="[val => validateEmail(val) || 'Enter a valid email']" />
        </div>
        <div class="row q-ma-sm">
            <q-input class="full-width" v-model="password" label="Password" type="password" name="password" dense outlined
                autocomplete="on" debounce="500"
                :rules="[val => val && (val.length >= 8 && val.length <= 72) || 'Password length must be between 8 and 72']"></q-input>

        </div>
        <div class="row q-ma-sm">
            <q-input class="full-width" v-model="passwordConfirm" label="Confirm Password" type="password" name="password"
                dense outlined autocomplete="on" :error="checkPasswordMatch !== ''" :error-message="checkPasswordMatch"
                debounce="500"></q-input>
        </div>
        <div class="row justify-center q-ma-sm">
            <q-btn unelevated class="full-width" color="primary" @click="createAccount" :disable="!validform">Create
                Account</q-btn>
        </div>
        <div class="row justify-center q-ma-sm q-mt-lg">
            <q-btn unelevated class="full-width" color="primary" @click="cancelCreateAccountMode" outline>Cancel</q-btn>
        </div>
    </form>
</template>
<script setup lang="ts">
import { usePBStore } from "src/stores/pbStore";
import { computed, ref } from "vue";

const pbStore = usePBStore();
const name = ref<string>("");
const email = ref<string>("");
const password = ref<string>("");
const passwordConfirm = ref<string>("");

const emit = defineEmits(['onCreated', 'onCancel']);

function validateEmail(email: string) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
}

const validform = computed(() => {
    let error = '';
    if (!validateEmail(email.value)) error += 'Invalid email. ';
    if (name.value.length < 2) error += 'Invalid name. ';
    if (checkPasswordLength.value !== '') error += 'Invalid password. ';
    if (checkPasswordMatch.value !== '') error += 'Invalid passwordConfirm. ';
    return error === '';
})

const cancelCreateAccountMode = () => {
    name.value = "";
    email.value = "";
    password.value = "";
    passwordConfirm.value = "";
    emit('onCancel');
}

const createAccount = async () => {

    const data = {
        name: name.value,
        email: email.value,
        emailVisibility: true,
        password: password.value,
        passwordConfirm: passwordConfirm.value,

    }
    await pbStore.client?.collection('users').create(data);
    emit('onCreated');
}

const checkPasswordLength = computed(() => {
    if (password.value.length >= 8 && password.value.length <= 72) return ''
    return 'Password length must be between 8 and 72'
})

const checkPasswordMatch = computed(() => {
    if (password.value === passwordConfirm.value) return ''
    return 'Password do not match'
})


</script>
<style scoped></style>