<template>
    <div class="row column full-width fill-height" v-if="activeDoc">
        <div class="row col-auto ">
            <div class="row col-12 ">
                <div class="col-6 col-xs-12">
                    <EditableText :value="title" label="Title" icon="title" @changed="onTitleChanged" />
                </div>
                <div class="row col-6 col-xs-12">
                    <EditableText class="col-2 col-xs-auto" :value="folder" label="Folder" icon="folder"
                        @changed="onFolderChanged" />
                    <EditableText class="col-10 col-xs-auto" :value="tags" label="Tags" icon="tag"
                        @changed="onTagsChanged" />
                </div>
                <div class="col-12 row reverse">
                    <div class="row col-12 col-sm-12 reverse" v-if="editMode">
                        <q-btn size="sm" flat color="primary" @click="saveChanges" :loading="loading">Update</q-btn>
                        <q-btn size="sm" flat color="primary" @click="cancelEditMode" :loading="loading">Cancel</q-btn>

                        <div class="col-5">
                            <q-btn class="self-center" size="sm" flat color="negative" @click="deleteDocument"
                                :loading="loading">Delete</q-btn>
                        </div>
                    </div>
                    <div class="row col-2 col-sm-1 reverse" v-else="editMode">
                        <q-btn size="sm" flat color="primary" icon="edit" @click="editMode = !editMode"
                            :loading="loading" />
                    </div>
                </div>
            </div>
        </div>

        <div class="row col full-height">
            <md-editor v-if="editMode" v-model="documentData" @onChange="" @onUploadImg="onUploadImg" language="en-US"
                class="full-height" />
            <MdPreview  class="full-height" v-else :modelValue="documentData" language="en-US"/>
        </div>
    </div>
    <div v-else class="row justify-center align-center items-center fill-height full-width">
        <label>
            Select a document
            <q-icon name="auto_awesome" color="primary" size="sm" class="q-mb-lg"></q-icon>
        </label>
    </div>
</template>
<script setup lang="ts">
import { MdEditor, MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { onMounted, ref, watch } from "vue";
import EditableText from "./EditableText.vue";
import { useDBStore } from "src/stores/dbStore";
import { storeToRefs } from "pinia";
import { useQuasar } from 'quasar'

const $q = useQuasar()

const dbStore = useDBStore();
const { editMode, activeDoc, documentData, loading } = storeToRefs(dbStore);

const title = ref<string>("Title");
const folder = ref<string>("Folder");
const tags = ref<string>("Tags");

const tempTitle = ref<string>("Title");
const tempFolder = ref<string>("Folder");
const tempTags = ref<string>("Tags");
const tempText = ref<string>("Testing");

const onUploadImg = (files: any[]) => {
    console.log(Array.from(files));
}

const onTitleChanged = (val: string) => {
    title.value = val;
}

const onFolderChanged = (val: string) => {
    folder.value = val;
}

const onTagsChanged = (val: string) => {
    tags.value = val;
}

const cancelEditMode = () => {
    documentData.value = tempText.value;
    title.value = tempTitle.value;
    editMode.value = false;
}

const saveChanges = async () => {
    editMode.value = false;
    if (activeDoc.value === null) return;
    activeDoc.value.title = title.value;
    activeDoc.value.folder = folder.value;
    activeDoc.value.tags = tags.value;
    await dbStore.updateDocumentMeta(activeDoc.value.id, activeDoc.value.title, activeDoc.value.folder, activeDoc.value.tags);
    await dbStore.updateDocumentData(activeDoc.value.dataId, documentData.value);
}

const deleteDocument = async () => {
    $q.dialog({
        title: 'Delete document?',
        message: 'This will permanently delete this document',
        cancel: true
    }).onOk(async () => {
        // console.log('OK')
        if (activeDoc.value !== null)
            await dbStore.deleteDocument(activeDoc.value.id);
    }).onCancel(() => {
        // console.log('Cancel')
    }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
    })
}

const setStyle = () => {
    if (window.innerWidth > 599.99) return;
    
    setTimeout(() => {
        const el: HTMLElement = <HTMLElement>document.querySelector("#md-editor-v3-preview-wrapper");
        if (!el) {
            return;
        };
    
        if (editMode.value === true) {
            el.style.display = 'none'
        } else el.style.display = 'block'
    }, 0)
}

onMounted(() => {
    setStyle();
})

watch(() => activeDoc.value, async () => {
    if (activeDoc.value === undefined) return;
    if (activeDoc.value === null) return;

    await dbStore.loadDocumentdata(activeDoc.value.dataId);

    title.value = activeDoc.value.title;
    folder.value = activeDoc.value.folder;
    tags.value = activeDoc.value.tags;
})

watch(() => editMode.value, () => {
    if (editMode.value === true) {
        tempTitle.value = title.value;
        tempFolder.value = folder.value;
        tempTags.value = tags.value;
        tempText.value = documentData.value;
    }
    setStyle()
})

</script>
<style>
.b {
    border: 1px solid black;
}
</style>