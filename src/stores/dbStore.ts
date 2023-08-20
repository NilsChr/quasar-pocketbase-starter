import { defineStore } from "pinia";
import PocketBase, { Record } from "pocketbase";
import { useUserStore } from "./userStore";
import generateId from "src/utils/generateId";

const url = "https://blogal.pockethost.io";
const client = new PocketBase(url);

client.authStore.onChange(() => {
  console.log("Auth Store Change");
  console.log(client.authStore.model);
});

export interface IDBStore {
  client: PocketBase;
  documents: Record[];
  loading: boolean;
  editMode: boolean;
  activeDoc: Record | null;
  documentData: string;
  searchTitle: string;
  searchTags: string;
}

export const useDBStore = defineStore("dbStore", {
  state: () =>
    ({
      client: client,
      documents: [],
      loading: false,
      editMode: false,
      activeDoc: null,
      documentData: "",
      searchTitle: "",
      searchTags: ""
    } as IDBStore),
  getters: {
    signedIn: (state): boolean => state.client.authStore.isValid,
  },
  actions: {
    async createDocument() {
      const metaID = generateId();
      const dataID = generateId();

      const metaData = {
        id: metaID,
        title: "New Document",
        dataId: null,
        owner: useUserStore().userID,
        editors: [],
        viewers: [],
        tags: "",
        projectTag: "",
      };
      const record = await client.collection("documentsMeta").create(metaData);

      const dataRecord = await client
        .collection("documentsData")
        .create({ id:dataID, data: "", metaId: record.id });

        await client.collection("documentsMeta").update(metaID, {dataId: dataID});

      
      this.loading = false;
      this.loadDocuments();

      /* OLD
      this.loading = true;
      const metaID = generateId();
      const dataID = generateId();

      const dataRecord = await client
        .collection("documentsData")
        .create({ id:dataID, data: "", metaId: metaID });

      const metaData = {
        id: metaID,
        title: "New Document",
        dataId: dataRecord.id,
        owner: useUserStore().userID,
        editors: [],
        viewers: [],
        tags: "",
        projectTag: "",
      };

      
      const record = await client.collection("documentsMeta").create(metaData);
      const updates = {
        metaId: record.id
      }
      console.log('Updating', updates);
      console.log('To ', record.dataId);
    //  await client.collection("documentsData").update(record.dataId, updates);

      this.loading = false;
      this.loadDocuments();
      */
    },
    async loadDocuments() {
      this.loading = true;
      const records = await client.collection("documentsMeta").getFullList();
      this.documents = records;
      this.loading = false;
    },
    async loadDocumentdata(id: string) {
      this.loading = true;
      const record = await client.collection("documentsData").getOne(id);
      console.log("loaded", record)
      this.loading = false;
      this.documentData = record.data;
    },
    async updateDocumentMeta(
      id: string,
      title: string,
      folder: string,
      tags: string
    ) {
      this.loading = true;
      // example update data
      const updates = {
        title,
        folder,
        tags,
      };

      const record = await client
        .collection("documentsMeta")
        .update(id, updates);
      this.loading = false;
    },
    async updateDocumentData(id: string, data: string) {
      this.loading = true;
      // example update data
      const updates = {
        data,
      };

      const record = await client
        .collection("documentsData")
        .update(id, updates);
      this.loading = false;
    },
    async deleteDocument(id: string) {
        this.loading = true;
        await client.collection("documentsMeta").delete(id);
        this.activeDoc = null;
        this.loading = false;
        this.loadDocuments();
    }
  },
});

// @request.auth.id != "" && (metaId.owner ?= @request.auth.id || metaId.editors.id ?= @request.auth.id)
