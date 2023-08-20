<template>
    <q-input v-model="text" :label="props.label" dense hideBottomSpace filled square v-if="editMode"
        @update:modelValue="valueChanged" debounce="500" />
    <div v-else class="row q-pl-sm items-center">
        <q-icon :name="props.icon" v-if="props.icon"></q-icon>
        <label class="q-pl-sm" style="font-size: 1rem;">{{ props.value }}</label>
    </div>
</template>
<script setup lang=ts>
import { storeToRefs } from 'pinia';
import { useDBStore } from 'src/stores/dbStore';
import { onMounted, ref, watch } from 'vue';

const dbStore = useDBStore();
const { editMode } = storeToRefs(dbStore);

const text = ref<string>("");

const emit = defineEmits(['changed'])

const props = defineProps({
    value: {
        type: String,
        required: true
    },
    label: {
        type: String
    },
    icon: {
        type: String
    }
})

const valueChanged = () => {
    console.log('emit')
    emit('changed', text.value);

}



onMounted(() => {
    text.value = props.value;
})

watch(() => props.value, () => {
    text.value = props.value;
})

</script>

<style>

</style>